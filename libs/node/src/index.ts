import { defaults } from './utils/defaults';
import WidgetRoutes from './routes/WidgetRoute';
import PageRoutes from './routes/PageRoute';
import UserRoutes from './routes/UserRoute';
import {
  Widget,
  Item,
  Page,
  Tab,
  SrcSet,
  WidgetSchema,
  ItemSchema,
  PageSchema,
  SrcSetSchema,
  TabSchema,
} from './models';
import { IConfig } from './types';
import { handleUpdateData, handleResetData } from './services/dataService';

function setConfig(config: Partial<IConfig>) {
  if (config.logger) {
    defaults.logger = config.logger;
  }
  if (typeof config.catchAsync === 'function')
    defaults.catchAsync = config.catchAsync;
  if (typeof config.getModals === 'function')
    defaults.getModals = config.getModals;
  if (Array.isArray(config.collections)) {
    defaults.collections = config.collections;
  }
  if (Array.isArray(config.customWidgetTypes)) {
    defaults.customWidgetTypes = config.customWidgetTypes;
  }
  if (typeof config.redis === 'string' || typeof config.redis === 'object') {
    defaults.redis = config.redis;
  }
  if (Array.isArray(config.languages) && config.languages.length > 0) {
    defaults.languages = config.languages;
  }
}

export {
  WidgetRoutes,
  PageRoutes,
  UserRoutes,
  Widget,
  Item,
  Page,
  Tab,
  SrcSet,
  WidgetSchema,
  ItemSchema,
  PageSchema,
  SrcSetSchema,
  TabSchema,
  setConfig,
  handleResetData,
  handleUpdateData,
};
