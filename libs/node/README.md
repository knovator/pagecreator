<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/knovator/pagecreator">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">@knovator/pagecreator-node</h3>

  <p align="center">
    Plug & Play functionality to Build dynamic pages on the fly.
    <br />
    <a href="https://github.com/knovator/pagecreator"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/knovator/pagecreator">View Demo</a>
    ·
    <a href="https://github.com/knovator/pagecreator/issues">Report Bug</a>
    ·
    <a href="https://github.com/knovator/pagecreator/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#routes-infomration">Routes Infomration</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

`@knovator/pagecreator-node` is built with intent to build pages that are depend on backend data, and admin can change how page will look like.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Typescript](https://www.typescriptlang.org/)
- [mongoose](https://mongoosejs.com/)
- [express](https://expressjs.com/)
- [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)
- [joi](https://www.npmjs.com/package/joi)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To integrate `@knovator/pagecreator-node`, you should be having basic nodejs application up and running with express (optionally using mongoose for mongodb database). `@knovator/pagecreator-node` provides routes for `widget`, `page` and `user` to use in application.

### Prerequisites

- It's good start to have `nodejs` application up and running with `express`. Good to have used [i18next](https://www.npmjs.com/package/i18next) to add message in response codes.
- `routes` uses `mongoose` connection established by application, so it's required to connect to database before using package. For example,

  ```js
  // db.js
  const mongoose = require('mongoose');

  mongoose
    .connect('mongodb://localhost:27017/knovator')
    .then(() => console.info('Database connected'))
    .catch((err) => {
      console.error('DB Error', err);
    });

  module.exports = mongoose;
  ```

- Image upload route for `upload` & `remove` is needed to declare externally. Example,

  ```js
  // fileRoute.js
  const express = require('express');
  const router = express.Router();

  router.post(`/files/upload`, (req, res) => {
    // TO DO: some file storage operation
    let uri = '/image.jpg';
    let id = '62c54b15524b6b59d2313c02';
    res.json({
      code: 'SUCCESS',
      data: { id, uri },
      message: 'File uploaded successfully',
    });
  });

  router.delete(`/files/remove/:id`, (req, res) => {
    // TO DO: some file remove operation
    res.json({
      code: 'SUCCESS',
      data: {},
      message: 'File removed successfully',
    });
  });

  module.exports = router;
  ```

**Sample App file**

```js
require('./src/db');
require('./src/models/file');

const cors = require('cors');
const express = require('express');
const fileRoutes = require('./fileRoute.js');
const PORT = 8080;

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(fileRoutes);

// ...
app.listen(PORT, () => {
  console.log(`App started on ${PORT}`);
});
```

### Installation

1. Add pagecreator package,
   ```sh
   npm install @knovator/pagecreator-node
   # or
   yarn add @knovator/pagecreator-node
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

App/Main file is a good place to use `@knovator/pagecreator-node`

```js
const {
  setConfig,
  WidgetRoutes,
  ItemRoutes,
  FileUploadRoute,
  PageRoutes,
  UserRoutes,
} = require('@knovator/pagecreator-node');

setConfig({
  collections: [
    {
      title: 'Notifications',
      collectionName: 'notifications',
      filters: { isDeleted: false, isActive: true },
      searchColumns: ['name', 'code'],
    },
  ],
});

app.use('/widgets', WidgetRoutes);
app.use('/items', ItemRoutes);
app.use('/media', FileUploadRoute);
app.use('/pages', PageRoutes);
app.use('/users', UserRoutes);

app.listen(PORT, () => {
  console.log(`App started on ${PORT}`);
});
```

Through `setConfig` function e can set `logger`, `collections` and `catchAsync` functions as parameters. By `collections`, we can add reference of application collections.

- `handleUpdateData` is used to handle update redis cache when data is updated in database. It takes `collectionName` and `_id` as parameters.
  ```js
    import { handleUpdateData } from '@knovator/pagecreator-node';

    handleUpdateData('notifications', '62c54b15524b6b59d2313c02');
  ```

### parameter explanations

- `logger`
  - Provides ability to add logging for Database and Validation
    ```js
    // default
    console;
    ```
- `catchAsync`
  - Wraps functions to handle async errors
    ```js
    // default
    function catchAsync(fn) {
      return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch((err) => {
          // this.logger.error(err.message);
          res.status(internalServerError).json({
            code: RESPONSE_CODE.ERROR,
            message: err.message,
            data: {},
          });
        });
      };
    }
    ```
- `collections`
  - Array of collection items to add reference of collections in package.
- `redis`
  - Redis URL string or connection object to wrap user APIs into redis cache.
  - i.e. `redis://localhost:6379` or `{ HOST: 'localhost', PORT: 6379, PASSWORD: "test", USER: "test", DB: 0 }`
 

#### Collection Item Format

| Code           | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| title          | Title of collection name to show in UI                                                 |
| collectionName | Collection name specified in database                                                  |
| filters        | Filter object to apply while getting data, like `{ isDeleted: false, isActive: true }` |
| searchColumns  | Array of fields to to perform search                                                   |
| aggregations   | Array of aggregation items you want to apply while retriving items                     |
| customWidgetTypes | Array of widget types to add, like `{ label: "", value: "", imageOnly: true, collectionsOnly: true; }` |

**Example**,

```js
setConfig({
  collections: [
    {
      title: 'Notifications',
      collectionName: 'notifications',
      filters: { isDeleted: false, isActive: true },
      searchColumns: ['name', 'code'],
      aggregations: [
        {
          $lookup: {
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
          }
        },
        {
          $project: {
            _id: 1,
            nm: 1,
            fileId: 1,
          }
        },
        {
          $match: {
            deletedAt: { $exists: false },
          }
        }
      ]
    },
  ],
});
```

## Routes Infomration

Response follows following structure

```js
{
  code: RESPONSE_CODES,
  message: "" // if internationalized is applied
  data: {}
}
```

### Response Codes

| Code    | Description                          |
| ------- | ------------------------------------ |
| SUCCESS | When request fullfiled without error |
| ERROR   | When request fullfiled with error    |

### Custom Validation messages

| Message                            | Description                                     |
| ---------------------------------- | ----------------------------------------------- |
| Widget with same code is available | When widget with same code is exist in database |

### HTTP Status Codes

| HTTP | Description                          |
| ---- | ------------------------------------ |
| 200  | When request fullfiled without error |
| 201  | When document is created             |
| 500  | When internal server occurred        |
| 422  | When Validation error occurred       |
| 404  | When Resource is not found           |

### Routes

This are the routes that gets integrated by `@knovator/pagecreator-node`,

#### Widget

| Route              | Method     | Description                                              |
| ------------------ | ---------- | -------------------------------------------------------- |
| `/widget-types`    | **GET**    | Get widget-types like `Image` and provided `collections` |
| `/selection-types` | **GET**    | Get Selection types like `Fixed Card` and `Carousel`     |
| `/list`            | **POST**   | List widget data in pagination                           |
| `/`                | **POST**   | Create `widget`                                          |
| `/:id`             | **PUT**    | Update `widget`                                          |
| `/:id`             | **PATCH**  | Partial Update `widget`                                  |
| `/:id`             | **DELETE** | Delete widget whose `id` send in body                    |
| `/collection-data` | **POST**   | Get collection data                                      |

#### Page

| Route   | Method     | Description                         |
| ------- | ---------- | ----------------------------------- |
| `/list` | **POST**   | List page data in pagination        |
| `/`     | **POST**   | Create `page`                       |
| `/:id`  | **PUT**    | Update `page`                       |
| `/:id`  | **DELETE** | Delete page whose `id` send in body |

#### User

| Route          | Method   | Description                                              |
| -------------- | -------- | -------------------------------------------------------- |
| `/widget-data` | **POST** | Get widget-data data for specified widget `code` in body |
| `/page-data`   | **POST** | Get page-data data for specified page `code` in body     |

### `descriptor` codes & `i18n` code for messages

Nextjs [i18n](https://www.npmjs.com/package/i18next) package adds facility for internationalization in nodejs application, and it's used in following manner

```js
// usage
req?.i18n?.(CODE);
```

| CODE                       | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `widget.getItemsTypes`     | While fetching widget types                                  |
| `widget.getWidgetTypes`    | While fetching selection types                               |
| `widget.getAll`            | While fetching widgets                                       |
| `widget.create`            | While creating widget                                        |
| `widget.update`            | While updating widget                                        |
| `widget.partialUpdate`     | While doing partialUpdate for widget, like toggle `IsActive` |
| `widget.delete`            | While deleting widget                                        |
| `widget.getCollectionData` | While getting widget `collection-data`                       |
| `page.getAll`              | While getting pages in pagination                            |
| `page.create`              | While creating page                                          |
| `page.update`              | While updating page                                          |
| `page.delete`              | While deleting page                                          |
| `user.widgetNotFound`      | While widget is not found                                    |
| `user.pageNotFound`        | While page is not found                                      |
| `user.getWidgetData`       | While getting widget data                                    |
| `user.getPageData`         | While getting page data                                      |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Knovator Technologies

- Twitter [@knovator](https://twitter.com/knovator)
- Web [https://knovator.com/](https://knovator.com/)

Project Link: [https://github.com/knovator/pagecreator](https://github.com/knovator/pagecreator)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/knovator/pagecreator.svg?style=for-the-badge
[contributors-url]: https://github.com/knovator/pagecreator/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/knovator/pagecreator.svg?style=for-the-badge
[forks-url]: https://github.com/knovator/pagecreator/network/members
[stars-shield]: https://img.shields.io/github/stars/knovator/pagecreator.svg?style=for-the-badge
[stars-url]: https://github.com/knovator/pagecreator/stargazers
[issues-shield]: https://img.shields.io/github/issues/knovator/pagecreator.svg?style=for-the-badge
[issues-url]: https://github.com/knovator/pagecreator/issues
[license-shield]: https://img.shields.io/github/license/knovator/pagecreator.svg?style=for-the-badge
[license-url]: https://github.com/knovator/pagecreator/blob/master/LICENSE.txt
