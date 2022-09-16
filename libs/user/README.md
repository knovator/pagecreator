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

<h3 align="center">@knovator/pagecreator</h3>

  <p align="center">
    Plug & Play functionality to Build dynamic pages on the fly
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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

`@knovator/pagecreator` is built with intent to build pages that are depend on backend data, and admin can change how page will look like.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [react-slick](https://www.npmjs.com/package/react-slick)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To integrate `@knovator/pagecreator` is designed to be used in ReactJS/NextJS project.

### Prerequisites

We can use `@knovator/pagecreator` in React/Next application, we can create one using following commands
* Project
  ```sh
  npx create-react-app my-app
  # or
  npx create-next-app@latest
  ```

### Installation

1. Install NPM packages
   ```sh
   npm install @knovator/pagecreator
   # or
   yarn add @knovator/pagecreator
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage

### Widget
```jsx
import { Widget } from '@knovator/pagecreator';

<Widget
    apiBaseUrl=''
    widgetData={}
    onClick={...}
>
```
**Props**
- `widgetData`
    - [widgetData](data-formats.md#widgetdata)
- `apiBaseUrl`
    - baseUrl to start prefix image urls
- `formatItem` (optional): `(item: TileData) => JSX.Element`
    - Customize look of Items
- `onClick` (optional): `(item: TileData) => void;`
    - OnItem click handler

### Page
```jsx
import { Page } from '@knovator/pagecreator';

<Page
    apiBaseUrl=''
    pageData={...}
    onClick={...}
>
```
**Props**
- `title` (optional)
    - Title to show on page
- `apiBaseUrl`
    - baseUrl to start prefix image urls
- `pageData`
    - [PageData](data-formats.md#pagedata)
- `formatItem` (optional): `(CODE: string, item: TileData) => JSX.Element;`
    - Customize look of Items
- `onClick` (optional): `(CODE: string, item: TileData) => JSX.Element;`
    - On Item click handler

### getData
It's possible to fetch data by yourself and pass them to `Widget` or `Page` components, but if you need easy solution you can use `getData` function.
```js
const pageData = await getData({
    url: '...',
    code: 'HOMEPAGE',
});
```

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

Project Link: [https://github.com/knovator/masters-admin](https://github.com/knovator/masters-admin)

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
[license-url]: https://github.com/knovator/pagecreator/blob/main/LICENSE.txt