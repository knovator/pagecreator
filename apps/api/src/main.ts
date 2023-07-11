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
} from '@knovator/pagecreator-node';

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
      title: 'Categories',
      collectionName: 'category',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters: { deletedAt: { $exists: false }, isActive: true },
      searchColumns: ['nm'],
      aggregations: [
        {
          $match: {
            deletedAt: { $exists: false },
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'file',
            let: {
              id: '$fileId',
              skills: { $ifNull: ['$skillIds.id', []] },
              domains: { $ifNull: ['$domain.id', []] },
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
              {
                $lookup: {
                  from: 'jobs',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $ne: [
                                {
                                  $size: {
                                    $setIntersection: [
                                      '$skillIds.id',
                                      '$$skills',
                                    ],
                                  },
                                },
                                0,
                              ],
                            },
                            {
                              $in: ['$jobDomainId', '$$domains'],
                            },
                          ],
                        },
                        deletedAt: { $exists: false },
                        isActive: true,
                        isDraft: false,
                      },
                    },
                  ],
                  as: 'jobs',
                },
              },
              {
                $addFields: {
                  openings: { $size: '$jobs' },
                },
              },
              { $unset: 'jobs' },
            ],
            as: 'fileId',
          },
        },
        {
          $addFields: {
            openings: { $arrayElemAt: ['$fileId.openings', 0] },
            'fileId.openings': undefined,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            updatedAt: 0,
            updatedBy: 0,
          },
        },
      ],
    },
    {
      title: 'Jobs',
      collectionName: 'jobs',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters: { deletedAt: { $exists: false }, isActive: true },
      searchColumns: ['title', 'desc'],
      aggregations: [
        {
          $lookup: {
            from: 'company',
            let: {
              id: '$compId',
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
                  logoId: 1,
                },
              },
              {
                $lookup: {
                  from: 'file',
                  let: {
                    logoId: '$logoId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', '$$logoId'],
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        uri: 1,
                        nm: 1,
                      },
                    },
                  ],
                  as: 'logoId',
                },
              },
              {
                $unwind: '$logoId',
              },
              {
                $lookup: {
                  from: 'reviews',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$compId', '$$id'],
                        },
                        isActive: true,
                        deletedAt: { $exists: false },
                      },
                    },
                  ],
                  as: 'reviews',
                },
              },
              {
                $addFields: {
                  avgStars: {
                    $cond: {
                      if: { $ne: [{ $size: '$reviews' }, 0] },
                      then: { $round: [{ $avg: '$reviews.stars' }, 1] },
                      else: 0,
                    },
                  },
                  totalReviews: { $size: '$reviews' },
                },
              },
              { $unset: ['reviews'] },
            ],
            as: 'compId',
          },
        },
        {
          $addFields: {
            compId: {
              $cond: [
                { $ne: [{ $size: '$compId' }, 0] },
                '$compId',
                [{ avgStars: 0, totalReviews: 0 }],
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'master',
            let: { typeId: '$loc.typeId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$typeId'],
                  },
                  isActive: true,
                },
              },
            ],
            as: 'locType',
          },
        },
        { $unwind: { path: '$locType', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            'loc.code': '$locType.code',
            'loc.typeNm': '$locType.name',
          },
        },
        {
          $sort: {
            activatedAt: -1,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            posLevNm: 1,
            compId: 1,
            keyWords: {
              keyWordsNm: 1,
            },
            compNm: 1,
            loc: {
              countryNm: 1,
              cityName: 1,
              code: 1,
              typeNm: 1,
            },
            skillIds: {
              _id: 1,
              skillNm: 1,
            },
            activatedAt: 1,
            jobhighlights: 1,
            isActive: 1,
            slug: 1,
            yearOfExpNm: 1,
          },
        },
      ],
    },
    {
      title: 'Companies',
      collectionName: 'company',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters: { deletedAt: { $exists: false }, compNm: { $exists: true } },
      searchColumns: ['compNm', 'email'],
      aggregations: [
        {
          $match: {
            deletedAt: { $exists: false },
            isActive: true,
            compNm: { $exists: true },
          },
        },
        {
          $lookup: {
            from: 'file',
            let: {
              id: '$logoId',
              compId: '$_id',
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
                },
              },
              {
                $lookup: {
                  from: 'reviews',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$compId', '$$compId'],
                        },
                        isActive: true,
                        deletedAt: { $exists: false },
                      },
                    },
                  ],
                  as: 'reviews',
                },
              },
              {
                $addFields: {
                  avgStars: {
                    $cond: {
                      if: { $ne: [{ $size: '$reviews' }, 0] },
                      then: { $round: [{ $avg: '$reviews.stars' }, 1] },
                      else: 0,
                    },
                  },
                  totalReviews: { $size: '$reviews' },
                },
              },
              { $unset: 'reviews' },
            ],
            as: 'logo',
          },
        },
        {
          $addFields: {
            avgStars: {
              $cond: [
                { $eq: [{ $size: '$logo' }, 0] },
                0,
                { $arrayElemAt: ['$logo.avgStars', 0] },
              ],
            },
            totalReviews: {
              $cond: [
                { $eq: [{ $size: '$logo' }, 0] },
                0,
                { $arrayElemAt: ['$logo.totalReviews', 0] },
              ],
            },
            'logo.avgStars': undefined,
            'logo.totalReviews': undefined,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            plnType: 0,
            planNm: 0,
            compLinkedInURL: 0,
            aboutUs: 0,
            updatedAt: 0,
            createdAt: 0,
            conPer: 0,
            userIds: 0,
            licenceNo: 0,
          },
        },
      ],
    },
  ],
  redis: {
    HOST: 'localhost',
    PORT: 6379,
    DB: 1,
  },
});
app.get('/status', (_req, res) => {
  res.send('All Okay');
});
app.use('/widgets', WidgetRoutes);
app.use('/media', FileUploadRoute);
app.use('/pages', PageRoutes);
app.use('/users', UserRoutes);
app.use(resize(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public')));

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
server.on('error', console.error);
