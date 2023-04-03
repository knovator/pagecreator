<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/knovator/pagecreator">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">@knovator/pagecreator-admin</h3>

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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
`@knovator/pagecreator-admin` provides `Widget` and `Page` components to integrate in UI to builds view that manage **widgets** and **page** data.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [ReatJS](https://reactjs.org/)
* [Nx](https://nx.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [react-hook-form](https://www.npmjs.com/package/react-hook-form)
* [react-transition-group](https://www.npmjs.com/package/react-transition-group)
* [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd)
* [react-dropzone](https://www.npmjs.com/package/react-dropzone)
* [react-select](https://react-select.com/)
* [@knovator/api](https://www.npmjs.com/package/@knovator/api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

`@knovator/pagecreator-admin` is designed to be used in ReactJS/NextJS project.

### Prerequisites

Create one reactjs/nextjs application if you don't have one,
* Project
  ```sh
  npx create-react-app my-app
  # or
  npx create-next-app@latest
  ```
* API
    - Keep your backend application ready according to the steps mentioned in [@knovator/pagecreator-node](https://github.com/knovator/pagecreator/tree/main/libs/node)


### Installation

1. Add pagecreator package
   ```sh
   npm install @knovator/pagecreator-admin
   # or
   yarn add @knovator/pagecreator-admin
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Provider

In order to support communication between components `@knovator/pagecreator-admin` uses **Context API**. So, `Widget`/`Page` components should be wrapped by Provider.
```jsx
import { Provider } from '@knovator/pagecreator-admin';

<Provider
    ...
>
    ...
</Provider>
```
**Props**
- `token`
    - JWT token to be sent along the requests
- `baseUrl`
    - Base API url, without forward slash at end i.e. `https://api.xyz.in`
- `onError(callback_code, code, message) (optional)`
    - callback to execute on error
- `onSuccess(callback_code, code, message) (optional)`
    - callback to execute on success
- `onLogout (optional)`
    - callback to execute on API request with unauthorized code in body
- `switchClass`
    - `class` name to apply to `Toggle` component, default is `khb_switch`
- `widgetRoutesPrefix`
    - Prefix to apply after `baseUrl` while calling `widget` API
- `itemsRoutesPrefix`
    - Prefix to apply after `baseUrl` while calling `items` API
- `pageRoutesPrefix`
    - Prefix to apply after `baseUrl` while calling `page` API

### [Widget](widget.md)
### [Page](page.md)

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
[product-screenshot]: images/screenshot.png