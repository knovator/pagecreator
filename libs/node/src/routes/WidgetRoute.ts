import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '../types';

import validate from '../utils/validate';
import * as tabValidation from '../utils/validations/tab';
import * as widgetValidation from '../utils/validations/widget';
import * as widgetController from '../controllers/WidgetController';
import * as tabController from '../controllers/TabController';

const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express.Router() as IRouter;
routes.use(express.json());

// Widget Routes
// Get widget types
routes
  .get('/widget-types', widgetController.getItemsTypes)
  .descriptor(`${descriptorPrefix}widget.getItemsTypes`);
// Get widget selection types
routes
  .get('/selection-types', widgetController.getWidgetTypes)
  .descriptor(`${descriptorPrefix}widget.getWidgetTypes`);
// Get all widgets
routes
  .post(`/list`, validate(widgetValidation.list), widgetController.getWidgets)
  .descriptor(`${descriptorPrefix}widget.getAll`);
// Create a widget
routes
  .post(`/`, validate(widgetValidation.create), widgetController.createWidget)
  .descriptor(`${descriptorPrefix}widget.create`);
// Update a widget
routes
  .put(`/:id`, validate(widgetValidation.update), widgetController.updateWidget)
  .descriptor(`${descriptorPrefix}widget.update`);
// Partial Update a widget
routes
  .patch(
    `/:id`,
    validate(widgetValidation.partialUpdate),
    widgetController.partialUpdateWidget
  )
  .descriptor(`${descriptorPrefix}widget.partialUpdate`);
// Delete a widget
routes
  .delete(`/:id`, widgetController.deleteWidget)
  .descriptor(`${descriptorPrefix}widget.delete`);
// Get dynamic collection data
routes
  .post(
    '/collection-data',
    validate(widgetValidation.getCollectionData),
    widgetController.getCollectionData
  )
  .descriptor(`${descriptorPrefix}widget.getCollectionData`);
// Tabs
routes
  .post('/tabs', validate(tabValidation.create), tabController.createTab)
  .descriptor(`${descriptorPrefix}tab.create`);
routes
  .put('/tabs/:tabId', validate(tabValidation.update), tabController.updateTab)
  .descriptor(`${descriptorPrefix}tab.update`);
routes
  .delete('/tabs/:tabId', tabController.deleteTab)
  .descriptor(`${descriptorPrefix}tab.delete`);
routes
  .get('/tabs/:widgetId', tabController.getTabs)
  .descriptor(`${descriptorPrefix}tab.getAll`);

export default routes;
