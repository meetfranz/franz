import { ipcMain, BrowserWindow, Rectangle } from 'electron';
import { ServiceBrowserView } from '../../models/ServiceBrowserView';
import { loadRecipeConfig } from '../../helpers/recipe-helpers';
import {
  HIDE_ALL_SERVICES,
  NAVIGATE_SERVICE_TO, OPEN_SERVICE_DEV_TOOLS, RELOAD_SERVICE, RESIZE_SERVICE_VIEWS, RESIZE_TODO_VIEW, SHOW_ALL_SERVICES, TODOS_FETCH_WEB_CONTENTS_ID,
} from '../../ipcChannels';
import Recipe from '../../models/Recipe';
import { TODOS_RECIPE_ID } from '../../config';

const debug = require('debug')('Franz:ipcApi:browserViewManager');

interface IIPCServiceData {
  id: string,
  name: string,
  url: string,
  partition: string,
  state: {
    isActive: boolean,
    spellcheckerLanguage: string,
    isDarkModeEnabled: boolean,
    team: string,
    hasCustomIcon: boolean,
    isRestricted: boolean;
  },
  recipeId: string,
}

interface IBrowserViewCache {
  id: string;
  browserView: ServiceBrowserView;
}

const browserViews: IBrowserViewCache[] = [];

const mockTodosService = ({ isActive = false }: { isActive?: boolean }): IIPCServiceData => {
  const todosRecipe = loadRecipeConfig(TODOS_RECIPE_ID);

  return {
    id: 'franz-todos',
    name: 'Franz Todos',
    url: todosRecipe.config.serviceURL,
    partition: 'franz-todos',
    state: {
      isActive,
      spellcheckerLanguage: '',
      isDarkModeEnabled: false,
      team: '',
      hasCustomIcon: false,
      isRestricted: false,
    },
    recipeId: TODOS_RECIPE_ID,
  };
};

export default async ({ mainWindow, settings: { app: settings } }: { mainWindow: BrowserWindow, settings: any}) => {
  ipcMain.handle('browserViewManager', async (event, services: IIPCServiceData[]) => {
    try {
      debug('chached services', browserViews.map(bw => `${bw.browserView.config.name} - (${bw.browserView.config.id}) - (${bw.browserView.isActive})`));

      const todosServiceIndex = services.findIndex(service => service.recipeId === TODOS_RECIPE_ID);

      if (todosServiceIndex === -1) {
        services.push(mockTodosService({}));
      } else {
        const service = services[todosServiceIndex];
        services.splice(todosServiceIndex, 1, mockTodosService({ isActive: service.state.isActive }));
      }

      services.forEach((service) => {
        let sbw = browserViews.find(bw => bw.id === service.id)?.browserView;

        if (!sbw) {
          debug('creating new browserview', service.url);
          const recipe = new Recipe(loadRecipeConfig(service.recipeId));

          sbw = new ServiceBrowserView({
            config: {
              id: service.id,
              name: service.name,
              url: service.url,
              partition: service.partition,
            },
            state: service.state,
            recipe,
            window: mainWindow,
            settings,
          });

          sbw.initialize();
          sbw.attach();

          browserViews.push({
            id: service.id,
            browserView: sbw,
          });
        } else {
          sbw.update({
            config: {
              name: service.name,
              url: service.url,
            },
            state: service.state,
          });
        }

        debug('Is service attached', sbw.isAttached);

        if (sbw.isActive) {
          if (sbw.isRestricted) {
            browserViews.forEach(bw => bw.browserView.remove());
          } else {
            setTimeout(() => {
              sbw.setActive();
            }, 5);
          }
        }
      });

      browserViews.filter(bw => !services.some(service => service.id === bw.id)).forEach((service) => {
        debug('Removing unused service', service.browserView.config.name, service.browserView.config.id);

        browserViews.splice(browserViews.findIndex(bw => bw.id === service.id), 1);
        service.browserView.remove();
        service.browserView.destroy();
      });

      // }

      return browserViews.map(view => ({
        serviceId: view.id,
        webContentsId: view.browserView.webContents.id,
      }));
    } catch (e) {
      console.error(e);
    }
  });

  mainWindow.on('focus', () => {
    debug('Window focus, focus browserView');
    const sbw = browserViews.find(browserView => browserView.browserView.isActive);
    if (sbw) {
      sbw.browserView.focus();
    }
  });

  ipcMain.on(OPEN_SERVICE_DEV_TOOLS, (e, { serviceId }) => {
    const sbw = browserViews.find(browserView => browserView.id === serviceId);

    if (sbw) {
      debug(`Open devTools for service '${sbw.browserView.config.name}'`);
      sbw.browserView.webContents.toggleDevTools();
    }
  });

  ipcMain.on(RELOAD_SERVICE, (e, { serviceId }) => {
    const sbw = browserViews.find(browserView => browserView.id === serviceId);

    if (sbw) {
      debug(`Reload service '${sbw.browserView.config.name}'`);
      sbw.browserView.webContents.reload();
    }
  });

  ipcMain.on(NAVIGATE_SERVICE_TO, (e, { serviceId, url }) => {
    const sbw = browserViews.find(browserView => browserView.id === serviceId);

    if (sbw) {
      debug(`Navigate service '${sbw.browserView.config.name}' to`, url);
      sbw.browserView.webContents.loadURL(url);
    }
  });

  ipcMain.on(RESIZE_SERVICE_VIEWS, (e, bounds: Rectangle, animationDuration: 0) => {
    debug('Resizing service views by', bounds);

    browserViews.filter(bw => !bw.browserView.isTodos).forEach((bw) => {
      bw.browserView.resize(bounds, animationDuration);
    });
  });

  ipcMain.on(RESIZE_TODO_VIEW, (e, bounds: Rectangle, animationDuration: 0) => {
    debug('Resizing todo view by', bounds);

    browserViews.find(bw => bw.browserView.isTodos).browserView.resize(bounds, animationDuration);
  });

  ipcMain.on(HIDE_ALL_SERVICES, () => {
    debug('Hiding all services');

    browserViews.forEach(bw => bw.browserView.remove());
  });

  ipcMain.on(SHOW_ALL_SERVICES, () => {
    debug('Showing all services');

    if (browserViews.find(bw => bw.browserView.isActive)?.browserView.isRestricted) {
      return;
    }

    browserViews.forEach((bw) => {
      bw.browserView.attach();
      if (bw.browserView.isActive) {
        setTimeout(() => {
          bw.browserView.setActive();
        }, 5);
      }
    });
  });

  ipcMain.handle(TODOS_FETCH_WEB_CONTENTS_ID, () => {
    debug('Retrieving Todos webContentsId');

    const webContentsId = browserViews.find(bw => bw.browserView.isTodos)?.browserView.webContents.id;

    return webContentsId;
  });
};
