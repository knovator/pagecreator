import './db/db';
import './models';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import appRoutes from './routes';
import {
  setConfig,
  TileRoutes,
  PageRoutes,
  WidgetRoutes,
  UserRoutes,
} from '@knovator/pagecreator-node';

const app = express();
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(express.json());
setConfig({
  collections: [
    {
      title: 'Notifications',
      collectionName: 'notifications',
      filters: { isDeleted: false, isActive: true },
      searchColumns: ['name', 'code'],
    },
    {
      title: 'Category',
      collectionName: 'category',
      lookup: {
        from: 'file',
        let: {
          id: '$fileId',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$id'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              nm: 1,
              uri: 1,
              mimeType: 1,
            },
          },
        ],
        as: 'fileId',
      },
    },
    {
      title: 'Product',
      collectionName: 'product',
      lookup: {
        from: 'file',
        let: {
          id: '$fileId',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$id'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              nm: 1,
              uri: 1,
              mimeType: 1,
            },
          },
        ],
        as: 'fileId',
      },
    },
  ],
});
app.get('/status', (_req, res) => {
  res.send('All Okay');
});
app.use('/widgets', WidgetRoutes);
app.use('/tiles', TileRoutes);
app.use('/pages', PageRoutes);
app.use('/users', UserRoutes);
app.use(appRoutes);
app.use(express.static(path.join(__dirname, './public')));

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
