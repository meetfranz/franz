enum Themes {
  default = 'default',
  dark = 'dark',
}

import * as darkThemeConfig from './themes/dark';
import * as defaultThemeConfig from './themes/default';

export default (themeId: Themes) => {
  if (themeId === Themes.dark) {
    return Object.assign({}, defaultThemeConfig, darkThemeConfig);
  }

  return Object.assign({}, defaultThemeConfig);
};

export type Theme = typeof defaultThemeConfig;
