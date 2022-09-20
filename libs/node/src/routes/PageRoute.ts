import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('express-list-endpoints-descriptor')(express);
import { IRouter } from '../types';

import validate from '../utils/validate';
import * as pageValidation from '../utils/validations/page';
import * as pageController from '../controllers/PageController';

const descriptorPrefix = process.env['PAGECREATOR_DESCRIPTOR_PREFIX'] || '';
const routes = express.Router() as IRouter;
routes.use(express.json());

// Get all pages
routes
  .post(`/list`, validate(pageValidation.list), pageController.getPages)
  .descriptor(`${descriptorPrefix}page.getAll`);
// Create a page
routes
  .post(`/`, validate(pageValidation.create), pageController.createPage)
  .descriptor(`${descriptorPrefix}page.create`);
// Update a page
routes
  .put(`/:id`, validate(pageValidation.update), pageController.updatePage)
  .descriptor(`${descriptorPrefix}page.update`);
// Delete a page
routes
  .delete(`/:id`, pageController.deletePage)
  .descriptor(`${descriptorPrefix}page.delete`);

export default routes;
