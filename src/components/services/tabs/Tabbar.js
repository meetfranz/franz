import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

import TabBarSortableList from './TabBarSortableList';

@observer
export default class TabBar extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setActive: PropTypes.func.isRequired,
    setActiveNext: PropTypes.func.isRequired,
    setActivePrev: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    enableToolTip: PropTypes.func.isRequired,
    disableToolTip: PropTypes.func.isRequired,
    reorder: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const {
      enableToolTip,
      reorder,
    } = this.props;

    enableToolTip();
    reorder({ oldIndex, newIndex });
  };

  disableService = ({ serviceId }) => {
    const { updateService } = this.props;

    if (serviceId) {
      updateService({
        serviceId,
        serviceData: {
          isEnabled: false,
        },
        redirect: false,
      });
    }
  }

  render() {
    const {
      services,
      setActive,
      setActiveNext,
      setActivePrev,
      openSettings,
      disableToolTip,
      reload,
      toggleNotifications,
      deleteService,
    } = this.props;

    return (
      <div>
        <TabBarSortableList
          services={services}
          setActive={setActive}
          setActiveNext={setActiveNext}
          setActivePrev={setActivePrev}
          onSortEnd={this.onSortEnd}
          onSortStart={disableToolTip}
          reload={reload}
          toggleNotifications={toggleNotifications}
          deleteService={deleteService}
          disableService={this.disableService}
          openSettings={openSettings}
          distance={20}
          axis="y"
          lockAxis="y"
          helperClass="is-reordering"
        />
      </div>
    );
  }
}
