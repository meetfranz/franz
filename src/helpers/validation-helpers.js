export function required({ field }) {
  const isValid = (field.value.trim() !== '');
  return [isValid, `${field.label} is required`];
}

export function email({ field }) {
  const value = field.value.trim();
  let isValid = false;

  if (value !== '') {
    isValid = Boolean(value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}/i));
  } else {
    isValid = true;
  }

  return [isValid, `${field.label} not valid`];
}

export function url({ field }) {
  const value = field.value.trim();
  let isValid = false;

  if (value !== '') {
    // eslint-disable-next-line
    isValid = Boolean(value.match(/(^|[\s.:;?\-\]<(])(https?:\/\/[-\w;/?:@&=+$|_.!~*|'()[\]%#,☺]+[\w/#](\(\))?)(?=$|[\s',|().:;?\-[\]>)])/i));
  } else {
    isValid = true;
  }

  return [isValid, `${field.label} is not a valid url`];
}

export function minLength(length) {
  return ({ field }) => {
    let isValid = true;
    if (field.touched) {
      isValid = field.value.length >= length;
    }
    return [isValid, `${field.label} should be at least ${length} characters long.`];
  };
}

export function oneRequired(targets) {
  return ({ field, form }) => {
    const invalidFields = targets.filter(target => form.$(target).value === '');
    return [targets.length !== invalidFields.length, `${field.label} is required`];
  };
}
