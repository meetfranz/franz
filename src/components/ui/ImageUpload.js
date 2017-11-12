import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
// import Loader from 'react-loader';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';

@observer
export default class ImageUpload extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    multiple: PropTypes.bool,
    // disabled: PropTypes.bool,
    // onClick: PropTypes.func,
    // type: PropTypes.string,
    // buttonType: PropTypes.string,
    // loaded: PropTypes.bool,
    // htmlForm: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    multiple: false,
    // disabled: false,
    // onClick: () => {},
    // type: 'button',
    // buttonType: '',
    // loaded: true,
    // htmlForm: '',
  };

  dropzoneRef = null;

  state = {
    path: null,
  }

  onDrop(acceptedFiles) {
    // const req = request.post('/upload');
    acceptedFiles.forEach((file) => {
      console.log(file);
      this.setState({
        path: file.path,
      });
      // req.attach(file.name, file);
    });
    // req.end(callback);
  }

  render() {
    const {
      field,
      className,
      multiple,
      // disabled,
      // onClick,
      // type,
      // buttonType,
      // loaded,
      // htmlForm,
    } = this.props;

    const cssClasses = classnames({
      'franz-form__button': true,
      // [`franz-form__button--${buttonType}`]: buttonType,
      [`${className}`]: className,
    });

    return (
      <div>
        {field.label}
        {this.state.path ? (
          <div
            className="image-upload"
          >
            <div
              className="image-upload__preview"
              style={({
                backgroundImage: `url(${this.state.path})`,
              })}
            />
            <div className="image-upload__action">
              <button
                type="button"
                onClick={() => {
                  this.setState({
                    path: null,
                  });
                }}
              >
                remove icon

              </button>
              <div className="image-upload__action-background" />
            </div>
          </div>
        ) : (
          <Dropzone
            ref={(node) => { this.dropzoneRef = node; }}
            onDrop={this.onDrop.bind(this)}
            className={cssClasses}
            multiple={multiple}
            accept="image/jpeg, image/png"
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        )}
      </div>
    );
  }
}
