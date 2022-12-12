import { defaults } from './utils/defaults';
import WidgetRoutes from './routes/WidgetRoute';
import ItemRoutes from './routes/ItemRoute';
import PageRoutes from './routes/PageRoute';
import UserRoutes from './routes/UserRoute';
import { Widget, Item, Page } from './models';
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
  ItemRoutes,
  PageRoutes,
  UserRoutes,
  Widget,
  Item,
  Page,
  setConfig,
};
