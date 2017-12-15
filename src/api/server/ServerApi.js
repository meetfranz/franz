import os from 'os';
import path from 'path';
import tar from 'tar';
import fs from 'fs-extra';
import { remote } from 'electron';

import ServiceModel from '../../models/Service';
import RecipePreviewModel from '../../models/RecipePreview';
import RecipeModel from '../../models/Recipe';
import PlanModel from '../../models/Plan';
import NewsModel from '../../models/News';
import UserModel from '../../models/User';
import OrderModel from '../../models/Order';

import { sleep } from '../../helpers/async-helpers';

import { API } from '../../environment';

import {
  getRecipeDirectory,
  getDevRecipeDirectory,
  loadRecipeConfig,
} from '../../helpers/recipe-helpers';

module.paths.unshift(
  getDevRecipeDirectory(),
  getRecipeDirectory(),
);

const { app } = remote;
const fetch = remote.require('electron-fetch');

const SERVER_URL = API;
const API_VERSION = 'v1';

export default class ServerApi {
  recipePreviews = [];
  recipes = [];

  // User
  async login(email, passwordHash) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/auth/login`, this._prepareAuthRequest({
      method: 'POST',
      headers: {
        Authorization: `Basic ${window.btoa(`${email}:${passwordHash}`)}`,
      },
    }, false));
    if (!request.ok) {
      throw request;
    }
    const u = await request.json();

    console.debug('ServerApi::login resolves', u);
    return u.token;
  }

  async signup(data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/auth/signup`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify(data),
    }, false));
    if (!request.ok) {
      throw request;
    }
    const u = await request.json();

    console.debug('ServerApi::signup resolves', u);
    return u.token;
  }

  async inviteUser(data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/invite`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify(data),
    }));
    if (!request.ok) {
      throw request;
    }

    console.debug('ServerApi::inviteUser');
    return true;
  }

  async retrievePassword(email) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/auth/password`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    }, false));
    if (!request.ok) {
      throw request;
    }
    const r = await request.json();

    console.debug('ServerApi::retrievePassword');
    return r;
  }

  async userInfo() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const user = new UserModel(data);
    console.debug('ServerApi::userInfo resolves', user);

    return user;
  }

  async updateUserInfo(data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me`, this._prepareAuthRequest({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
    if (!request.ok) {
      throw request;
    }
    const updatedData = await request.json();

    const user = Object.assign(updatedData, { data: new UserModel(updatedData.data) });
    console.debug('ServerApi::updateUserInfo resolves', user);
    return user;
  }

  async deleteAccount() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me`, this._prepareAuthRequest({
      method: 'DELETE',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    console.debug('ServerApi::deleteAccount resolves', data);
    return data;
  }

  // Services
  async getServices() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me/services`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    let services = await this._mapServiceModels(data);
    services = services.filter(service => service !== null);
    console.debug('ServerApi::getServices resolves', services);
    return services;
  }

  async createService(recipeId, data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/service`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify(Object.assign({
        recipeId,
      }, data)),
    }));
    if (!request.ok) {
      throw request;
    }
    const serviceData = await request.json();
    const service = Object.assign(serviceData, { data: await this._prepareServiceModel(serviceData.data) });

    console.debug('ServerApi::createService resolves', service);
    return service;
  }

  async updateService(recipeId, data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/service/${recipeId}`, this._prepareAuthRequest({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
    if (!request.ok) {
      throw request;
    }
    const serviceData = await request.json();
    const service = Object.assign(serviceData, { data: await this._prepareServiceModel(serviceData.data) });

    console.debug('ServerApi::updateService resolves', service);
    return service;
  }

  async reorderService(data) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/service/reorder`, this._prepareAuthRequest({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
    if (!request.ok) {
      throw request;
    }
    const serviceData = await request.json();
    console.debug('ServerApi::reorderService resolves', serviceData);
    return serviceData;
  }

  async deleteService(id) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/service/${id}`, this._prepareAuthRequest({
      method: 'DELETE',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    console.debug('ServerApi::deleteService resolves', data);
    return data;
  }

  // Recipes
  async getInstalledRecipes() {
    const recipesDirectory = getRecipeDirectory();
    const paths = fs.readdirSync(recipesDirectory)
      .filter(file => (
        fs.statSync(path.join(recipesDirectory, file)).isDirectory()
        && file !== 'temp'
        && file !== 'dev'
      ));

    this.recipes = paths.map((id) => {
      // eslint-disable-next-line
      const Recipe = require(id)(RecipeModel);
      return new Recipe(loadRecipeConfig(id));
    }).filter(recipe => recipe.id);

    this.recipes = this.recipes.concat(this._getDevRecipes());

    console.debug('StubServerApi::getInstalledRecipes resolves', this.recipes);
    return this.recipes;
  }

  async getRecipeUpdates(recipeVersions) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/recipes/update`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify(recipeVersions),
    }));
    if (!request.ok) {
      throw request;
    }
    const recipes = await request.json();
    console.debug('ServerApi::getRecipeUpdates resolves', recipes);
    return recipes;
  }

  // Recipes Previews
  async getRecipePreviews() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/recipes`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const recipePreviews = this._mapRecipePreviewModel(data);
    console.debug('ServerApi::getRecipes resolves', recipePreviews);

    return recipePreviews;
  }

  async getFeaturedRecipePreviews() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/recipes/popular`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    // data = this._addLocalRecipesToPreviews(data);

    const recipePreviews = this._mapRecipePreviewModel(data);
    console.debug('ServerApi::getFeaturedRecipes resolves', recipePreviews);
    return recipePreviews;
  }

  async searchRecipePreviews(needle) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/recipes/search?needle=${needle}`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const recipePreviews = this._mapRecipePreviewModel(data);
    console.debug('ServerApi::searchRecipePreviews resolves', recipePreviews);
    return recipePreviews;
  }

  async getRecipePackage(recipeId) {
    try {
      const recipesDirectory = path.join(app.getPath('userData'), 'recipes');

      const recipeTempDirectory = path.join(recipesDirectory, 'temp', recipeId);
      const archivePath = path.join(recipeTempDirectory, 'recipe.tar.gz');
      const packageUrl = `${SERVER_URL}/${API_VERSION}/recipes/download/${recipeId}`;

      fs.ensureDirSync(recipeTempDirectory);
      const res = await fetch(packageUrl);
      console.debug('Recipe downloaded', recipeId);
      const buffer = await res.buffer();
      fs.writeFileSync(archivePath, buffer);

      await sleep(10);

      await tar.x({
        file: archivePath,
        cwd: recipeTempDirectory,
        preservePaths: true,
        unlink: true,
        preserveOwner: false,
        onwarn: x => console.log('warn', recipeId, x),
      });

      await sleep(10);

      const { id } = fs.readJsonSync(path.join(recipeTempDirectory, 'package.json'));
      const recipeDirectory = path.join(recipesDirectory, id);
      fs.copySync(recipeTempDirectory, recipeDirectory);
      fs.remove(recipeTempDirectory);
      fs.remove(path.join(recipesDirectory, recipeId, 'recipe.tar.gz'));

      return id;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

  // Payment
  async getPlans() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/payment/plans`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const plan = new PlanModel(data);
    console.debug('ServerApi::getPlans resolves', plan);
    return plan;
  }

  async getHostedPage(planId) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/payment/init`, this._prepareAuthRequest({
      method: 'POST',
      body: JSON.stringify({
        planId,
      }),
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    console.debug('ServerApi::getHostedPage resolves', data);
    return data;
  }

  async getPaymentDashboardUrl() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me/billing`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    console.debug('ServerApi::getPaymentDashboardUrl resolves', data);
    return data;
  }

  async getSubscriptionOrders() {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/me/subscription`, this._prepareAuthRequest({
      method: 'GET',
    }));
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();
    const orders = this._mapOrderModels(data);
    console.debug('ServerApi::getSubscriptionOrders resolves', orders);
    return orders;
  }

  // News
  async getLatestNews() {
    // eslint-disable-next-line
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/news?platform=${os.platform()}&arch=${os.arch()}&version=${app.getVersion()}`,
      this._prepareAuthRequest({
        method: 'GET',
      }));

    if (!request.ok) {
      throw request;
    }
    const data = await request.json();
    const news = this._mapNewsModels(data);
    console.debug('ServerApi::getLatestNews resolves', news);
    return news;
  }

  async hideNews(id) {
    const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/news/${id}/read`,
      this._prepareAuthRequest({
        method: 'GET',
      }));

    if (!request.ok) {
      throw request;
    }

    console.debug('ServerApi::hideNews resolves', id);
  }

  // Health Check
  async healthCheck() {
    const request = await window.fetch(`${SERVER_URL}/health`, this._prepareAuthRequest({
      method: 'GET',
    }, false));
    if (!request.ok) {
      throw request;
    }
    console.debug('ServerApi::healthCheck resolves');
  }

  async getLegacyServices() {
    const file = path.join(app.getPath('userData'), 'settings', 'services.json');

    try {
      const config = fs.readJsonSync(file);

      if (Object.prototype.hasOwnProperty.call(config, 'services')) {
        const services = await Promise.all(config.services.map(async (s) => {
          const service = s;
          const request = await window.fetch(`${SERVER_URL}/${API_VERSION}/recipes/${s.service}`,
            this._prepareAuthRequest({
              method: 'GET',
            }),
          );

          if (request.status === 200) {
            const data = await request.json();
            service.recipe = new RecipePreviewModel(data);
          }

          return service;
        }));

        console.debug('ServerApi::getLegacyServices resolves', services);
        return services;
      }
    } catch (err) {
      throw (new Error('ServerApi::getLegacyServices no config found'));
    }

    return [];
  }

  // Helper
  async _mapServiceModels(services) {
    const recipes = services.map(s => s.recipeId);

    await this._bulkRecipeCheck(recipes);

    return Promise.all(services
      .map(async service => await this._prepareServiceModel(service)) // eslint-disable-line
    );
  }

  async _prepareServiceModel(service) {
    let recipe;
    try {
      recipe = this.recipes.find(r => r.id === service.recipeId);

      if (!recipe) {
        console.warn(`Recipe ${service.recipeId} not loaded`);
        return null;
      }

      return new ServiceModel(service, recipe);
    } catch (e) {
      console.debug(e);
      return null;
    }
  }

  async _bulkRecipeCheck(unfilteredRecipes) {
    // Filter recipe duplicates as we don't need to download 3 Slack recipes
    const recipes = unfilteredRecipes.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

    return Promise.all(recipes
      .map(async (recipeId) => {
        let recipe = this.recipes.find(r => r.id === recipeId);

        if (!recipe) {
          console.warn(`Recipe '${recipeId}' not installed, trying to fetch from server`);

          await this.getRecipePackage(recipeId);

          console.debug('Rerun ServerAPI::getInstalledRecipes');
          await this.getInstalledRecipes();

          recipe = this.recipes.find(r => r.id === recipeId);

          if (!recipe) {
            console.warn(`Could not load recipe ${recipeId}`);
            return null;
          }
        }

        return recipe;
      }),
    ).catch(err => console.error('Can\'t load recipe', err));
  }

  _mapRecipePreviewModel(recipes) {
    return recipes.map((recipe) => {
      try {
        return new RecipePreviewModel(recipe);
      } catch (e) {
        console.error(e);
        return null;
      }
    }).filter(recipe => recipe !== null);
  }

  _mapNewsModels(news) {
    return news.map((newsItem) => {
      try {
        return new NewsModel(newsItem);
      } catch (e) {
        console.error(e);
        return null;
      }
    }).filter(newsItem => newsItem !== null);
  }

  _mapOrderModels(orders) {
    return orders.map((orderItem) => {
      try {
        return new OrderModel(orderItem);
      } catch (e) {
        console.error(e);
        return null;
      }
    }).filter(orderItem => orderItem !== null);
  }

  _prepareAuthRequest(options, auth = true) {
    const request = Object.assign(options, {
      mode: 'cors',
      headers: Object.assign({
        'Content-Type': 'application/json',
        'X-Franz-Source': 'desktop',
        'X-Franz-Version': app.getVersion(),
        'X-Franz-platform': process.platform,
        'X-Franz-Timezone-Offset': new Date().getTimezoneOffset(),
        'X-Franz-System-Locale': app.getLocale(),
      }, options.headers),
    });

    if (auth) {
      request.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
    }

    return request;
  }

  _getDevRecipes() {
    const recipesDirectory = getDevRecipeDirectory();
    try {
      const paths = fs.readdirSync(recipesDirectory)
        .filter(file => fs.statSync(path.join(recipesDirectory, file)).isDirectory() && file !== 'temp');

      const recipes = paths.map((id) => {
        let Recipe;
        try {
          // eslint-disable-next-line
          Recipe = require(id)(RecipeModel);
          return new Recipe(loadRecipeConfig(id));
        } catch (err) {
          console.error(err);
        }

        return false;
      }).filter(recipe => recipe.id).map((data) => {
        const recipe = data;

        recipe.icons = {
          svg: `${recipe.path}/icon.svg`,
          png: `${recipe.path}/icon.png`,
        };
        recipe.local = true;

        return data;
      });

      return recipes;
    } catch (err) {
      console.debug('Could not load dev recipes');
      return false;
    }
  }
}
