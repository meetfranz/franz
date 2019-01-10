import * as darkThemeConfig from './themes/dark';
import * as defaultThemeConfig from './themes/default';
import * as legacyStyles from './themes/legacy';

export enum ThemeType {
  default = 'default',
  dark = 'dark',
}

export function theme(themeId: ThemeType) {
  if (themeId === ThemeType.dark) {
    return Object.assign({}, defaultThemeConfig, darkThemeConfig, { legacyStyles });
  }

  return Object.assign({}, defaultThemeConfig, { legacyStyles });
}

export type Theme = typeof defaultThemeConfig;
