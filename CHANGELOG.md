# [5.10.0](https://github.com/meetfranz/franz/compare/v5.9.2...v5.10.0) (2023-09-01)

### Bug Fixes

- fix automatic spellcheck language detection ([099f46d](https://github.com/meetfranz/franz/commit/099f46deb383566edce261d622b7f308e7ed8e71))
- Fix crash when Todos view is not initialized ([0a35ffa](https://github.com/meetfranz/franz/commit/0a35ffaa6ffc5753c87e60f870982ae714457a1e))
- Fix issue where service can't be initialized when spellchecking language is not set ([c089cd7](https://github.com/meetfranz/franz/commit/c089cd7532a3c1a3cc334f68234d866643a8be1c))
- Remove screen id from share screen dialogue ([b49117c](https://github.com/meetfranz/franz/commit/b49117ccf0d66611f8c964f0a56eec6036bc2d7b))

### Features

- Update electron to 22.3.18 ([dae2d03](https://github.com/meetfranz/franz/commit/dae2d03e62f9362e6fb0bfd7c574171c4d0f6ea0))

## [5.9.2](https://github.com/meetfranz/franz/compare/v5.9.1...v5.9.2) (2022-04-14)

### Bug Fixes

- **Service:** Apply Google login fix for all services ([3dbe5cc](https://github.com/meetfranz/franz/commit/3dbe5cc))
- **App:** Don't reload app when coming back from system sleep ([bc6a921](https://github.com/meetfranz/franz/commit/bc6a921))
- **Windows + Linux:** Introduce new Franz Menu
- **App:** Improve layout rendering of services ([ad3bb11](https://github.com/meetfranz/franz/commit/ad3bb11))
- **Todos:** Fix Todos to be resizable again ([4b5d2f7](https://github.com/meetfranz/franz/commit/4b5d2f7))
- **Todos:** Fix Todos layout issues when Todos should be hidden ([fb3988a](https://github.com/meetfranz/franz/commit/fb3988a))
- **App:** Don't let the app get confused by unknown routes ([d2059fc](https://github.com/meetfranz/franz/commit/d2059fc))

### Features

- **App:** Lock user agents to Windows 10 and macOS 10.15.17 to avoid fingerprinting identification ([3b1d495](https://github.com/meetfranz/franz/commit/3b1d495))
- **App:** Update to electron 18 ([6c02f29](https://github.com/meetfranz/franz/commit/6c02f29))

## [5.9.1](https://github.com/meetfranz/franz/compare/v5.9.0...v5.9.1) (2022-04-04)

### Bug Fixes

- **macOS:** Fix auto updater on macOS ([40a2194](https://github.com/meetfranz/franz/commit/40a2194))

# [5.9.0](https://github.com/meetfranz/franz/compare/v5.9.0-beta.3...v5.9.0) (2022-04-04)

## This update is different.

### Let us tell you what we didn’t do👇

Here at Franz we took a good hard look at what we’ve built over the last six(!) years and thought about how we could make it better.

We thought about new features, new prices, changes to how the app works, and so much more.

But we went one step further: We rebuilt the underlying core of Franz from the bottom up. We improved the whole functionality of how the app runs.

It’s more stable, more responsive, more resource-friendly, and … drumroll … faster. 🔥

It’s the Franz you know and love – with a new engine.

### Features

- **App:** Huge performance and stability increase
- **App:** Replaced `<webviews>` with `BrowserViews`
- **macOS:** Apple Silicon download prompt to make your experience much faster and stable.

### Bug Fixes

- **App:** Fix inactive background service to get keyboard focus
- **Windows:** Fix error that prevents app from loading on Windows 10 & 11
- **Windows:** Fix error that prevents loading available services & installing service updates
- **Service:** Fix Microsoft Teams Login Issues
- **Service:** Fix Microsoft Teams not being able to load chats
- **General:** many more small bugfixes and overall improvements

# [5.9.0-beta.3](https://github.com/meetfranz/franz/compare/v5.9.0-beta.2...v5.9.0-beta.3) (2022-03-31)

### Bug Fixes

- **App:** Fix Gmail login issues with "Browser is not secure"
- **App:** Fix opening links from some services ([68226bd](https://github.com/meetfranz/franz/commit/68226bd))
- **App:** Fix issues with updater on macOS ([e704fcc](https://github.com/meetfranz/franz/commit/e704fcc))
- **App:** Add security check before opening new window ([d36fa4c](https://github.com/meetfranz/franz/commit/d36fa4c))

# [5.9.0-beta.2](https://github.com/meetfranz/franz/compare/v5.9.0-beta.1...v5.9.0-beta.2) (2022-03-22)

### Bug Fixes

- **App:** Fix Franz Todos to be on top of another service ([086eda1](https://github.com/meetfranz/franz/commit/086eda1))
- **Linux:** Fix viewport height on Linux ([4cbd006](https://github.com/meetfranz/franz/commit/4cbd006))
- **Windows + Linux:** Fix calculation for service position ([2f22ce6](https://github.com/meetfranz/franz/commit/2f22ce6))
- **Windows + Linux:** Fix not clickable window titlebar & menu ([8fde4ab](https://github.com/meetfranz/franz/commit/8fde4ab))

# [5.9.0-beta.1](https://github.com/meetfranz/franz/compare/v5.8.0...v5.9.0-beta.1) (2022-03-21)

[See 5.9.0 changelog.](#5-9-0--2022-04-04-)

# [5.8.0](https://github.com/meetfranz/franz/compare/v5.7.0...v5.8.0) (2022-02-14)

### Bug Fixes

- **App:** Fix potential memory leak with full screen event listeners ([7d873c4](https://github.com/meetfranz/franz/commit/7d873c4))
- **macOS:** Make tray icon color dynamic ([a16b5fe](https://github.com/meetfranz/franz/commit/a16b5fe))
- **macOS:** Fix Do Not Disturb System check for macOS Monterey ([cb91b17](https://github.com/meetfranz/franz/commit/cb91b17))
- **Windows:** Fix menu bar styling ([171d4d3](https://github.com/meetfranz/franz/commit/171d4d3))
- **Gmail:** Fix auto suggest, calendar invites and other Google service integrations (🙌 [@kamyweb](https://github.com/kamyweb))
- **Microsoft Teams:** Fix issue that prevents loading chats

### Features

- **Service:** Add `modifyRequestHeaders` for service recipes (🙌 [@kamyweb](https://github.com/kamyweb)) ([5ecc730](https://github.com/meetfranz/franz/commit/5ecc730))
- **App:** Remove Google Analytics ([3840dd6](https://github.com/meetfranz/franz/commit/3840dd6))
- **Service Recipes:** Add `Franz.clearCache()` method to clear service cache ([06e6d65](https://github.com/meetfranz/franz/commit/06e6d65))

### General

- **App:** Update electron to 14.2.2
- **App:** Various improvements all over the app
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.8.0-beta.1](https://github.com/meetfranz/franz/compare/v5.7.0...v5.8.0-beta.1) (2021-12-29)

[See 5.8.0 changelog.](#5-8-0--2022-02-14-)

# [5.7.0](https://github.com/meetfranz/franz/compare/v5.6.0...v5.7.0) (2021-06-14)

### Features

- **App:** Add support for screen sharing during video calls

### Bug Fixes

- **App:** Fix app focus detection ([c42337f](https://github.com/meetfranz/franz/commit/c42337f))
- **App:** Various bugfixes and improvements

### General

- **App:** Update electron to 12.0.6
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.7.0-beta.1](https://github.com/meetfranz/franz/compare/v5.6.0...v5.7.0-beta.1) (2021-06-07)

[See 5.7.0 changelog.](#5-7-0--2021-06-14-)

# [5.6.0](https://github.com/meetfranz/franz/compare/v5.6.0-beta.1...v5.6.0) (2020-11-13)

### Bug Fixes

- **App:** Fixed crash when Franz goes to sleep
- **App:** Fix crash when app has finished loading
- **App:** Add mailto: as a valid url protocol
- **App:** Fix crashes on navigation changes/reloads
- **Context Menu:** Fix "save image as"
- **Franz ToDos:** Clear todos cache on user logout
- **Service:** Fix copy image in context menu
- **Service:** Fix image download from services
- **Service:** Fix service activation on notification click
- **Service:** Fix popup handling to e.g. enable Facebook Messenger calls
- **Service:** Fix clicks on links in Skype
- **Service:** Reset active service when previous selection is not valid anymore
- **Service:** Fix missing service re-rendering on service update
- **Custom Website:** Fix browser control icons in dark mode
- **macOS:** Fix tray icon color on macOS Big Sur
- **Share Dialog:** Fix Twitter share link not working
- **App:** Fix various validation errors

### Features

- **App:** We've put Franz on a diet and he lost over 130MB 🥳
- **Franz ToDos:** New version of Franz ToDos with lots of new features more on [franztodos.com](https://franztodos.com)
- **App:** Add new onboarding step to make setting up services easier
- **Context Menu:** Add option to copy image
- **Franz ToDos:** Add Franz ToDos as a native service
- **Franz ToDos:** Added `Cmd+Alt+Shift+R` to reload the Franz ToDos
- **Spell checker:** Added 12 new languages for spell checking
- **Spellchecker:** Improved language detection for spell checking
- **Recipe:** Add option to override recipe partition
- **Languages:** Added Estonian as a language
- **Share Dialog:** Add LinkedIn as an option

### General

- **App:** Update electron to 10.1.5
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.6.0-beta.1](https://github.com/meetfranz/franz/compare/v5.5.0...v5.6.0-beta.1) (2020-10-08)

[See 5.6.0 changelog.](#5-6-0--2020-11-13-)

# [5.5.0](https://github.com/meetfranz/franz/compare/v5.5.0-beta.4...v5.5.0) (2020-04-29)

### Features

- **Service:** Add service hibernation to save system resources ([cb92dd7](https://github.com/meetfranz/franz/commit/cb92dd7))
- **App:** Add `FRANZ_APPDATA_DIR` environment variable to customize the app settings directory ([@Makazzz](https://github.com/Makazzz))
- **Service:** Added service polling debugger when starting Franz with `DEBUG=Franz:Service`

### Bug Fixes

- **App:** Update deprecated electron APIs ([@vantezzen](https://github.com/vantezzen))
- **App:** Fix Zoom in services ([@vantezzen](https://github.com/vantezzen))
- **macOS:** Add audio & video permission request for macOS Catalina ([8922324](https://github.com/meetfranz/franz/commit/8922324))
  8922324
- **Experimental:** Fix Google signin ([d7840ba](https://github.com/meetfranz/franz/commit/d7840ba))
- **macOS:** Ask the user to move Franz to the `/Applications` Folder to fix read/write issues ([f52ad72](https://github.com/meetfranz/franz/commit/f52ad72))
- **macOS:** Fix microphone, camera & screen sharing permissions
- **Service:** Add integrity checks to prevent services recipes getting lost ([b2d5315](https://github.com/meetfranz/franz/commit/b2d5315))
- **Service:** Fix issue with user agent override in service workers ([a8dea57](https://github.com/meetfranz/franz/commit/a8dea57))
- **Service:** Don't reload services after 10 minute system nap ([a2aae55](https://github.com/meetfranz/franz/commit/a2aae55))
- **App:** Fix "Missing Service" link ([0e2c945](https://github.com/meetfranz/franz/commit/0e2c945))
- **App:** Improve lost recipe connection handler ([18e1da1](https://github.com/meetfranz/franz/commit/18e1da1))

### General

- **App:** Updated electron to 8.1.1 ([5b00c90](https://github.com/meetfranz/franz/commit/5b00c90))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.5.0-beta.4](https://github.com/meetfranz/franz/compare/v5.5.0-beta.3...v5.5.0-beta.4) (2020-04-21)

### Bug Fixes

- **Service:** Fix issue with service debugger painting service tabs red ([2b980c7](https://github.com/meetfranz/franz/commit/2b980c7))

# [5.5.0-beta.3](https://github.com/meetfranz/franz/compare/v5.5.0-beta.2...v5.5.0-beta.3) (2020-04-17)

### Bug Fixes

- **App:** Improve lost recipe connection handler ([18e1da1](https://github.com/meetfranz/franz/commit/18e1da1))

### General

- **Service:** Added service polling debugger when starting Franz with `DEBUG=Franz:Service`
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.5.0-beta.2](https://github.com/meetfranz/franz/compare/v5.5.0-beta.1...v5.5.0-beta.2) (2020-04-06)

### Bug Fixes

- **Experimental:** Fix Google signin ([d7840ba](https://github.com/meetfranz/franz/commit/d7840ba))
- **macOS:** Ask the user to move Franz to the `/Applications` Folder to fix read/write issues ([f52ad72](https://github.com/meetfranz/franz/commit/f52ad72))
- **macOS:** Fix microphone, camera & screen sharing permissions
- **Service:** Add integrity checks to prevent services recipes getting lost ([b2d5315](https://github.com/meetfranz/franz/commit/b2d5315))
- **Service:** Fix issue with user agent override in service workers ([a8dea57](https://github.com/meetfranz/franz/commit/a8dea57))
- **Service:** Don't reload services after 10 minute system nap ([a2aae55](https://github.com/meetfranz/franz/commit/a2aae55))
- **App:** Fix "Missing Service" link ([0e2c945](https://github.com/meetfranz/franz/commit/0e2c945))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.5.0-beta.1](https://github.com/meetfranz/franz/compare/v5.4.1...v5.5.0-beta.1) (2020-03-20)

### Features

- **Service:** Add service hibernation to save system resources ([cb92dd7](https://github.com/meetfranz/franz/commit/cb92dd7))
- **App:** Add `FRANZ_APPDATA_DIR` environment variable to customize the app settings directory ([@Makazzz](https://github.com/Makazzz))

### Bug Fixes

- **App:** Update deprecated electron APIs ([@vantezzen](https://github.com/vantezzen))
- **App:** Fix Zoom in services ([@vantezzen](https://github.com/vantezzen))
- **macOS:** Add audio & video permission request for macOS Catalina ([8922324](https://github.com/meetfranz/franz/commit/8922324))
  8922324

### General

- **App:** Updated electron to 8.1.1 ([5b00c90](https://github.com/meetfranz/franz/commit/5b00c90))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.4.1](https://github.com/meetfranz/franz/compare/v5.4.0...v5.4.1) (2019-10-30)

- **macOS Catalina:** Fix issue with app notarization

# [5.4.0](https://github.com/meetfranz/franz/compare/v5.4.0-beta.3...v5.4.0) (2019-10-23)

### Features

- **Custom Websites:** Added navigation bar for "Custom Website" service ([f8fbaad](https://github.com/meetfranz/franz/commit/f8fbaad))
- **Mac:** Open Franz window with `Cmd+1` ([71831ec](https://github.com/meetfranz/franz/commit/71831ec))
- **Todos:** Allow Franz Todos to open links in browser ([5ba6723](https://github.com/meetfranz/franz/commit/5ba6723))
- **Service API:** Share `team`, `url` and `hasCustomIcon` with service ([9f4f3e7](https://github.com/meetfranz/franz/commit/9f4f3e7))
- **App Start:** Only load workspace related services ([ad7fb84](https://github.com/meetfranz/franz/commit/ad7fb84))

### Bug Fixes

- **Services:** Restore services after 10 minutes system suspension ([7f11dff](https://github.com/meetfranz/franz/commit/7f11dff))
- **Workspaces:** Allow scrolling in Workspaces drawer ([5c1c0db](https://github.com/meetfranz/franz/commit/5c1c0db))
- **Spell check:** fix(Spell checker): Fix disable spell checker ([@vantezzen](https://github.com/vantezzen))
  ([691e0cf](https://github.com/meetfranz/franz/commit/691e0cf))
- **App:** Fix "Paste And Match Style" ([490a988](https://github.com/meetfranz/franz/commit/490a988))
- **macOS:** Only show services in Touch Bar that should be visible ([077ad22](https://github.com/meetfranz/franz/commit/077ad22))
- **Service Proxies:** Fix proxy setting rehydration ([e2126a6](https://github.com/meetfranz/franz/commit/e2126a6))
- **Settings:** Fix cache size calculation after clearing cache ([a31566d](https://github.com/meetfranz/franz/commit/a31566d))
- **Spell check:** Fix spell checker to initialize without loaded dictionary ([734732f](https://github.com/meetfranz/franz/commit/734732f))
- **Spell check:** Fix "undefined" language in context menu ([cc03883](https://github.com/meetfranz/franz/commit/cc03883))
- **App:** Fix Basic Auth overlay background in Dark Mode ([027e50d](https://github.com/meetfranz/franz/commit/027e50d))

### General

- **App:** Updated electron to 6.0.11 ([34aab68](https://github.com/meetfranz/franz/commit/34aab68))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.4.0-beta.3](https://github.com/meetfranz/franz/compare/v5.4.0-beta.2...v5.4.0-beta.3) (2019-10-22)

### Features

- **App Start:** Only load workspace related services ([ad7fb84](https://github.com/meetfranz/franz/commit/ad7fb84))

### Bug Fixes

- **Services:** Restore services after 10 minutes system suspension ([7f11dff](https://github.com/meetfranz/franz/commit/7f11dff))
- **Workspaces:** Allow scrolling in Workspaces drawer ([5c1c0db](https://github.com/meetfranz/franz/commit/5c1c0db))
- **Spell check:** fix(Spell checker): Fix disable spell checker ([@vantezzen](https://github.com/vantezzen))
  ([691e0cf](https://github.com/meetfranz/franz/commit/691e0cf))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.4.0-beta.2](https://github.com/meetfranz/franz/compare/v5.4.0-beta.1...v5.4.0-beta.2) (2019-10-04)

### Bug Fixes

- **App:** Fix service issue that crashes the app

# [5.4.0-beta.1](https://github.com/meetfranz/franz/compare/v5.3.3...v5.4.0-beta.1) (2019-10-04)

### Features

- **Custom Websites:** Added navigation bar for "Custom Website" service ([f8fbaad](https://github.com/meetfranz/franz/commit/f8fbaad))
- **Mac:** Open Franz window with `Cmd+1` ([71831ec](https://github.com/meetfranz/franz/commit/71831ec))
- **Todos:** Allow Franz Todos to open links in browser ([5ba6723](https://github.com/meetfranz/franz/commit/5ba6723))
- **Service API:** Share `team`, `url` and `hasCustomIcon` with service ([9f4f3e7](https://github.com/meetfranz/franz/commit/9f4f3e7))

### Bug Fixes

- **App:** Fix "Paste And Match Style" ([490a988](https://github.com/meetfranz/franz/commit/490a988))
- **macOS:** Only show services in Touch Bar that should be visible ([077ad22](https://github.com/meetfranz/franz/commit/077ad22))
- **Service Proxies:** Fix proxy setting rehydration ([e2126a6](https://github.com/meetfranz/franz/commit/e2126a6))
- **Settings:** Fix cache size calculation after clearing cache ([a31566d](https://github.com/meetfranz/franz/commit/a31566d))
- **Spell check:** Fix spell checker to initialize without loaded dictionary ([734732f](https://github.com/meetfranz/franz/commit/734732f))
- **Spell check:** Fix "undefined" language in context menu ([cc03883](https://github.com/meetfranz/franz/commit/cc03883))
- **App:** Fix Basic Auth overlay background in Dark Mode ([027e50d](https://github.com/meetfranz/franz/commit/027e50d))

### General

- **App:** Updated electron to 6.0.11 ([34aab68](https://github.com/meetfranz/franz/commit/34aab68))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.3.3](https://github.com/meetfranz/franz/compare/v5.3.1...v5.3.3) (2019-09-17)

### Features

- **Todos:** Highlight Franz Todos icon in sidebar when the Franz Todos panel is opened ([7431ba3](https://github.com/meetfranz/franz/commit/7431ba3))

### Bug Fixes

- **Spellchecker:** Fix disabling spellchecker after app start ([4035043](https://github.com/meetfranz/franz/commit/4035043))
- **Windows:** Fix window menu to get overwritten by Todos menu ([aa33ac7](https://github.com/meetfranz/franz/commit/aa33ac7))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.3.2](https://github.com/meetfranz/franz/compare/v5.3.1...v5.3.2) (2019-09-12)

### Features

- **Todos:** Move Franz Todos to sidebar ([7ffcf8c](https://github.com/meetfranz/franz/commit/7ffcf8c))
- **Workspaces:** Add setting to keep all services in workspaces in background (avoid reload) ([@Wouter0100](https://github.com/Wouter0100)) ([ddab3a8](https://github.com/meetfranz/franz/commit/ddab3a8))

### Bug Fixes

- **Settings:** Don't toggle Franz Todos on general settings changes ([@vantezzen](https://github.com/vantezzen)) ([a99371b](https://github.com/meetfranz/franz/commit/a99371b))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.3.1](https://github.com/meetfranz/franz/compare/v5.3.0...v5.3.1) (2019-09-06)

### Features

- **App:** Add second confirmation step for the free 14 day trial.
- **Todos:** Add option to disable todos ([5d03b91](https://github.com/meetfranz/franz/commit/5d03b91))

# [5.3.0](https://github.com/meetfranz/franz/compare/v5.2.1-beta.1...v5.3.0) (2019-09-06)

### Features

- **Todos:** 🥳🥳🥳 Manage your daily tasks with **Franz Todos** 🥳🥳🥳
- **App:** Add option to copy debug information via the help menu ([4666e85](https://github.com/meetfranz/franz/commit/4666e85))
- **App:** Updated Pricing, more infos can be found on ([meetfranz.com/pricing](https://meetfranz.com/pricing))
- **App:** Improved Settings UX
- **3rd Party Services:** Added option to open custom recipes folder

### Bug Fixes

- **Windows:** Fix app size in fullscreen ([e210701](https://github.com/meetfranz/franz/commit/e210701))
- **Windows:** Fix app to be cropped at the bottom on Windows ([42f97b4](https://github.com/meetfranz/franz/commit/42f97b4))
- **Notifications:** Fix issue that blocked notifications from e.g. Slack ([44c413b](https://github.com/meetfranz/franz/commit/44c413b))
- **App:** A ton of various bugfixes and improvements

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.2.0](https://github.com/meetfranz/franz/compare/v5.2.0-beta.4...v5.2.0) (2019-07-19)

### Features

- **Service:** You can now add any custom website 🥳

### Bug Fixes

- **Notifications:** Don't show notification badges when app is muted ([e844a64](https://github.com/meetfranz/franz/commit/e844a64))
- **Settings:** Fix position of settings window
- **Recipes:** Fix recipe install when directly accessing recipe e.g. via url ([eba50bc](https://github.com/meetfranz/franz/commit/eba50bc))
- **Proxy:** Fix issue with service proxy authentication ([b9e5b23](https://github.com/meetfranz/franz/commit/b9e5b23))
- **Announcements:** Fix issue with rendering announcements in workspaces ([1e38ec5](https://github.com/meetfranz/franz/commit/1e38ec5))
- **Windows:** Add Workspaces menu & fix Window menu ([92a61d4](https://github.com/meetfranz/franz/commit/92a61d4))
- **Windows:** Replace tray icon with high-res version ([a5eb399](https://github.com/meetfranz/franz/commit/a5eb399))
- **Workspaces:** Fix service reordering within workspaces ([17f3a22](https://github.com/meetfranz/franz/commit/17f3a22))
- **Workspaces:** Fix issue with service visibility after downgrade ([05294](https://github.com/meetfranz/franz/commit/05294))

### General

- **App:** Improved email validation ([dd8ddcc](https://github.com/meetfranz/franz/commit/dd8ddcc)) ([@Snuggle](https://github.com/Snuggle))
- **App:** Update electron to 4.2.4 ([404c87a](https://github.com/meetfranz/franz/commit/404c87a))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.2.0-beta.4](https://github.com/meetfranz/franz/compare/v5.2.0-beta.3...v5.2.0-beta.4) (2019-07-01)

### Bug Fixes

- **Notifications:** Don't show notification badges when app is muted ([e844a64](https://github.com/meetfranz/franz/commit/e844a64))
- **Settings:** Fix position of settings window

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

# [5.2.0-beta.3](https://github.com/meetfranz/franz/compare/v5.2.0-beta.2...v5.2.0-beta.3) (2019-06-24)

### General

- **App:** Downgraded electron to 4.2.4 ([404c87a](https://github.com/meetfranz/franz/commit/404c87a))

# [5.2.0-beta.2](https://github.com/meetfranz/franz/compare/v5.2.0-beta.1...v5.2.0-beta.2) (2019-06-12)

### Bug Fixes

- **Recipes:** Fix recipe install when directly accessing recipe ([eba50bc](https://github.com/meetfranz/franz/commit/eba50bc))

# [5.2.0-beta.1](https://github.com/meetfranz/franz/compare/v5.1.0...v5.2.0-beta.1) (2019-06-11)

### Bug Fixes

- **Workspaces:** Service reordering within workspaces ([17f3a22](https://github.com/meetfranz/franz/commit/17f3a22))
- **Proxy:** Fix issue with proxy authentication ([b9e5b23](https://github.com/meetfranz/franz/commit/b9e5b23))
- **Announcements:** Fixes issue with rendering announcements in workspaces ([1e38ec5](https://github.com/meetfranz/franz/commit/1e38ec5))
- **Windows:** Add Workspaces menu & fix Window menu ([92a61d4](https://github.com/meetfranz/franz/commit/92a61d4))
- **Windows:** Replace tray icon with high-res version ([a5eb399](https://github.com/meetfranz/franz/commit/a5eb399))
- **App:** Improved email validation ([dd8ddcc](https://github.com/meetfranz/franz/commit/dd8ddcc)) ([@Snuggle](https://github.com/Snuggle))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
- **App:** Update electron to 5.0.2 ([5828062](https://github.com/meetfranz/franz/commit/5828062))

# [5.1.0](https://github.com/meetfranz/franz/compare/v5.1.0...v5.1.0-beta.1) (2019-04-16)

### Features

- **App:** Added Workspaces for all your daily routines 🎉 ([47c1c99](https://github.com/meetfranz/franz/commit/47c1c99))
- **App:** Added [Team Management](https://meetfranz.com/user/team) 🎉 ([47c1c99](https://github.com/meetfranz/franz/commit/47c1c99))
- **App:** Added Kerberos Support via Command Line Switches ([#1331](https://github.com/meetfranz/franz/issues/1331)) ([@frumania](https://github.com/frumania)) ([a1950d7](https://github.com/meetfranz/franz/commit/a1950d7))
- **App:** Open changelog in app
- **App:** Various small fixes and improvements

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
- **App:** Update electron to 4.1.4 ([2604914](https://github.com/meetfranz/franz/commit/2604914))

# [5.1.0-beta.1](https://github.com/meetfranz/franz/compare/v5.0.1-beta.1...v5.1.0-beta.1) (2019-04-16)

[See 5.1.0 changelog.](#5-1-0--2019-04-16-)

# [5.0.1](https://github.com/meetfranz/franz/compare/v5.0.0...v5.0.1) (2019-03-25)

### Features

- **App:** Add security checks for external URLs ([6e5531a](https://github.com/meetfranz/franz/commit/6e5531a))
- **Linux:** Add auto updater for Linux AppImage builds ([d641b4e](https://github.com/meetfranz/franz/commit/d641b4e))
- **Spell check:** Add British English as spell check language ([#1306](https://github.com/meetfranz/franz/issues/1306)) ([67fa325](https://github.com/meetfranz/franz/commit/67fa325))
- **Windows:** Add option to quit Franz from Taskbar icon ([952fc8b](https://github.com/meetfranz/franz/commit/952fc8b))

### Bug Fixes

- **Linux:** Fix minimized window focusing ([#1304](https://github.com/meetfranz/franz/issues/1304)) ([@skoruppa](https://github.com/skoruppa)) ([5b02c4d](https://github.com/meetfranz/franz/commit/5b02c4d))
- **Notifications:** Fix notifications & notification click when icon is blob ([03589f6](https://github.com/meetfranz/franz/commit/03589f6))
- **Service:** Fix service zoom (cmd/ctrl+ & cmd/ctrl-) ([91a0f59](https://github.com/meetfranz/franz/commit/91a0f59))
- **Service:** Fix shortcut for (un)muting notifications & audio ([1df3342](https://github.com/meetfranz/franz/commit/1df3342))
- **Windows:** Fix copy & paste in service context menus ([e66fcaa](https://github.com/meetfranz/franz/commit/e66fcaa)), closes [#1316](https://github.com/meetfranz/franz/issues/1316)
- **Windows:** Fix losing window when "Keep Franz in background" is enabled ([78a3722](https://github.com/meetfranz/franz/commit/78a3722))

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**
- **App:** Update electron to 4.0.8 ([8336d17](https://github.com/meetfranz/franz/commit/8336d17))

# [5.0.1-beta.1](https://github.com/meetfranz/franz/compare/v5.0.0...v5.0.1-beta.1) (2019-03-18)

[See 5.0.1 changelog.](#5-0-1--2019-03-25-)

# [5.0.0](https://github.com/meetfranz/franz/compare/5.0.0-beta.24...5.0.0) (2019-02-15)

### Features

- **Spellchecker:** Add automatic spellcheck language detection ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
- **Windows:** Add option to quit Franz from Taskbar ([8808601](https://github.com/meetfranz/franz/commit/8808601))

### Bug Fixes

- **App:** Various bugfixes and improvements

### General

- **App:** Updated electron to 4.0.4

# [5.0.0-beta.24](https://github.com/meetfranz/franz/compare/v5.0.0-beta.23...v5.0.0-beta.24) (2019-02-03)

### Bug Fixes

- **Service:** Fix unnecessary webview resize / Slack scroll issue ([4b7d3e2](https://github.com/meetfranz/franz/commit/4b7d3e2))
- **Service:** Improve focus when switching services ([d130f26](https://github.com/meetfranz/franz/commit/d130f26)), closes [#1255](https://github.com/meetfranz/franz/issues/1255)
- **Service:** Fix dark mode in services ([d529410](https://github.com/meetfranz/franz/commit/d529410))

# [5.0.0-beta.23](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.23) (2019-02-01)

### General

- **App:** Updated electron to 4.0.2 / Chromium 69

### Features

- **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
- **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))

### Bug Fixes

- **App:** Fixed disable notification sounds 🔇
- **App:** Fix app delay for Premium Supporters ([08c40f0](https://github.com/meetfranz/franz/commit/08c40f0))
- **i18n:** Fix "greek" spellchecker name ([89c2eeb](https://github.com/meetfranz/franz/commit/89c2eeb))
- **Spellchecker:** Dictionaries are now part of app instead of dynamic download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))

<a name="5.0.0-beta.22"></a>

# [5.0.0-beta.22](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.22) (2018-12-13)

### Bug Fixes

- **Windows:** Package spellchecker dictionaries

<a name="5.0.0-beta.21"></a>

# [5.0.0-beta.21](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.21) (2018-12-11)

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

- **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))
- **Context Menu:** Quickly change the spellchecker language for the active service
- **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
- **Service:** Add port option for proxy configuration ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))

### Bug Fixes

- **Spellchecker:** Fix issue with dictionary download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))

### Improvements

- **Dark Mode:** Dark Mode polishing
- **App:** Updated a ton of dependencies

<a name="5.0.0-beta.20"></a>

# [5.0.0-beta.20](https://github.com/meetfranz/franz/compare/v5.0.0-beta.19...v5.0.0-beta.20) (2018-12-05)

### Features

- **Windows:** Add taskbar action to reset Franz window ([08fa75a](https://github.com/meetfranz/franz/commit/08fa75a))
- **Context Menu:** Add "Go Back" and "Go Forward" ([5c18595](https://github.com/meetfranz/franz/commit/5c18595))
- **Context Menu:** Add Lookup, Search Google for ([5d5aa0c](https://github.com/meetfranz/franz/commit/5d5aa0c))
- **App:** Add `--devtools` command line arg to automatically open Dev Tools ([84fc3a0](https://github.com/meetfranz/franz/commit/84fc3a0))

### Bug Fixes

- **App:** Use system proxy for services ([8ddae4a](https://github.com/meetfranz/franz/commit/8ddae4a))
- **App:** Fix service request url ([7751c17](https://github.com/meetfranz/franz/commit/7751c17))
- **App:** Do not install App updates without user confirmation ([72fcaef](https://github.com/meetfranz/franz/commit/72fcaef))
- **Windows:** Fix quit app, really! ([ca1d618](https://github.com/meetfranz/franz/commit/ca1d618))
- **Context Menu:** Fix empty context menu item ([18040d4](https://github.com/meetfranz/franz/commit/18040d4))

<a name="5.0.0-beta.19"></a>

# [5.0.0-beta.19](https://github.com/meetfranz/franz/compare/v5.0.0-beta.18...v5.0.0-beta.19) (2018-12-02)

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

- **App:** 👉 Dark Mode 👈 ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f)) 🙌 [@guillecura](https://github.com/guillecura)
- **App:** Add proxy support for services ([6297274](https://github.com/meetfranz/franz/commit/6297274))
- **App:** New spell checker ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
- **App:** New context menu ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
- **App:** Lay groundwork for general themeing support ([4ea044a](https://github.com/meetfranz/franz/commit/4ea044a))
- **App:** Add option to enable dark mode for supported services ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f))

### Bug Fixes

- **App:** App menu was not initialized on app launch. Resolving copy & paste issues for login. ([72d4164](https://github.com/meetfranz/franz/commit/72d4164))
- **General:** Convert many links from http to https ([#967](https://github.com/meetfranz/franz/issues/967)) 🙌 [@Stanzilla](https://github.com/Stanzilla) ([04a23b7](https://github.com/meetfranz/franz/commit/04a23b7))
- **Menu:** Fix File -> Quit menu entry ([#888](https://github.com/meetfranz/franz/issues/888)) 🙌 [@dabalroman](https://github.com/dabalroman) ([4115b27](https://github.com/meetfranz/franz/commit/4115b27))
- **Windows:** Fix impossible Ctrl+10 Shortcut ([0db7c12](https://github.com/meetfranz/franz/commit/0db7c12))
- **Windows:** Remove minimize setting check on close event ([#1038](https://github.com/meetfranz/franz/issues/1038)) 🙌 [@imaginarny](https://github.com/imaginarny) ([af9d356](https://github.com/meetfranz/franz/commit/af9d356))

<a name="5.0.0-beta.18"></a>

# [5.0.0-beta.18](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.18) (2018-04-03)

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

- **App:** Add option to enable/disable hardware acceleration ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))

### Bug Fixes

- **Windows:** Fix shortcuts for closing, minimizing, quitting and toggling fullscreen ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))
- **Windows:** Hide title bar when in fullscreen ([655a6ed](https://github.com/meetfranz/franz/commit/655a6ed))

<a name="5.0.0-beta.17"></a>

# [5.0.0-beta.17](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.17) (2018-03-20)

### General

- **App:** Various performance improvements
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

- **Windows:** Replace window frame with custom menu bar ([9af5fd0](https://github.com/meetfranz/franz/commit/9af5fd0))
- **Electron:** Update electron to 1.8.4 ([b9c6616](https://github.com/meetfranz/franz/commit/b9c6616))
- **Mac:** Add dock bounce when new update is available ([47885bb](https://github.com/meetfranz/franz/commit/47885bb))
- **Services:** Improve performance when reordering services ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))
- **Translations:** Add option to translate error messages and system menus ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))

### Bug Fixes

- **App:** Fix app reload when coming back from sleep ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
- **App:** Fix issue with app not showing services when recipe has invalid version (e.g. mailbox.org) ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
- **Linux:** Fix missing/flickering ubuntu tray icon ([592f00a](https://github.com/meetfranz/franz/commit/592f00a))
- **Service Tabs:** Remove "delete service" context menu when not in development mode ([3a5c3f0](https://github.com/meetfranz/franz/commit/3a5c3f0))
- **Windows:** Improve app window handling ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))

<a name="5.0.0-beta.16"></a>

# [5.0.0-beta.16](https://github.com/meetfranz/franz/compare/v5.0.0-beta.15...v5.0.0-beta.16) (2018-02-23)

### General

- **App:** Update Electron version to 1.7.12 (fixes critical security vulnerability CVE-2018–1000006 ) ([c67d7d1](https://github.com/meetfranz/franz/commit/c67d7d1))
- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](https://i18n.meetfranz.com/)**

### Features

- **App:** Invite Friends in Settings ([ab33c44](https://github.com/meetfranz/franz/commit/ab33c44))

### Bug Fixes

- **App:** Fix memory leak in recipe polling loop ([c99848f](https://github.com/meetfranz/franz/commit/c99848f))
- **App:** Fix validation for side-by-side teamId & customURL ([bd51150](https://github.com/meetfranz/franz/commit/bd51150))
- **App:** Reload Franz instead of all services one by one on sleep resume ([4e5f7af](https://github.com/meetfranz/franz/commit/4e5f7af))
- **App:** Fix toggle buttons shown during import ([1220e2c](https://github.com/meetfranz/franz/commit/1220e2c))
  fix(App): Bugfix Fix memory leak in recipe polling loop
- **App:** Fix invite screen [object Object] values ([81c4e99](https://github.com/meetfranz/franz/commit/81c4e99))
- **App:** Fix Franz-wide form validation ([7618f51](https://github.com/meetfranz/franz/commit/7618f51))
- **App:** Fix service tooltips not initialized properly ([8765b8f](https://github.com/meetfranz/franz/commit/8765b8f))
- **Linux:** Invert tray icon color & add border for bright UI's ([0de9c60](https://github.com/meetfranz/franz/commit/0de9c60))

<a name="5.0.0-beta.15"></a>

# [5.0.0-beta.15](https://github.com/meetfranz/franz/compare/v5.0.0-beta.14...v5.0.0-beta.15) (2018-01-10)

### General

- **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

- **App:** Add option to clear app cache ([@dannyqiu](https://github.com/dannyqiu)) ([be801ff](https://github.com/meetfranz/franz/commit/be801ff))
- **App:** Add option to show/hide notification badges for muted ([893a9f6](https://github.com/meetfranz/franz/commit/893a9f6))
- **Recipes:** Add semver version validation ([5826dc3](https://github.com/meetfranz/franz/commit/5826dc3))
- **Recipes:** Add `hasHostedOption` to enable hosted & self hosted services ([03610f2](https://github.com/meetfranz/franz/commit/03610f2))
- **Services:** Add custom service icon upload ([6b97e42](https://github.com/meetfranz/franz/commit/6b97e42))
- **Services:** Add option to completely disable message badges ([cea7a5c](https://github.com/meetfranz/franz/commit/cea7a5c))
- **Services:** Improve handling of external links ([e2d6edf](https://github.com/meetfranz/franz/commit/e2d6edf))
- **Services:** Improve user experience of service search ([7e784c6](https://github.com/meetfranz/franz/commit/7e784c6))
- **Account:** Enable a user to delete their own account ([1f3df73](https://github.com/meetfranz/franz/commit/1f3df73))

### Bug Fixes

- **App:** Allow to turn on notifications when system dnd is enabled ([3045b47](https://github.com/meetfranz/franz/commit/3045b47))
- **App:** App mute now disables notifications as well ([0fa1caf](https://github.com/meetfranz/franz/commit/0fa1caf))
- **App:** Fix service reload after waking machine up ([531531e](https://github.com/meetfranz/franz/commit/531531e))
- **App:** Fix "add services manually" message ([ac417dc](https://github.com/meetfranz/franz/commit/ac417dc))
- **i18n:** Fallback to system language or english ([9733eaf](https://github.com/meetfranz/franz/commit/9733eaf))
- **Notification:** Remove notification sound when app is muted ([53fde0c](https://github.com/meetfranz/franz/commit/53fde0c))
- **Recipes:** Enable `urlInputPrefix` for team and customURL ([873957d](https://github.com/meetfranz/franz/commit/873957d))
- **Services:** Ctrl/Cmd+R now navigates back to the service root ([7293492](https://github.com/meetfranz/franz/commit/7293492))
- **Services:** Fix transparent service background ([ed0098f](https://github.com/meetfranz/franz/commit/ed0098f))
- **Shortcuts:** Fixed settings shortcut inconsistency ([ca74846](https://github.com/meetfranz/franz/commit/ca74846))
- **Spell checker:** Fixed issues with spell checker ([965fdf2](https://github.com/meetfranz/franz/commit/965fdf2))
- **Translations:** Re-add Spanish to available languages. ([ad936f2](https://github.com/meetfranz/franz/commit/ad936f2))
- **Windows:** Open window when clicking on toast notification ([b82bbc8](https://github.com/meetfranz/franz/commit/b82bbc8))

<a name="5.0.0-beta.14"></a>

# [5.0.0-beta.14](https://github.com/meetfranz/franz/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2017-11-23)

### Features

- **App:** Add link to changelog in app update notification ([2cbd938](https://github.com/meetfranz/franz/commit/2cbd938))
- **App:** Add option to enable/disable spell checker ([dcab45a](https://github.com/meetfranz/franz/commit/dcab45a))
- **App:** Add option to mute all services in sidebar ([f5a9aa2](https://github.com/meetfranz/franz/commit/f5a9aa2))
- **App:** Decrease minimum window size to 600px width ([2521621](https://github.com/meetfranz/franz/commit/2521621))
- **App:** Respect System DoNotDisturb mode for service audio ([7d41227](https://github.com/meetfranz/franz/commit/7d41227))
- **Service:** Add option to display disabled services in tabs ([1839eff](https://github.com/meetfranz/franz/commit/1839eff))
- **Service:** Add option to mute service ([b405ba1](https://github.com/meetfranz/franz/commit/b405ba1))
- **Service:** Add dialog to reload crashed services ([259d40c](https://github.com/meetfranz/franz/commit/259d40c)) ([dannyqiu](https://github.com/dannyqiu))
- **Translations:** Added new translations and improved existing ones. **[A million thanks to the amazing community.](https://i18n.meetfranz.com/)**

### Bug Fixes

- **Windows:** Fix notifications on Windows 10 (Fall Creators Update) ([eea4801](https://github.com/meetfranz/franz/commit/eea4801))
- **macOS:** Fix TouchBar related crash on macOS 10.12.1 and lower ([9e9a2ed](https://github.com/meetfranz/franz/commit/9e9a2ed))
- **App:** Add fallback to service menu when service name is empty ([42ed24d](https://github.com/meetfranz/franz/commit/42ed24d))
- **App:** Prevent app from redirecting when dropping link ([811a527](https://github.com/meetfranz/franz/commit/811a527)) ([dannyqiu](https://github.com/dannyqiu))
- **Support with CPU:** Reduce maximum CPU usage ([64ad918](https://github.com/meetfranz/franz/commit/64ad918))
- **Hosted Services:** Do not strip www from custom service Url ([a764321](https://github.com/meetfranz/franz/commit/a764321)) ([BeneStem](https://github.com/BeneStem))
- **Services:** Fix onNotify in service API ([b15421b](https://github.com/meetfranz/franz/commit/b15421b)) ([dannyqiu](https://github.com/dannyqiu))
- **Sidebar:** Fix tabs reordering ([86413ba](https://github.com/meetfranz/franz/commit/86413ba)) ([josescgar](https://github.com/josescgar))

<a name="5.0.0-beta.13"></a>

# [5.0.0-beta.13](https://github.com/meetfranz/franz/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2017-11-06)

### Bug Fixes

- **Windows:** Fix issue with multiple close handlers that prevent the app from quitting ([eea593e](https://github.com/meetfranz/franz/commit/eea593e))

<a name="5.0.0-beta.12"></a>

# [5.0.0-beta.12](https://github.com/meetfranz/franz/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2017-11-05)

### Features

- **Menu:** Add "About Franz" Menu item to Windows/Linux ([a21b770](https://github.com/meetfranz/franz/commit/a21b770))
- **Menu:** Add menu item to toggle (service) dev tools ([e8da383](https://github.com/meetfranz/franz/commit/e8da383))
- **Translation:** Add italian translation ([ab348cc](https://github.com/meetfranz/franz/commit/ab348cc)) ([dnlup](https://github.com/dnlup))

### Bug Fixes

- **App:** Add checks to service url validation to prevent app freeze ([db8515f](https://github.com/meetfranz/franz/commit/db8515f))
- **macOS:** Fix disable launch Franz on start ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
- **Windows:** Launch Franz on start when selected ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
- **Onboarding:** Fix issue with import of on-premise services ([7c7d27d](https://github.com/meetfranz/franz/commit/7c7d27d))
- **Shortcuts:** Flip shortcut to navigate to next/previous service ([37d5923](https://github.com/meetfranz/franz/commit/37d5923))
- **Windows:** Open Window when app is pinned to taskbar and minimized to system tray ([777814a](https://github.com/meetfranz/franz/commit/777814a))
- **Recipes:** Recipe developers don't need Premium Supporter Account for debugging ([7a9947a](https://github.com/meetfranz/franz/commit/7a9947a))

<a name="5.0.0-beta.11"></a>

# [5.0.0-beta.11](https://github.com/meetfranz/franz/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2017-10-24)

### Features

- **Settings:** Add option to disable system tray icon ([c62f3fc](https://github.com/meetfranz/franz/commit/c62f3fc))
- **Service:** Display URL of hyperlinks ([a0cec4d](https://github.com/meetfranz/franz/commit/a0cec4d)) ([GustavoKatel](https://github.com/GustavoKatel))
- **App:** Add tab cycling with ctrl[+shift]+tab or ctrl+[pageup|pagedown] ([e58f558](https://github.com/meetfranz/franz/commit/
  e58f558)) ([GustavoKatel](https://github.com/GustavoKatel))
- **Translation:** Add Brazilian Portuguese ([phmigotto](https://github.com/phmigotto))
- **Translation:** Add Dutch ([cpeetersburg](https://github.com/cpeetersburg), [Blizzke](https://github.com/Blizzke))
- **Translation:** Add Flemish ([Blizzke](https://github.com/Blizzke), [mroeling](https://github.com/mroeling))
- **Translation:** Add German ([rherwig](https://github.com/rherwig), [berndstelzl](https://github.com/berndstelzl))
- **Translation:** Add Greek ([apo-mak](https://github.com/apo-mak))
- **Translation:** Add French ([Shadorc](https://github.com/Shadorc), [ShiiFu](https://github.com/ShiiFu))
- **Translation:** Add Japanese ([koma-private](https://github.com/koma-private))
- **Translation:** Add Polish ([grzeswol](https://github.com/grzeswol))
- **Translation:** Add Russian ([vaseker](https://github.com/vaseker))
- **Translation:** Add Ukrainian ([Kietzmann](https://github.com/Kietzmann))

### Bug Fixes

- **App:** Force Franz to use single window ([2ae409e](https://github.com/meetfranz/franz/commit/2ae409e))
- **Onboarding:** Fix enable/disable service import toggle ([23174f9](https://github.com/meetfranz/franz/commit/23174f9))
- **Onboarding:** Fix service import ([99d1c01](https://github.com/meetfranz/franz/commit/99d1c01))
- **Payment:** Fix payment window when name contains special character ([a854614](https://github.com/meetfranz/franz/commit/a854614))
- **macOS:** Add macOS dark theme system tray icon ([55805f1](https://github.com/meetfranz/franz/commit/55805f1))
- **Windows:** Fix enable/disable autostart on login ([eca7f3b](https://github.com/meetfranz/franz/commit/eca7f3b))
- **Windows:** Fix multiple system tray icons when opening/closing Franz ([5b9b0c7](https://github.com/meetfranz/franz/commit/5b9b0c7))
