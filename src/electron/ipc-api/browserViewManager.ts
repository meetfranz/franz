import { ipcMain, BrowserWindow } from 'electron';
import { loadRecipeConfig } from '../../helpers/recipe-helpers';
import Recipe from '../../models/Recipe';
import { ServiceBrowserView } from '../../models/ServiceBrowserView';

const debug = require('debug')('Franz:ipcApi:browserViewManager');

interface IBrowserViewCache {
  id: string;
  browserView: ServiceBrowserView;
  isActive: boolean;
}

const browserViews: IBrowserViewCache[] = [];

export default async ({ mainWindow, settings: { app: settings } }: { mainWindow: BrowserWindow, settings: any}) => {
  ipcMain.on('browserViewManager', async (event, services) => {
    try {
      services.forEach((service: any) => {
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

          sbw.attach();

          browserViews.push({
            id: service.id,
            browserView: sbw,
            isActive: service.state.isActive,
          });
        }

        if (service.state.isActive) {
          sbw.setActive();
        }
      });

      // return browserViews.map(view => ({
      //   serviceId: view.id,
      //   webContentsId: view.browserView.webContents.id,
      // }));
    } catch (e) {
      console.error(e);
    }
  });

  mainWindow.on('focus', () => {
    debug('Window focus, focus browserView');
    const sbw = browserViews.find(browserView => browserView.isActive);
    if (sbw) {
      sbw.browserView.focus();
    }
  });
};
