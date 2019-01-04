export enum ThemeType {
  default = 'default',
  dark = 'dark',
}

import * as darkThemeConfig from './themes/dark';
import * as defaultThemeConfig from './themes/default';

export default (themeId: ThemeType) => {
  if (themeId === ThemeType.dark) {
    return Object.assign({}, defaultThemeConfig, darkThemeConfig);
  }

  return Object.assign({}, defaultThemeConfig);
};

export type Theme = typeof defaultThemeConfig;
