import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '@pagecreator/api-interfaces';

import validate from '../utils/validate';
import * as tileValidation from '../utils/validations/tile';
import * as tileController from '../controllers/TileController';

const routes = express.Router() as IRouter;
routes.use(express.json());

// Tile Routes
// Get all tiles
routes
  .get(`/:widgetId`, validate(tileValidation.list), tileController.getTiles)
  .descriptor('tile.getAll');
// Create a tile
routes
  .post(`/`, validate(tileValidation.create), tileController.createTile)
  .descriptor('tile.create');
// Update a tile
routes
  .put(`/:id`, validate(tileValidation.update), tileController.updateTile)
  .descriptor('tile.update');
// Delete a tile
routes.delete(`/:id`, tileController.deleteTile).descriptor('tile.delete');

export default routes;
