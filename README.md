<img src="./build-helpers/images/icon.png" alt="" width="150"/>

# Ferdi 

👛 Hard-fork of [Franz](https://github.com/meetfranz/franz), adding awesome features and removing unwanted features.

## Changes
- [x] Removes the fullscreen app delay inviting users to upgrade
- [x] Removes pages begging you to donate afte registration
- [x] Makes all users premium
- [x] Add option to change server to a custom [ferdi-server](https://github.com/vantezzen/ferdi-server) 
- [ ] [#5](https://github.com/kytwb/Ferdi/issues/5) Makes it optional to create an account
- [ ] [#6](https://github.com/kytwb/Ferdi/issues/6) Makes RocketChat self-hosted generally available

## Packaging

```bash
$ npm install
$ npm run build
```

Deliverables will be available in the `./out` folder.

## Developing
### Preparations
- [Install Linux dependencies](docs/linux.md) if you are developing on Linux
- Make sure you are running NodeJS v10. Versions above will throw an errow when trying to install due to an [old fsevent dependency](https://github.com/fsevents/fsevents/issues/278)

### Setup
1. Fix native modules to match current electron node version
    ```
    npm run rebuild
    ```
2. Install dependencies using lerna
    ```
    npx lerna bootstrap
    ```
3. Run Ferdi Development App
    Run these two commands *simultaneously* in different console tabs.
    ```
    npm run dev
    npm run start
    ```

## Releases

You can find the binaries for Linux, MacOS and Windows in the [latest release](https://github.com/kytwb/Ferdi/releases/tag/Ferdi-5.2.0-beta.3) assets. Assets are continuously delivered through [Travis](https://travis-ci.org/kytwb/Ferdi) for Linux/MacOS and [Appveyor](https://ci.appveyor.com/project/kytwb/Ferdi) for Windows.

## Features

- [x] Removes the fullscreen app delay inviting users to upgrade
- [ ] [#5](https://github.com/kytwb/Ferdi/issues/5) Makes it optional to create an account
- [ ] [#6](https://github.com/kytwb/Ferdi/issues/6) Makes RocketChat self-hosted generally available
