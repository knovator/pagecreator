import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '../types';

import validate from '../utils/validate';
import * as userValidation from '../utils/validations/user';
import * as userController from '../controllers/UserController';

const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express.Router() as IRouter;
routes.use(express.json());

// Tile Routes
// Get Widget Data
routes
  .post(
    `/widget-data`,
    validate(userValidation.getWidgetData),
    userController.getWidgetData
  )
  .descriptor(`${descriptorPrefix}user.getWidgetData`);

routes
  .post(
    '/page-data',
    validate(userValidation.getPageData),
    userController.getPageData
  )
  .descriptor(`${descriptorPrefix}user.getPageData`);

export default routes;
