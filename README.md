<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
***

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Phildesro123/Reliant">
    <img src="src/assets/img/Reliant_Logo.svg" alt="Logo" >
  </a>

  <h3 align="center">Reliant</h3>

  <p align="center">
    <br />
    <br />
    <a href="https://github.com/Phildesro123/Reliant/issues">Report Bug</a>
    ·
    <a href="https://github.com/Phildesro123/Reliant/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
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
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<a href="https://github.com/Phildesro123/Reliant">
  <img src="src/assets/img/4.png">
</a>

This is Reliant – a browser extension that enhances your article reading experience. 

In 2021, an average of 5,200 articles are produced by major news outlets every day. It feels like there’s so much information out there that makes it harder for one person to decide what’s true and what’s not. In a world full of misinformation, this project aims to spark discussion amongst readers, allowing them to make the best decision regarding the reliability of their article. In short, we hope to simplify the process of gathering information about the article's credibility. 

We do this by:
* Author Reliability Score 
* Author Background Information
* Comments
* Notes
* Highlights


### Built With
* [React](https://reactjs.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Webpack](https://webpack.js.org/)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

You'll need [npm](https://nodejs.org/en/) to run this project.
  ```sh
  npm install npm@latest -g
  ```

### Installation

First, install the packages for the client.
```
npm install
```
Optional: If you're planning on running a development server (Must have mongoDB access)
```
cd backend/
npm install
```
Optional: If you're planning on running a development server
create a `.env` on the root level and add your MongoDB connection string

Example:
```
MONGODB_URI = mongodb+srv://username:password@cluster0-jtpxd.mongodb.net/admin
```
## Running the extension
To run the extension using a development server on `localhost:4000` like:
```
npm run dev
```
To run the extension using the production server:
```
npm run prod
```

To run the extension with the client only:
```
npm start
```

### Loading the extension on Chrome
 Load your extension on Chrome with the following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.

## Usage

Here is an example of all the features Reliant can bring to you!

<a href="https://github.com/Phildesro123/Reliant">
  <img src="src/assets/img/all_features.png">
</a>


Note: Reliant can only be used on these sites:
* https://www.nytimes.com/
* https://www.theverge.com/
* https://www.wired.com/
* https://www.cnn.com/ 
* https://www.vox.com/



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing
All issues are kept under the `Issues` tab. If you find anything you'd like to
add or see fixed, add it there. 

To make a change:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Pull requests should be reviewed by at least one active contributor. 
Please include screenshots with any frontend changes.


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [React Chrome Extension Boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
* [Rangy](https://github.com/timdown/rangy)
* [Webpack documentation](https://webpack.js.org/concepts/)
* [Chrome extension documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[forks-shield]: https://img.shields.io/github/forks/Phildesro123/Reliant
[forks-url]: https://github.com/Phildesro123/Reliant/network/members
[stars-shield]:	https://img.shields.io/github/stars/Phildesro123/Reliant
[stars-url]: https://github.com/Phildesro123/Reliant/stargazers
[issues-shield]: https://img.shields.io/github/issues/Phildesro123/Reliant
[issues-url]: https://github.com/Phildesro123/Reliant/issues
[license-shield]: https://img.shields.io/github/license/Phildesro123/Reliant
[license-url]: https://github.com/Phildesro123/Reliant/blob/main/LICENSE
[product-screenshot]: images/screenshot.png
