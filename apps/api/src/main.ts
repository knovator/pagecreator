import './db/db';
import './models/notification';
import Blog from './models/blog';
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
    {
      title: 'Blogs',
      collectionName: 'blogs',
      searchColumns: ['title', 'name', 'slug'],
      match: { isPublished: true, isActive: true },
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

// Seed test blogs
async function seedBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany([
        {
          title: 'Getting Started with React',
          value: '123123123123',
          name: 'Getting Started with React',
          description: 'A beginner guide to building user interfaces with React.',
          slug: 'getting-started-with-react',
          coverImage: '/image/react_intro.png',
          isPublished: true,
          isActive: true,
          isDeleted: false,
          publishedAt: new Date('2025-08-10T10:00:00.000Z'),
          viewCount: 250,
          author: { id: '68c2d1d8ffb1adbf30004ded', nm: 'Ragnar Lothbrok', isActive: true },
          category: [{ id: '68c92a0426291fe3408a8141', nm: 'Technology', slug: 'technology', isActive: true }],
        },
        {
          title: 'Understanding MongoDB Aggregations',
          value: '123123123123234',
          name: 'Understanding MongoDB Aggregations',
          description: 'Deep dive into MongoDB aggregation pipelines and their use cases.',
          slug: 'understanding-mongodb-aggregations',
          coverImage: '/image/mongodb_agg.png',
          isPublished: true,
          isActive: true,
          isDeleted: false,
          publishedAt: new Date('2025-09-01T08:30:00.000Z'),
          viewCount: 180,
          author: { id: '68c2d1d8ffb1adbf30004ded', nm: 'Ragnar Lothbrok', isActive: true },
          category: [{ id: '68c92a0426291fe3408a8142', nm: 'Database', slug: 'database', isActive: true }],
        },
        {
          title: 'Building REST APIs with Express',
          value: '123123123123234234',
          name: 'Building REST APIs with Express',
          description: 'Learn how to create robust REST APIs using Express.js.',
          slug: 'building-rest-apis-with-express',
          coverImage: '/image/express_api.png',
          isPublished: true,
          isActive: true,
          isDeleted: false,
          publishedAt: new Date('2025-09-10T14:00:00.000Z'),
          viewCount: 320,
          author: { id: '68c2d1d8ffb1adbf30004ded', nm: 'Ragnar Lothbrok', isActive: true },
          category: [{ id: '68c92a0426291fe3408a8141', nm: 'Technology', slug: 'technology', isActive: true }],
        },
        {
          title: 'CSS Grid vs Flexbox',
          value: '123123123123234234234234',
          name: 'CSS Grid vs Flexbox',
          description: 'Comparing CSS Grid and Flexbox for modern web layouts.',
          slug: 'css-grid-vs-flexbox',
          coverImage: '/image/css_layout.png',
          isPublished: true,
          isActive: true,
          isDeleted: false,
          publishedAt: new Date('2025-09-15T12:00:00.000Z'),
          viewCount: 95,
          author: { id: '68c2d1d8ffb1adbf30004ded', nm: 'Ragnar Lothbrok', isActive: true },
          category: [{ id: '68c92a0426291fe3408a8143', nm: 'Design', slug: 'design', isActive: true }],
        },
        {
          title: 'TypeScript Best Practices',
          name: 'TypeScript Best Practices',
          description: 'Tips and patterns for writing clean TypeScript code.',
          slug: 'typescript-best-practices',
          coverImage: '/image/typescript_tips.png',
          isPublished: true,
          isActive: true,
          isDeleted: false,
          publishedAt: new Date('2025-09-16T09:12:50.750Z'),
          viewCount: 410,
          author: { id: '68c2d1d8ffb1adbf30004ded', nm: 'Ragnar Lothbrok', isActive: true },
          category: [{ id: '68c92a0426291fe3408a8141', nm: 'Technology', slug: 'technology', isActive: true }],
        },
      ]);
    }
  } catch (err) {
    console.error('Error seeding blogs:', err);
  }
}

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
  seedBlogs();
});
server.on('error', console.error);
