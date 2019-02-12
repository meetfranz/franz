# [5.0.0-beta.24](https://github.com/meetfranz/franz/compare/v5.0.0-beta.23...v5.0.0-beta.24) (2019-02-03)


### Bug Fixes

* **Service:** Fix unnecessary webview resize / Slack scroll issue ([4b7d3e2](https://github.com/meetfranz/franz/commit/4b7d3e2))
* **Service:** Improve focus when switching services ([d130f26](https://github.com/meetfranz/franz/commit/d130f26)), closes [#1255](https://github.com/meetfranz/franz/issues/1255)
* **Service:** Fix dark mode in services ([d529410](https://github.com/meetfranz/franz/commit/d529410))



# [5.0.0-beta.23](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.23) (2019-02-01)

### General

* **App:** Updated electron to 4.0.2 / Chromium 69

### Features

* **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
* **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))

### Bug Fixes

* **App:** Fixed disable notification sounds 🔇
* **App:** Fix app delay for Premium Supporters ([08c40f0](https://github.com/meetfranz/franz/commit/08c40f0))
* **i18n:** Fix "greek" spellchecker name ([89c2eeb](https://github.com/meetfranz/franz/commit/89c2eeb))
* **Spellchecker:** Dictionaries are now part of app instead of dynamic download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))


<a name="5.0.0-beta.22"></a>
# [5.0.0-beta.22](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.22) (2018-12-13)


### Bug Fixes

* **Windows:** Package spellchecker dictionaries


<a name="5.0.0-beta.21"></a>
# [5.0.0-beta.21](https://github.com/meetfranz/franz/compare/5.0.0-beta.20...5.0.0-beta.21) (2018-12-11)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **Service:** Add option to change spellchecking language by service ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))
* **Context Menu:** Quickly change the spellchecker language for the active service
* **Service:** Add error screen for services that failed to load ([a5e7171](https://github.com/meetfranz/franz/commit/a5e7171))
* **Service:** Add port option for proxy configuration ([baf7d60](https://github.com/meetfranz/franz/commit/baf7d60))


### Bug Fixes

* **Spellchecker:** Fix issue with dictionary download ([0cdc165](https://github.com/meetfranz/franz/commit/0cdc165))

### Improvements

* **Dark Mode:** Dark Mode polishing
* **App:** Updated a ton of dependencies


<a name="5.0.0-beta.20"></a>
# [5.0.0-beta.20](https://github.com/meetfranz/franz/compare/v5.0.0-beta.19...v5.0.0-beta.20) (2018-12-05)


### Features

* **Windows:** Add taskbar action to reset Franz window ([08fa75a](https://github.com/meetfranz/franz/commit/08fa75a))
* **Context Menu:** Add "Go Back" and "Go Forward" ([5c18595](https://github.com/meetfranz/franz/commit/5c18595))
* **Context Menu:** Add Lookup, Search Google for ([5d5aa0c](https://github.com/meetfranz/franz/commit/5d5aa0c))
* **App:** Add `--devtools` command line arg to automatically open Dev Tools ([84fc3a0](https://github.com/meetfranz/franz/commit/84fc3a0))

### Bug Fixes

* **App:** Use system proxy for services ([8ddae4a](https://github.com/meetfranz/franz/commit/8ddae4a))
* **App:** Fix service request url ([7751c17](https://github.com/meetfranz/franz/commit/7751c17))
* **App:** Do not install App updates without user confirmation ([72fcaef](https://github.com/meetfranz/franz/commit/72fcaef))
* **Windows:** Fix quit app, really! ([ca1d618](https://github.com/meetfranz/franz/commit/ca1d618))
* **Context Menu:** Fix empty context menu item ([18040d4](https://github.com/meetfranz/franz/commit/18040d4))


<a name="5.0.0-beta.19"></a>
# [5.0.0-beta.19](https://github.com/meetfranz/franz/compare/v5.0.0-beta.18...v5.0.0-beta.19) (2018-12-02)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** 👉 Dark Mode 👈 ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f)) 🙌 [@guillecura](https://github.com/guillecura)
* **App:** Add proxy support for services ([6297274](https://github.com/meetfranz/franz/commit/6297274)) 
* **App:** New spell checker ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
* **App:** New context menu ([3d87c0e](https://github.com/meetfranz/franz/commit/3d87c0e))
* **App:** Lay groundwork for general themeing support ([4ea044a](https://github.com/meetfranz/franz/commit/4ea044a))
* **App:** Add option to enable dark mode for supported services ([fd7954f](https://github.com/meetfranz/franz/commit/fd7954f))

### Bug Fixes

* **App:** App menu was not initialized on app launch. Resolving copy & paste issues for login. ([72d4164](https://github.com/meetfranz/franz/commit/72d4164))
* **General:** Convert many links from http to https ([#967](https://github.com/meetfranz/franz/issues/967)) 🙌 [@Stanzilla](https://github.com/Stanzilla) ([04a23b7](https://github.com/meetfranz/franz/commit/04a23b7))
* **Menu:** Fix File -> Quit menu entry ([#888](https://github.com/meetfranz/franz/issues/888)) 🙌 [@dabalroman](https://github.com/dabalroman) ([4115b27](https://github.com/meetfranz/franz/commit/4115b27))
* **Windows:** Fix impossible Ctrl+10 Shortcut ([0db7c12](https://github.com/meetfranz/franz/commit/0db7c12))
* **Windows:** Remove minimize setting check on close event ([#1038](https://github.com/meetfranz/franz/issues/1038)) 🙌 [@imaginarny](https://github.com/imaginarny) ([af9d356](https://github.com/meetfranz/franz/commit/af9d356))


<a name="5.0.0-beta.18"></a>
# [5.0.0-beta.18](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.18) (2018-04-03)

### General
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** Add option to enable/disable hardware acceleration ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))

### Bug Fixes

* **Windows:** Fix shortcuts for closing, minimizing, quitting and toggling fullscreen ([f720d30](https://github.com/meetfranz/franz/commit/f720d30))
* **Windows:** Hide title bar when in fullscreen ([655a6ed](https://github.com/meetfranz/franz/commit/655a6ed))


<a name="5.0.0-beta.17"></a>
# [5.0.0-beta.17](https://github.com/meetfranz/franz/compare/v5.0.0-beta.16...v5.0.0-beta.17) (2018-03-20)

### General

* **App:** Various performance improvements
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**


### Features

* **Windows:** Replace window frame with custom menu bar ([9af5fd0](https://github.com/meetfranz/franz/commit/9af5fd0))
* **Electron:** Update electron to 1.8.4 ([b9c6616](https://github.com/meetfranz/franz/commit/b9c6616))
* **Mac:** Add dock bounce when new update is available ([47885bb](https://github.com/meetfranz/franz/commit/47885bb))
* **Services:** Improve performance when reordering services ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))
* **Translations:** Add option to translate error messages and system menus ([82e832c](https://github.com/meetfranz/franz/commit/82e832c))

### Bug Fixes

* **App:** Fix app reload when coming back from sleep ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
* **App:** Fix issue with app not showing services when recipe has invalid version (e.g. mailbox.org) ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))
* **Linux:** Fix missing/flickering ubuntu tray icon ([592f00a](https://github.com/meetfranz/franz/commit/592f00a))
* **Service Tabs:** Remove "delete service" context menu when not in development mode ([3a5c3f0](https://github.com/meetfranz/franz/commit/3a5c3f0))
* **Windows:** Improve app window handling ([dd9f447](https://github.com/meetfranz/franz/commit/dd9f447))


<a name="5.0.0-beta.16"></a>
# [5.0.0-beta.16](https://github.com/meetfranz/franz/compare/v5.0.0-beta.15...v5.0.0-beta.16) (2018-02-23)

### General
* **App:** Update Electron version to 1.7.12 (fixes critical security vulnerability CVE-2018–1000006 ) ([c67d7d1](https://github.com/meetfranz/franz/commit/c67d7d1))
* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](https://i18n.meetfranz.com/)**

### Features
* **App:** Invite Friends in Settings ([ab33c44](https://github.com/meetfranz/franz/commit/ab33c44))

### Bug Fixes

* **App:** Fix memory leak in recipe polling loop ([c99848f](https://github.com/meetfranz/franz/commit/c99848f))
* **App:** Fix validation for side-by-side teamId & customURL ([bd51150](https://github.com/meetfranz/franz/commit/bd51150))
* **App:** Reload Franz instead of all services one by one on sleep resume ([4e5f7af](https://github.com/meetfranz/franz/commit/4e5f7af))
* **App:** Fix toggle buttons shown during import ([1220e2c](https://github.com/meetfranz/franz/commit/1220e2c))
fix(App): Bugfix Fix memory leak in recipe polling loop
* **App:** Fix invite screen [object Object] values ([81c4e99](https://github.com/meetfranz/franz/commit/81c4e99))
* **App:** Fix Franz-wide form validation ([7618f51](https://github.com/meetfranz/franz/commit/7618f51))
* **App:** Fix service tooltips not initialized properly ([8765b8f](https://github.com/meetfranz/franz/commit/8765b8f))
* **Linux:** Invert tray icon color & add border for bright UI's ([0de9c60](https://github.com/meetfranz/franz/commit/0de9c60))



<a name="5.0.0-beta.15"></a>
# [5.0.0-beta.15](https://github.com/meetfranz/franz/compare/v5.0.0-beta.14...v5.0.0-beta.15) (2018-01-10)

### General

* **Translations:** Improved translations. **[A million thanks to the amazing community. 🎉](http://i18n.meetfranz.com/)**

### Features

* **App:** Add option to clear app cache ([@dannyqiu](https://github.com/dannyqiu)) ([be801ff](https://github.com/meetfranz/franz/commit/be801ff))
* **App:** Add option to show/hide notification badges for muted ([893a9f6](https://github.com/meetfranz/franz/commit/893a9f6))
* **Recipes:** Add semver version validation ([5826dc3](https://github.com/meetfranz/franz/commit/5826dc3))
* **Recipes:** Add `hasHostedOption` to enable hosted & self hosted services ([03610f2](https://github.com/meetfranz/franz/commit/03610f2))
* **Services:** Add custom service icon upload ([6b97e42](https://github.com/meetfranz/franz/commit/6b97e42))
* **Services:** Add option to completely disable message badges ([cea7a5c](https://github.com/meetfranz/franz/commit/cea7a5c))
* **Services:** Improve handling of external links ([e2d6edf](https://github.com/meetfranz/franz/commit/e2d6edf))
* **Services:** Improve user experience of service search ([7e784c6](https://github.com/meetfranz/franz/commit/7e784c6))
* **Account:** Enable a user to delete their own account ([1f3df73](https://github.com/meetfranz/franz/commit/1f3df73))



### Bug Fixes

* **App:** Allow to turn on notifications when system dnd is enabled ([3045b47](https://github.com/meetfranz/franz/commit/3045b47))
* **App:** App mute now disables notifications as well ([0fa1caf](https://github.com/meetfranz/franz/commit/0fa1caf))
* **App:** Fix service reload after waking machine up ([531531e](https://github.com/meetfranz/franz/commit/531531e))
* **App:** Fix "add services manually" message ([ac417dc](https://github.com/meetfranz/franz/commit/ac417dc))
* **i18n:** Fallback to system language or english ([9733eaf](https://github.com/meetfranz/franz/commit/9733eaf))
* **Notification:** Remove notification sound when app is muted ([53fde0c](https://github.com/meetfranz/franz/commit/53fde0c))
* **Recipes:** Enable `urlInputPrefix` for team and customURL ([873957d](https://github.com/meetfranz/franz/commit/873957d))
* **Services:** Ctrl/Cmd+R now navigates back to the service root ([7293492](https://github.com/meetfranz/franz/commit/7293492))
* **Services:** Fix transparent service background ([ed0098f](https://github.com/meetfranz/franz/commit/ed0098f))
* **Shortcuts:** Fixed settings shortcut inconsistency ([ca74846](https://github.com/meetfranz/franz/commit/ca74846))
* **Spell checker:** Fixed issues with spell checker ([965fdf2](https://github.com/meetfranz/franz/commit/965fdf2))
* **Translations:** Re-add Spanish to available languages. ([ad936f2](https://github.com/meetfranz/franz/commit/ad936f2))
* **Windows:** Open window when clicking on toast notification ([b82bbc8](https://github.com/meetfranz/franz/commit/b82bbc8))


<a name="5.0.0-beta.14"></a>
# [5.0.0-beta.14](https://github.com/meetfranz/franz/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2017-11-23)


### Features

* **App:** Add link to changelog in app update notification ([2cbd938](https://github.com/meetfranz/franz/commit/2cbd938))
* **App:** Add option to enable/disable spell checker ([dcab45a](https://github.com/meetfranz/franz/commit/dcab45a))
* **App:** Add option to mute all services in sidebar ([f5a9aa2](https://github.com/meetfranz/franz/commit/f5a9aa2))
* **App:** Decrease minimum window size to 600px width ([2521621](https://github.com/meetfranz/franz/commit/2521621))
* **App:** Respect System DoNotDisturb mode for service audio ([7d41227](https://github.com/meetfranz/franz/commit/7d41227))
* **Service:** Add option to display disabled services in tabs ([1839eff](https://github.com/meetfranz/franz/commit/1839eff))
* **Service:** Add option to mute service ([b405ba1](https://github.com/meetfranz/franz/commit/b405ba1))
* **Service:** Add dialog to reload crashed services ([259d40c](https://github.com/meetfranz/franz/commit/259d40c)) ([dannyqiu](https://github.com/dannyqiu))
* **Translations:** Added new translations and improved existing ones. **[A million thanks to the amazing community.](https://i18n.meetfranz.com/)**


### Bug Fixes

* **Windows:** Fix notifications on Windows 10 (Fall Creators Update) ([eea4801](https://github.com/meetfranz/franz/commit/eea4801))
* **macOS:** Fix TouchBar related crash on macOS 10.12.1 and lower ([9e9a2ed](https://github.com/meetfranz/franz/commit/9e9a2ed))
* **App:** Add fallback to service menu when service name is empty ([42ed24d](https://github.com/meetfranz/franz/commit/42ed24d))
* **App:** Prevent app from redirecting when dropping link ([811a527](https://github.com/meetfranz/franz/commit/811a527)) ([dannyqiu](https://github.com/dannyqiu))
* **Support with CPU:** Reduce maximum CPU usage ([64ad918](https://github.com/meetfranz/franz/commit/64ad918))
* **Hosted Services:** Do not strip www from custom service Url  ([a764321](https://github.com/meetfranz/franz/commit/a764321)) ([BeneStem](https://github.com/BeneStem))
* **Services:** Fix onNotify in service API ([b15421b](https://github.com/meetfranz/franz/commit/b15421b)) ([dannyqiu](https://github.com/dannyqiu))
* **Sidebar:** Fix tabs reordering ([86413ba](https://github.com/meetfranz/franz/commit/86413ba)) ([josescgar](https://github.com/josescgar))



<a name="5.0.0-beta.13"></a>
# [5.0.0-beta.13](https://github.com/meetfranz/franz/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2017-11-06)

### Bug Fixes

* **Windows:** Fix issue with multiple close handlers that prevent the app from quitting  ([eea593e](https://github.com/meetfranz/franz/commit/eea593e))


<a name="5.0.0-beta.12"></a>
# [5.0.0-beta.12](https://github.com/meetfranz/franz/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2017-11-05)

### Features

* **Menu:** Add "About Franz" Menu item to Windows/Linux ([a21b770](https://github.com/meetfranz/franz/commit/a21b770))
* **Menu:** Add menu item to toggle (service) dev tools ([e8da383](https://github.com/meetfranz/franz/commit/e8da383))
* **Translation:** Add italian translation ([ab348cc](https://github.com/meetfranz/franz/commit/ab348cc)) ([dnlup](https://github.com/dnlup))


### Bug Fixes

* **App:** Add checks to service url validation to prevent app freeze  ([db8515f](https://github.com/meetfranz/franz/commit/db8515f))
* **macOS:** Fix disable launch Franz on start ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
* **Windows:** Launch Franz on start when selected ([34bba09](https://github.com/meetfranz/franz/commit/34bba09))
* **Onboarding:** Fix issue with import of on-premise services ([7c7d27d](https://github.com/meetfranz/franz/commit/7c7d27d))
* **Shortcuts:** Flip shortcut to navigate to next/previous service ([37d5923](https://github.com/meetfranz/franz/commit/37d5923))
* **Windows:** Open Window when app is pinned to taskbar and minimized to system tray ([777814a](https://github.com/meetfranz/franz/commit/777814a))
* **Recipes:** Recipe developers don't need Premium Supporter Account for debugging ([7a9947a](https://github.com/meetfranz/franz/commit/7a9947a))



<a name="5.0.0-beta.11"></a>
# [5.0.0-beta.11](https://github.com/meetfranz/franz/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2017-10-24)

### Features

* **Settings:** Add option to disable system tray icon ([c62f3fc](https://github.com/meetfranz/franz/commit/c62f3fc))
* **Service:** Display URL of hyperlinks ([a0cec4d](https://github.com/meetfranz/franz/commit/a0cec4d)) ([GustavoKatel](https://github.com/GustavoKatel))
* **App:** Add tab cycling with ctrl[+shift]+tab or ctrl+[pageup|pagedown] ([e58f558](https://github.com/meetfranz/franz/commit/
e58f558)) ([GustavoKatel](https://github.com/GustavoKatel))
* **Translation:** Add Brazilian Portuguese ([phmigotto](https://github.com/phmigotto))
* **Translation:** Add Dutch ([cpeetersburg](https://github.com/cpeetersburg), [Blizzke](https://github.com/Blizzke))
* **Translation:** Add Flemish ([Blizzke](https://github.com/Blizzke), [mroeling](https://github.com/mroeling))
* **Translation:** Add German ([rherwig](https://github.com/rherwig), [berndstelzl](https://github.com/berndstelzl))
* **Translation:** Add Greek ([apo-mak](https://github.com/apo-mak))
* **Translation:** Add French ([Shadorc](https://github.com/Shadorc), [ShiiFu](https://github.com/ShiiFu))
* **Translation:** Add Japanese ([koma-private](https://github.com/koma-private))
* **Translation:** Add Polish ([grzeswol](https://github.com/grzeswol))
* **Translation:** Add Russian ([vaseker](https://github.com/vaseker))
* **Translation:** Add Ukrainian ([Kietzmann](https://github.com/Kietzmann))

### Bug Fixes

* **App:** Force Franz to use single window ([2ae409e](https://github.com/meetfranz/franz/commit/2ae409e))
* **Onboarding:** Fix enable/disable service import toggle ([23174f9](https://github.com/meetfranz/franz/commit/23174f9))
* **Onboarding:** Fix service import ([99d1c01](https://github.com/meetfranz/franz/commit/99d1c01))
* **Payment:** Fix payment window when name contains special character ([a854614](https://github.com/meetfranz/franz/commit/a854614))
* **macOS:** Add macOS dark theme system tray icon ([55805f1](https://github.com/meetfranz/franz/commit/55805f1))
* **Windows:** Fix enable/disable autostart on login ([eca7f3b](https://github.com/meetfranz/franz/commit/eca7f3b))
* **Windows:** Fix multiple system tray icons when opening/closing Franz ([5b9b0c7](https://github.com/meetfranz/franz/commit/5b9b0c7))
