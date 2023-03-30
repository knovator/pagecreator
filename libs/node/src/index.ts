import Joi from 'joi';
import { defaults } from './utils/defaults';
import WidgetRoutes from './routes/WidgetRoute';
import PageRoutes from './routes/PageRoute';
import UserRoutes from './routes/UserRoute';
import { Widget, Item, Page } from './models';
import { IConfig } from './types';

const categoryObject = Joi.object().keys({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

const categories = Joi.array().items(categoryObject);

function setConfig(config: Partial<IConfig>) {
  if (config.logger) {
    defaults.logger = config.logger;
  }
  if (typeof config.catchAsync === 'function')
    defaults.catchAsync = config.catchAsync;
  if (Array.isArray(config.collections)) {
    defaults.collections = config.collections;
  }
  if (Array.isArray(config.categories)) {
    const categoriesStatus = categories.validate(config.categories); // throws error if categories are not in correct format
    if (categoriesStatus.error) {
      console.error(
        'Categories are not in correct format. Categories should be an array of { label: "", value: "" }.'
      );
    } else defaults.categories = config.categories;
  }
}

export { WidgetRoutes, PageRoutes, UserRoutes, Widget, Item, Page, setConfig };
