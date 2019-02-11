import hexToRgba from 'hex-to-rgba';

import * as legacyStyles from '../default/legacy';

export const colorBackground = legacyStyles.darkThemeGrayDarkest;
export const colorBackgroundSubscriptionContainer = legacyStyles.themeBrandInfo;

export const colorHeadline = legacyStyles.darkThemeTextColor;
export const colorText = legacyStyles.darkThemeTextColor;

// Error Handler
export const colorWebviewErrorHandlerBackground = legacyStyles.darkThemeGrayDarkest;

// Loader
export const colorFullscreenLoaderSpinner = '#FFF';
export const colorWebviewLoaderBackground = hexToRgba(legacyStyles.darkThemeGrayDarkest, 0.5);

// Modal
export const colorModalOverlayBackground = hexToRgba(legacyStyles.darkThemeGrayDarkest, 0.8);
