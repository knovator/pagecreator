import './db/db';
import './models/notification';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import FileUploadRoute from './routes/fileuploadRoute';
import { resize } from '@knovator/image-resizer';
import {
  setConfig,
  PageRoutes,
  WidgetRoutes,
  UserRoutes,
  handleUpdateData,
} from '@knovator/pagecreator-node';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
setConfig({
  collections: [
    {
      title: 'Notifications',
      collectionName: 'notifications',
      searchColumns: ['name', 'code'],
    },
    {
      title: 'Project Assessments',
      collectionName: 'project_assessment',
      searchColumns: ['assessmentNm', 'projectNm'],
    },
  ],
  // redis: {
  //   HOST: 'localhost',
  //   PORT: 6379,
  //   DB: 1,
  // },
  languages: [
    {
      name: 'English',
      code: 'en',
    },
    {
      name: 'Hindi',
      code: 'hi',
    },
  ],
});
app.get('/status', (_req, res) => {
  res.send('All Okay');
});
app.use('/widgets', WidgetRoutes);
app.use('/media', FileUploadRoute);
app.use('/pages', PageRoutes);
app.use('/users', UserRoutes);
app.get('/delete', (req, res) => {
  if (typeof req.query.id === 'string')
    handleUpdateData('notifications', req.query.id, mongoose.models);
  res.send('All Okay');
});
app.use(resize(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public')));

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
