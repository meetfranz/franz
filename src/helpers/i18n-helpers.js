export function getLocale({
  locale, locales, defaultLocale, fallbackLocale,
}) {
  let localeStr = locale;
  if (locales[locale] === undefined) {
    let localeFuzzy;
    Object.keys(locales).forEach((localStr) => {
      if (locales && Object.hasOwnProperty.call(locales, localStr)) {
        if (locale.substring(0, 2) === localStr.substring(0, 2)) {
          localeFuzzy = localStr;
        }
      }
    });

    if (localeFuzzy !== undefined) {
      localeStr = localeFuzzy;
    }
  }

  if (locales[localeStr] === undefined) {
    localeStr = defaultLocale;
  }

  if (!localeStr) {
    localeStr = fallbackLocale;
  }

  return localeStr;
}

export function getSelectOptions({ locales, resetToDefaultText = '' }) {
  let options = [];

  if (resetToDefaultText) {
    options = [
      {
        value: '',
        label: resetToDefaultText,
      }, {
        value: '───',
        label: '───',
        disabled: true,
      },
    ];
  }

  Object.keys(locales).sort(Intl.Collator().compare).forEach((key) => {
    options.push({
      value: key,
      label: locales[key],
    });
  });

  return options;
}
