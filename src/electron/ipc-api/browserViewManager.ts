import { ipcMain, BrowserWindow } from 'electron';
import { loadRecipeConfig } from '../../helpers/recipe-helpers';
import Recipe from '../../models/Recipe';
import { ServiceBrowserView } from '../../models/ServiceBrowserView';

const debug = require('debug')('Franz:ipcApi:browserViewManager');

interface IBrowserViewCache {
  id: string;
  browserView: ServiceBrowserView;
}

const browserViews: IBrowserViewCache[] = [];

export default async ({ mainWindow }: { mainWindow: BrowserWindow}) => {
  ipcMain.handle('browserViewManager', async (event, services) => {
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
          });

          sbw.attach();

          browserViews.push({
            id: service.id,
            browserView: sbw,
          });
        }

        if (service.state.isActive) {
          debug('service is active', service.name);
          mainWindow.setTopBrowserView(sbw.view);
        }
      });

      return browserViews.map(view => ({
        serviceId: view.id,
        webContentsId: view.browserView.webContents.id,
      }));
    } catch (e) {
      console.error(e);
    }
  });
};
