**This repository is only for Franz 5 and later, previous versions are no longer maintained.**
---

<img src="./build-helpers/images/icon.png" alt="" width="150"/>

# Franz 5 (beta)
[![Build status Windows](https://ci.appveyor.com/api/projects/status/9yman4ye19x4274o/branch/master?svg=true)](https://ci.appveyor.com/project/adlk/franz/branch/master)
 [![Build Status Mac](https://travis-ci.org/meetfranz/franz.svg?branch=master)](https://travis-ci.org/meetfranz/franz) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](http://meetfranz.com/payment.html)

Messaging app for WhatsApp, Slack, Telegram, HipChat, Hangouts and many many more.

## [Download Franz](https://www.meetfranz.com)
👉 www.meetfranz.com


## Development

### Preparations

#### Install Linux OS dependencies
[Guide: Linux distribution specific dependencies](docs/linux.md)

#### Install yarn
##### MacOS
```bash
$ brew install yarn
```
##### Windows
[Download installer](https://yarnpkg.com/latest.msi)

##### Linux
[Install Yarn on Linux](https://yarnpkg.com/lang/en/docs/install/)

#### Install Gulp 4
```bash
$ yarn add global gulp-cli@1.2.2
$ yarn add global gulpjs/gulp#4.0
```

#### Fix native modules to match current electron node version
```bash
$ yarn run rebuild
```

### Run Franz Development App
Run these two commands __simultaneously__ in different console tabs.

```bash
$ yarn run dev
$ yarn start
```
Be aware that the development database will be reset regularly.

## Packaging
```bash
$ yarn build
```

## How can I support the project?
If you have found a bug that hasn't been reported yet or want to request a new feature, please open a new issue.

## I need help?
Join the Franz community on [Slack](http://slack.franz.im) and get in touch with us.

## Create your own plugins/recipes
You can find all the Information at the [Plugins repository](https://github.com/meetfranz/plugins).
For questions feel free to ask in the [community Slack](http://slack.franz.im)

## Next steps
- [ ] Create acceptance tests
- [ ] Create Linux build
- [ ] 5.0 stable release
- [ ] Developer Documentation
- [ ] Add translations

## License
Franz 5 is open-source licensed under the Apache-2.0 License.
