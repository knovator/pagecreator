import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '@pagecreator/api-interfaces';

import validate from '../utils/validate';
import * as widgetValidation from '../utils/validations/widget';
import * as widgetController from '../controllers/WidgetController';

const routes = express.Router() as IRouter;
routes.use(express.json());

// Widget Routes
// Get widget types
routes
  .get('/widget-types', widgetController.getWidgetTypes)
  .descriptor('widget.getWidgetTypes');
// Get widget selection types
routes
  .get('/selection-types', widgetController.getSelectionTypes)
  .descriptor('widget.getSelectionTypes');
// Get all widgets
routes
  .post(`/list`, validate(widgetValidation.list), widgetController.getWidgets)
  .descriptor('widget.getAll');
// Create a widget
routes
  .post(`/`, validate(widgetValidation.create), widgetController.createWidget)
  .descriptor('widget.create');
// Update a widget
routes
  .put(`/:id`, validate(widgetValidation.update), widgetController.updateWidget)
  .descriptor('widget.update');
// Partial Update a widget
routes
  .patch(
    `/:id`,
    validate(widgetValidation.partialUpdate),
    widgetController.partialUpdateWidget
  )
  .descriptor('widget.update');
// Delete a widget
routes
  .delete(`/:id`, widgetController.deleteWidget)
  .descriptor('widget.delete');
// Get dynamic collection data
routes
  .post(
    '/collection-data',
    validate(widgetValidation.getCollectionData),
    widgetController.getCollectionData
  )
  .descriptor('widget.getCollectionData');

export default routes;
