import { defaults } from './utils/defaults';
import WidgetRoutes from './routes/WidgetRoute';
import TileRoutes from './routes/TileRoute';
import PageRoutes from './routes/PageRoute';
import UserRoutes from './routes/UserRoute';
import { Widget, Tile, Page } from './models';
import { IConfig } from './types';

function setConfig(config: Partial<IConfig>) {
  if (config.logger) {
    defaults.logger = config.logger;
  }
  if (typeof config.catchAsync === 'function')
    defaults.catchAsync = config.catchAsync;
  if (Array.isArray(config.collections)) {
    defaults.collections = config.collections;
  }
}

export {
  WidgetRoutes,
  TileRoutes,
  PageRoutes,
  UserRoutes,
  Widget,
  Tile,
  Page,
  setConfig,
};
