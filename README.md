<p align="center">
    <img src="./build-helpers/images/icon.png" alt="" width="200"/>
</p>

# Ferdi 

[![Build Status Windows](https://ci.appveyor.com/api/projects/status/2ckfbmoxp36fye5b?svg=true)](https://ci.appveyor.com/project/kytwb/ferdi)
 [![Build Status Mac & Linux](https://travis-ci.org/kytwb/ferdi.svg?branch=master)](https://travis-ci.org/kytwb/ferdi)

🤴🏽 Hard-fork of [Franz](https://github.com/meetfranz/franz), adding awesome features and removing unwanted features.

## Download Ferdi

You can find the installers in the [latest release](https://github.com/kytwb/ferdi/releases) assets.

### Or use homebrew (macOS only)

`$ brew cask install ferdi`

(Don't know homebrew? [brew.sh](https://brew.sh/))

## Features
- [x] Removes the counter-productive fullscreen app delay inviting users to upgrade
- [x] Removes pages begging you to donate after registration
- [x] Makes all users Premium by default
- [x] [Add option to change server to a custom](https://github.com/kytwb/ferdi/wiki/Custom-Server) [ferdi-server](https://github.com/vantezzen/ferdi-server)
- [x] Add "Private Notification"-Mode, that hides message content from notifications (as suggested in [meetfranz/franz#879](https://github.com/meetfranz/franz/issues/879))
- [x] Add Password Lock feature to keep your messages protected. ([ferdi#41](https://github.com/kytwb/ferdi/issues/41) and [meetfranz#810](https://github.com/meetfranz/franz/issues/810))
- [x] [Add an option to keep individual workspaces always loaded](https://github.com/kytwb/ferdi/issues/37)
- [x] Add an option to auto-hide the menubar ([#7](https://github.com/kytwb/ferdi/issues/7), [meetfranz#833](https://github.com/meetfranz/franz/issues/833))
- [x] [Add CTRL+← and CTRL+→ shortcuts and menu options to go back and forward in the service browsing history](https://github.com/kytwb/ferdi/issues/39)
- [x] Add "npm run prepare-code" command for development to lint and beautify code
- [x] Remove "Franz is better together" popup
- [x] [Makes it possible to edit the "Franz Todo" server](https://github.com/kytwb/ferdi/wiki/Custom-Todo)
- [x] Makes RocketChat self-hosted generally available
- [x] Comes with a custom branding proper to Ferdi

## Development

### Preparations

#### Install Linux OS dependencies
[Guide: Linux distribution specific dependencies](docs/linux.md)

#### Use right NodeJS version
Please make sure you are running NodeJS v10 (v10.16.3 suggested). Versions above will throw an errow when trying to install due to an [old fsevent dependency](https://github.com/fsevents/fsevents/issues/278)

#### Fix native modules to match current electron node version
```bash
$ npm run rebuild
```

### Install dependencies
Run the following command to install all dependencies, and link sibling modules with Franz.
```bash
$ npx lerna bootstrap
```

If you previously ran `npm install` it sometimes is necessary to delete your `node_modules` folder before running `npx lerna bootstrap`. 

### Run Ferdi Development App
Run these two commands __simultaneously__ in different console tabs.

```bash
$ npm run dev
$ npm run start
```
Be aware that the development database will be reset regularly.

## Packaging
```bash
$ npm run build
```

Deliverables will be available in the ./out folder.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://vantezzen.io"><img src="https://avatars2.githubusercontent.com/u/10333196?v=4" width="100px;" alt="Bennett"/><br /><sub><b>Bennett</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/commits?author=vantezzen" title="Code">💻</a> <a href="#design-vantezzen" title="Design">🎨</a> <a href="https://github.com/kytwb/ferdi/commits?author=vantezzen" title="Documentation">📖</a> <a href="#ideas-vantezzen" title="Ideas, Planning, & Feedback">🤔</a> <a href="#translation-vantezzen" title="Translation">🌍</a></td>
    <td align="center"><a href="http://www.adlk.io"><img src="https://avatars1.githubusercontent.com/u/3265004?v=4" width="100px;" alt="Stefan Malzner"/><br /><sub><b>Stefan Malzner</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/commits?author=adlk" title="Code">💻</a> <a href="#content-adlk" title="Content">🖋</a> <a href="#design-adlk" title="Design">🎨</a> <a href="https://github.com/kytwb/ferdi/commits?author=adlk" title="Documentation">📖</a> <a href="#ideas-adlk" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-adlk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-adlk" title="Project Management">📆</a> <a href="https://github.com/kytwb/ferdi/commits?author=adlk" title="Tests">⚠️</a> <a href="#translation-adlk" title="Translation">🌍</a></td>
    <td align="center"><a href="https://twitter.com/kytwb"><img src="https://avatars0.githubusercontent.com/u/412895?v=4" width="100px;" alt="Amine Mouafik"/><br /><sub><b>Amine Mouafik</b></sub></a><br /><a href="#question-kytwb" title="Answering Questions">💬</a> <a href="https://github.com/kytwb/ferdi/commits?author=kytwb" title="Code">💻</a> <a href="https://github.com/kytwb/ferdi/commits?author=kytwb" title="Documentation">📖</a> <a href="#ideas-kytwb" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-kytwb" title="Maintenance">🚧</a> <a href="#platform-kytwb" title="Packaging/porting to new platform">📦</a> <a href="#projectManagement-kytwb" title="Project Management">📆</a> <a href="#review-kytwb" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://seriesgt.com"><img src="https://avatars3.githubusercontent.com/u/5977640?v=4" width="100px;" alt="ZeroCool"/><br /><sub><b>ZeroCool</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/commits?author=ZeroCool940711" title="Code">💻</a> <a href="#ideas-ZeroCool940711" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/rseitbekov"><img src="https://avatars2.githubusercontent.com/u/35684439?v=4" width="100px;" alt="rseitbekov"/><br /><sub><b>rseitbekov</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/commits?author=rseitbekov" title="Code">💻</a></td>
    <td align="center"><a href="https://djangogigs.com/developers/peter-bittner/"><img src="https://avatars2.githubusercontent.com/u/665072?v=4" width="100px;" alt="Peter Bittner"/><br /><sub><b>Peter Bittner</b></sub></a><br /><a href="#ideas-bittner" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/justus-saul"><img src="https://avatars1.githubusercontent.com/u/5861826?v=4" width="100px;" alt="Justus Saul"/><br /><sub><b>Justus Saul</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/issues?q=author%3Ajustus-saul" title="Bug reports">🐛</a> <a href="#ideas-justus-saul" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/igreil"><img src="https://avatars0.githubusercontent.com/u/17239151?v=4" width="100px;" alt="igreil"/><br /><sub><b>igreil</b></sub></a><br /><a href="#ideas-igreil" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://marcolopes.eu"><img src="https://avatars1.githubusercontent.com/u/431889?v=4" width="100px;" alt="Marco Lopes"/><br /><sub><b>Marco Lopes</b></sub></a><br /><a href="#ideas-marcolopes" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/dayzlun"><img src="https://avatars3.githubusercontent.com/u/17259690?v=4" width="100px;" alt="dayzlun"/><br /><sub><b>dayzlun</b></sub></a><br /><a href="https://github.com/kytwb/ferdi/issues?q=author%3Adayzlun" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://twitter.com/tobigue_"><img src="https://avatars2.githubusercontent.com/u/1560152?v=4" width="100px;" alt="Tobias Günther"/><br /><sub><b>Tobias Günther</b></sub></a><br /><a href="#ideas-tobigue" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
