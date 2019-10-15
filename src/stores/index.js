import AppStore from './AppStore';
import UserStore from './UserStore';
import FeaturesStore from './FeaturesStore';
import SettingsStore from './SettingsStore';
import ServicesStore from './ServicesStore';
import RecipesStore from './RecipesStore';
import RecipePreviewsStore from './RecipePreviewsStore';
import UIStore from './UIStore';
import PaymentStore from './PaymentStore';
import NewsStore from './NewsStore';
import RequestStore from './RequestStore';
import GlobalErrorStore from './GlobalErrorStore';
import { workspaceStore } from '../features/workspaces';
import { announcementsStore } from '../features/announcements';
import { serviceLimitStore } from '../features/serviceLimit';
import { communityRecipesStore } from '../features/communityRecipes';
import { todosStore } from '../features/todos';
import { planSelectionStore } from '../features/planSelection';

export default (api, actions, router) => {
  const stores = {};
  Object.assign(stores, {
    router,
    app: new AppStore(stores, api, actions),
    user: new UserStore(stores, api, actions),
    features: new FeaturesStore(stores, api, actions),
    settings: new SettingsStore(stores, api, actions),
    services: new ServicesStore(stores, api, actions),
    recipes: new RecipesStore(stores, api, actions),
    recipePreviews: new RecipePreviewsStore(stores, api, actions),
    ui: new UIStore(stores, api, actions),
    payment: new PaymentStore(stores, api, actions),
    news: new NewsStore(stores, api, actions),
    requests: new RequestStore(stores, api, actions),
    globalError: new GlobalErrorStore(stores, api, actions),
    workspaces: workspaceStore,
    announcements: announcementsStore,
    serviceLimit: serviceLimitStore,
    communityRecipes: communityRecipesStore,
    todos: todosStore,
    planSelection: planSelectionStore,
  });
  // Initialize all stores
  Object.keys(stores).forEach((name) => {
    if (stores[name] && stores[name].initialize) stores[name].initialize();
  });
  return stores;
};
