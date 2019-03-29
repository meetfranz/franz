import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';

export default
@observer
class ImageUpload extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    multiple: PropTypes.bool,
    textDelete: PropTypes.string.isRequired,
    textUpload: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: null,
    multiple: false,
  };

  state = {
    path: null,
  };

  dropzoneRef = null;

  onDrop = (acceptedFiles) => {
    const { field } = this.props;

    acceptedFiles.forEach((file) => {
      this.setState({
        path: file.path,
      });
      this.props.field.onDrop(file);
    });

    field.set('');
  };

  render() {
    const {
      field, className, multiple, textDelete, textUpload,
    } = this.props;

    const { path } = this.state;

    const cssClasses = classnames({
      'image-upload__dropzone': true,
      [`${className}`]: className,
    });

    return (
      <div className="image-upload-wrapper">
        <label className="franz-form__label" htmlFor="iconUpload">
          {field.label}
        </label>
        <div className="image-upload">
          {(field.value && field.value !== 'delete') || path ? (
            <Fragment>
              <div
                className="image-upload__preview"
                style={{
                  backgroundImage: `url("${path || field.value}")`,
                }}
              />
              <div className="image-upload__action">
                <button
                  type="button"
                  onClick={() => {
                    if (field.value) {
                      field.set('delete');
                    } else {
                      this.setState({
                        path: null,
                      });
                    }
                  }}
                >
                  <i className="mdi mdi-delete" />
                  <p>{textDelete}</p>
                </button>
                <div className="image-upload__action-background" />
              </div>
            </Fragment>
          ) : (
            <Dropzone
              ref={(node) => {
                this.dropzoneRef = node;
              }}
              onDrop={this.onDrop}
              multiple={multiple}
              accept="image/jpeg, image/png"
            >
              {({ getRootProps, getInputProps }) => (
                <div className={cssClasses} {...getRootProps()}>
                  <i className="mdi mdi-file-image" />
                  <p>{textUpload}</p>
                  <input {...getInputProps()} />
                </div>
              )}
            </Dropzone>
          )}
        </div>
      </div>
    );
  }
}
