import color from 'color';

import * as legacyStyles from '../legacy';

export const colorBackground = legacyStyles.darkThemeGrayDarkest;
export const colorContentBackground = legacyStyles.darkThemeGrayDarkest;
export const colorBackgroundSubscriptionContainer = legacyStyles.themeBrandInfo;

export const colorHeadline = legacyStyles.darkThemeTextColor;
export const colorText = legacyStyles.darkThemeTextColor;

// Loader
export const colorFullscreenLoaderSpinner = '#FFF';
export const colorWebviewLoaderBackground = color(legacyStyles.darkThemeGrayDarkest).alpha(0.5).rgb().string();

// Input
export const labelColor = legacyStyles.darkThemeTextColor;
export const inputColor = legacyStyles.darkThemeGrayLightest;
export const inputBackground = legacyStyles.themeGrayDark;
export const inputBorder = `1px solid ${legacyStyles.darkThemeGrayLight}`;
export const inputPrefixColor = color(legacyStyles.darkThemeGrayLighter).lighten(0.3).hex();
export const inputPrefixBackground = legacyStyles.darkThemeGray;
export const inputDisabledOpacity = 0.5;
export const inputScorePasswordBackground = legacyStyles.darkThemeGrayDark;
export const inputModifierColor = color(legacyStyles.darkThemeGrayLighter).lighten(0.3).hex();
export const inputPlaceholderColor = color(legacyStyles.darkThemeGrayLighter).darken(0.1).hex();
