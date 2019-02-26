import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Toggle } from '@meetfranz/forms';

import Service from '../../../models/Service';

const styles = () => ({
  service: {
    height: 'auto',
    display: 'flex',
  },
  name: {
    marginTop: '4px',
  },
});

@injectSheet(styles) @observer
class ServiceListItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isInWorkspace: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    service: PropTypes.instanceOf(Service).isRequired,
  };

  render() {
    const {
      classes,
      isInWorkspace,
      onToggle,
      service,
    } = this.props;

    return (
      <div className={classes.service}>
        <Toggle
          checked={isInWorkspace}
          onChange={onToggle}
          label={service.name}
        />
      </div>
    );
  }
}

export default ServiceListItem;
