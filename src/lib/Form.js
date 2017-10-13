import Form from 'mobx-react-form';

export default class DefaultForm extends Form {
  bindings() {
    return {
      default: {
        id: 'id',
        name: 'name',
        type: 'type',
        value: 'value',
        label: 'label',
        placeholder: 'placeholder',
        disabled: 'disabled',
        onChange: 'onChange',
        onFocus: 'onFocus',
        onBlur: 'onBlur',
        error: 'error',
      },
    };
  }

  options() {
    return {
      validateOnInit: false,
      // validateOnBlur: true,
      // // validationDebounceWait: {
      // //   trailing: true,
      // // },
    };
  }
}
