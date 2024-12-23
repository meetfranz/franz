import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import Dropzone from 'react-dropzone';

export default @observer class ImageUpload extends Component {
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
    image: null,
  }

  dropzoneRef = null;

  onDrop(acceptedFiles) {
    const { field } = this.props;

    acceptedFiles.forEach((file) => {
      if (file) {
        const reader = new FileReader();

        // When the file reader is done, this function runs
        reader.onloadend = () => {
          const base64Data = reader.result;

          this.setState({
            image: base64Data,
          });
        };

        reader.readAsDataURL(file);
      }

      this.props.field.onDrop(file);
    });

    field.set('');
  }

  render() {
    const {
      field,
      className,
      multiple,
      textDelete,
      textUpload,
    } = this.props;

    const cssClasses = classnames({
      'image-upload__dropzone': true,
      [`${className}`]: className,
    });

    return (
      <div className="image-upload-wrapper">
        <label className="franz-form__label" htmlFor="iconUpload">{field.label}</label>
        <div className="image-upload">
          {(field.value && field.value !== 'delete') || this.state.image ? (
            <Fragment>
              <div
                className="image-upload__preview"
                style={({
                  backgroundImage: `url("${this.state.image || field.value}")`,
                })}
              />
              <div className="image-upload__action">
                <button
                  type="button"
                  onClick={() => {
                    if (field.value) {
                      field.set('delete');
                    } else {
                      this.setState({
                        image: null,
                      });
                    }
                  }}
                >
                  <i className="mdi mdi-delete" />
                  <p>
                    {textDelete}
                  </p>
                </button>
                <div className="image-upload__action-background" />
              </div>
            </Fragment>
          ) : (
            <Dropzone
              ref={(node) => { this.dropzoneRef = node; }}
              onDrop={this.onDrop.bind(this)}
              className={cssClasses}
              multiple={multiple}
              accept="image/jpeg, image/png"
            >
              <i className="mdi mdi-file-image" />
              <p>
                {textUpload}
              </p>
            </Dropzone>
          )}
        </div>
      </div>
    );
  }
}
