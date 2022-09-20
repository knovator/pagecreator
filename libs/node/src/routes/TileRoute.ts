import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '../types';

import validate from '../utils/validate';
import * as tileValidation from '../utils/validations/tile';
import * as tileController from '../controllers/TileController';

const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express.Router() as IRouter;
routes.use(express.json());

// Tile Routes
// Get all tiles
routes
  .get(`/:widgetId`, validate(tileValidation.list), tileController.getTiles)
  .descriptor(`${descriptorPrefix}tile.getAll`);
// Create a tile
routes
  .post(`/`, validate(tileValidation.create), tileController.createTile)
  .descriptor(`${descriptorPrefix}tile.create`);
// Update a tile
routes
  .put(`/:id`, validate(tileValidation.update), tileController.updateTile)
  .descriptor(`${descriptorPrefix}tile.update`);
// Delete a tile
routes
  .delete(`/:id`, tileController.deleteTile)
  .descriptor(`${descriptorPrefix}tile.delete`);

export default routes;
