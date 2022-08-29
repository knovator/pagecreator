import { defaults } from './utils/defaults';
import WidgetRoutes from './routes/WidgetRoute';
import TileRoutes from './routes/TileRoute';
import PageRoutes from './routes/PageRoute';
import { Widget, Tile, Page } from './models';
import { IConfig } from '@pagecreator/api-interfaces';

function setConfig(config: IConfig) {
  if (config.logger) {
    defaults.logger = config.logger;
  }
  if (typeof config.catchAsync === 'function')
    defaults.catchAsync = config.catchAsync;
  if (Array.isArray(config.collections)) {
    defaults.collections = config.collections;
  }
}

export { WidgetRoutes, TileRoutes, PageRoutes, Widget, Tile, Page, setConfig };
