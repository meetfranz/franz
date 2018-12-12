import hexToRgba from 'hex-to-rgba';

import * as legacyStyles from '../default/legacy';

export const colorBackground = legacyStyles.darkThemeGrayDarkest;
export const colorBackgroundSubscriptionContainer = legacyStyles.themeBrandInfo;

export const colorHeadline = legacyStyles.darkThemeTextColor;
export const colorText = legacyStyles.darkThemeTextColor;

// Loader
export const colorFullscreenLoaderSpinner = '#FFF';
export const colorWebviewLoaderBackground = hexToRgba(legacyStyles.darkThemeGrayDarkest, 0.5);
