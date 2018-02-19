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
      validateOnInit: false, // default: true
      // validateOnBlur: true, // default: true
      // validateOnChange: true // default: false
      // // validationDebounceWait: {
      // //   trailing: true,
      // // },
    };
  }
}
