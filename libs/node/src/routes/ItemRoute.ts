import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '../types';

import validate from '../utils/validate';
import * as itemValidation from '../utils/validations/item';
import * as itemController from '../controllers/ItemController';

const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express.Router() as IRouter;
routes.use(express.json());

// Item Routes
// Get all items
routes
  .get(`/:widgetId`, validate(itemValidation.list), itemController.getItems)
  .descriptor(`${descriptorPrefix}item.getAll`);
// Create a item
routes
  .post(`/`, validate(itemValidation.create), itemController.createItem)
  .descriptor(`${descriptorPrefix}item.create`);
// Update a item
routes
  .put(`/:id`, validate(itemValidation.update), itemController.updateItem)
  .descriptor(`${descriptorPrefix}item.update`);
// Delete a item
routes
  .delete(`/:id`, itemController.deleteItem)
  .descriptor(`${descriptorPrefix}item.delete`);

export default routes;
