import color from 'color';

import * as legacyStyles from '../legacy';

export const brandPrimary = '#3498db';
export const brandSuccess = '#5cb85c';
export const brandInfo = '#5bc0de';
export const brandWarning = '#FF9F00';
export const brandDanger = '#d9534f';

export const uiFontSize = 14;

export const borderRadius = legacyStyles.themeBorderRadius;
export const borderRadiusSmall = legacyStyles.themeBorderRadiusSmall;

export const colorBackground = legacyStyles.themeGrayLighter;
export const colorContentBackground = '#FFFFFF';
export const colorHeadline = legacyStyles.themeGrayDark;

export const colorText = legacyStyles.themeTextColor;

// Subscription Container Component
export const colorSubscriptionContainerBackground = 'none';
export const colorSubscriptionContainerBorder = `1px solid ${brandPrimary}`;
export const colorSubscriptionContainerTitle = brandPrimary;
export const colorSubscriptionContainerActionButtonBackground = brandPrimary;
export const colorSubscriptionContainerActionButtonColor = '#FFF';

// Loader
export const colorAppLoaderSpinner = '#FFF';
export const colorFullscreenLoaderSpinner = legacyStyles.themeGrayDark;
export const colorWebviewLoaderBackground = color(legacyStyles.themeGrayLighter).alpha(0.8).rgb().string();

// Input
export const labelColor = legacyStyles.themeGrayLight;
export const inputColor = legacyStyles.themeGray;
export const inputHeight = '35px';
export const inputBackground = legacyStyles.themeGrayLightest;
export const inputBorder = `1px solid ${legacyStyles.themeGrayLighter}`;
export const inputModifierColor = legacyStyles.themeGrayLight;
export const inputPlaceholderColor = color(legacyStyles.themeGrayLight).lighten(0.3).hex();
export const inputPrefixColor = legacyStyles.themeGrayLight;
export const inputPrefixBackground = legacyStyles.themeGrayLighter;
export const inputDisabledOpacity = 0.5;
export const inputScorePasswordBackground = legacyStyles.themeGrayLighter;

// Toggle
export const toggleBackground = legacyStyles.themeGrayLighter;
export const toggleButton = legacyStyles.themeGrayLight;
export const toggleButtonActive = brandPrimary;
export const toggleWidth = 40;
export const toggleHeight = 14;

// Button
export const buttonPrimaryBackground = brandPrimary;
export const buttonPrimaryTextColor = '#FFF';

export const buttonSecondaryBackground = legacyStyles.themeGrayLighter;
export const buttonSecondaryTextColor = legacyStyles.themeGray;

export const buttonDangerBackground = brandDanger;
export const buttonDangerTextColor = '#FFF';

export const buttonWarningBackground = brandWarning;
export const buttonWarningTextColor = '#FFF';

export const buttonInvertedBackground = 'none';
export const buttonInvertedTextColor = brandPrimary;
export const buttonInvertedBorder = `1px solid ${brandPrimary}`;

export const buttonLoaderColor = {
  primary: '#FFF',
  secondary: buttonSecondaryTextColor,
  warning: '#FFF',
  danger: '#FFF',
  inverted: brandPrimary,
};
