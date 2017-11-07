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
* **Recipes:** Recipe developers don't need Premium Supporter Account for debugging ([7a9947a](https://github.com/meetfranz/franz/commit/7a9947a)), closes [#23](https://github.com/meetfranz/franz/issues/23)



<a name="5.0.0-beta.11"></a>
# [5.0.0-beta.11](https://github.com/meetfranz/franz/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2017-10-24)

### Features

* **Settings:** Add option to disable system tray icon ([c62f3fc](https://github.com/meetfranz/franz/commit/c62f3fc)), closes [#2](https://github.com/meetfranz/franz/issues/2)
* **Service:** Display URL of hyperlinks ([a0cec4d](https://github.com/meetfranz/franz/commit/a0cec4d)), closes [#47](https://github.com/meetfranz/franz/issues/47) ([GustavoKatel](https://github.com/GustavoKatel))
* **App:** Add tab cycling with ctrl[+shift]+tab or ctrl+[pageup|pagedown] ([e58f558](https://github.com/meetfranz/franz/commit/
e58f558)), closes [#35](https://github.com/meetfranz/franz/issues/35) ([GustavoKatel](https://github.com/GustavoKatel))
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

* **App:** Force Franz to use single window ([2ae409e](https://github.com/meetfranz/franz/commit/2ae409e)), closes [#29](https://github.com/meetfranz/franz/issues/29)
* **Onboarding:** Fix enable/disable service import toggle ([23174f9](https://github.com/meetfranz/franz/commit/23174f9))
* **Onboarding:** Fix service import ([99d1c01](https://github.com/meetfranz/franz/commit/99d1c01)), closes [#22](https://github.com/meetfranz/franz/issues/22)
* **Payment:** Fix payment window when name contains special character ([a854614](https://github.com/meetfranz/franz/commit/a854614))
* **macOS:** Add macOS dark theme system tray icon ([55805f1](https://github.com/meetfranz/franz/commit/55805f1)), closes [#1](https://github.com/meetfranz/franz/issues/1)
* **Windows:** Fix enable/disable autostart on login ([eca7f3b](https://github.com/meetfranz/franz/commit/eca7f3b)), closes [#17](https://github.com/meetfranz/franz/issues/17)
* **Windows:** Fix multiple system tray icons when opening/closing Franz ([5b9b0c7](https://github.com/meetfranz/franz/commit/5b9b0c7))
