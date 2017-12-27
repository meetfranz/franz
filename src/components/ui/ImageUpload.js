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
  };

  static defaultProps = {
    className: null,
    multiple: false,
  };

  state = {
    path: null,
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach((file) => {
      this.setState({
        path: file.path,
      });
      this.props.field.onDrop(file);
    });
  }

  dropzoneRef = null;

  render() {
    const {
      field,
      className,
      multiple,
    } = this.props;

    const cssClasses = classnames({
      'franz-form__button': true,
      [`${className}`]: className,
    });

    return (
      <div>
        {field.label}
        {(field.value && field.value !== 'delete') || this.state.path ? (
          <div
            className="image-upload"
          >
            <div
              className="image-upload__preview"
              style={({
                backgroundImage: `url(${field.value || this.state.path})`,
              })}
            />
            <div className="image-upload__action">
              <button
                type="button"
                onClick={() => {
                  if (field.value) {
                    field.value = 'delete';
                  } else {
                    this.setState({
                      path: null,
                    });
                  }
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
