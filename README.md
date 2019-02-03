**This repository is only for Franz 5 and later, previous versions are no longer maintained.**
---

<img src="./build-helpers/images/icon.png" alt="" width="150"/>

# Franz 5 (beta)
[![Build status Windows](https://ci.appveyor.com/api/projects/status/9yman4ye19x4274o/branch/master?svg=true)](https://ci.appveyor.com/project/adlk/franz/branch/master)
 [![Build Status Mac & Linux](https://travis-ci.com/meetfranz/franz.svg?branch=master)](https://travis-ci.com/meetfranz/franz) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://meetfranz.com/payment.html)

Messaging app for WhatsApp, Slack, Telegram, HipChat, Hangouts and many many more.

## [Download Franz](https://www.meetfranz.com)
👉 www.meetfranz.com

### Or use homebrew (macOS only)

`$ brew cask install franz`

(Don't know homebrew? [brew.sh](https://brew.sh/)

## Development

### Preparations

#### Install Linux OS dependencies
[Guide: Linux distribution specific dependencies](docs/linux.md)

#### Fix native modules to match current electron node version
```bash
$ npm run rebuild
```

### Run Franz Development App
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

## How can I support the project?
If you have found a bug that hasn't been reported yet or want to request a new feature, please open a new issue.

## I need help?
Join the Franz community on [Slack](http://slack.franz.im) and get in touch with us.

## Create your own plugins/recipes
You can find all the Information at the [Plugins repository](https://github.com/meetfranz/plugins).
For questions feel free to ask in the [community Slack](http://slack.franz.im)

## License
Franz 5 is open-source licensed under the Apache-2.0 License.
