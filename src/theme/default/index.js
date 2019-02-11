import hexToRgba from 'hex-to-rgba';

import * as legacyStyles from './legacy';

export const brandPrimary = '#3498db';
export const brandSuccess = '#5cb85c';
export const brandInfo = '#5bc0de';
export const brandWarning = '#FF9F00';
export const brandDanger = '#d9534f';

export const borderRadius = legacyStyles.themeBorderRadius;
export const borderRadiusSmall = legacyStyles.themeBorderRadiusSmall;

export const colorBackground = legacyStyles.themeGrayLighter;
export const colorHeadline = legacyStyles.themeGrayDark;

export const colorText = legacyStyles.themeTextColor;

// Subscription Container Component
export const colorSubscriptionContainerBackground = 'none';
export const colorSubscriptionContainerBorder = [1, 'solid', brandPrimary];
export const colorSubscriptionContainerTitle = brandPrimary;
export const colorSubscriptionContainerActionButtonBackground = brandPrimary;
export const colorSubscriptionContainerActionButtonColor = '#FFF';

// Error Handler
export const colorWebviewErrorHandlerBackground = legacyStyles.themeGrayLighter;

// Loader
export const colorAppLoaderSpinner = '#FFF';
export const colorFullscreenLoaderSpinner = legacyStyles.themeGrayDark;
export const colorWebviewLoaderBackground = hexToRgba(legacyStyles.themeGrayLighter, 0.8);

// Modal
export const colorModalOverlayBackground = hexToRgba(legacyStyles.themeGrayLighter, 0.8);
