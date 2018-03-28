import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';

import SortableComponent from '../../settings/services/SortableComponent';
import TabItem from './TabItem';
import TabGroupComponent from './TabGroupComponent';

import { sleep } from '../../../helpers/async-helpers';

const tabItem = ({
  item: service,
  index,
  setActive,
  reload,
  toggleNotifications,
  toggleAudio,
  deleteService,
  disableService,
  enableService,
  openSettings,
  showMessageBadgeWhenMutedSetting,
  showMessageBadgesEvenWhenMuted,
  serviceOrder,
}) =>
  <TabItem
    key={service.id}
    clickHandler={() => setActive({ serviceId: service.id })}
    service={service}
    index={index}
    shortcutIndex={index + 1}
    reload={() => reload({ serviceId: service.id })}
    toggleNotifications={() => toggleNotifications({ serviceId: service.id })}
    toggleAudio={() => toggleAudio({ serviceId: service.id })}
    deleteService={() => deleteService({ serviceId: service.id })}
    disableService={() => disableService({ serviceId: service.id })}
    enableService={() => enableService({ serviceId: service.id })}
    openSettings={openSettings}
    showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
    showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
    serviceOrder={serviceOrder}
  />;

@inject('stores', 'actions') @observer // TODO: move to container
export default class TabBar extends Component {
  static propTypes = {
    setActive: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    enableToolTip: PropTypes.func.isRequired,
    disableToolTip: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
    showMessageBadgeWhenMutedSetting: PropTypes.bool.isRequired,
    showMessageBadgesEvenWhenMuted: PropTypes.bool.isRequired,
  }

  toggleService = ({ serviceId, isEnabled }) => {
    const { updateService } = this.props;

    if (serviceId) {
      updateService({
        serviceId,
        serviceData: {
          isEnabled,
        },
        redirect: false,
      });
    }
  }

  disableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: false });
  }

  enableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: true });
  }

  toggleServiceGroup = ({ serviceGroupId, isEnabled }) => {
    const { updateServiceGroup } = this.props;

    if (serviceGroupId) {
      updateServiceGroup({
        serviceGroupId,
        serviceGroupData: {
          isEnabled,
        },
        redirect: false,
      });
    }
  }

  disableServiceGroup({ serviceGroupId }) {
    this.toggleServiceGroup({ serviceGroupId, isEnabled: false });
  }

  enableServiceGroup({ serviceGroupId }) {
    this.toggleServiceGroup({ serviceGroupId, isEnabled: true });
  }

  render() {
    const {
      groups,
      setActive,
      openSettings,
      disableToolTip,
      enableToolTip,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

    return (
      <div>
        {<SortableComponent
          {...this.props}
          groups={groups}
          reorder={this.props.actions.ui.reorderServiceStructure}
          distance={1}
          serviceItem={tabItem}
          groupComponent={TabGroupComponent}
          useDragHandleGroup

          setActive={setActive}
          onSortEnd={enableToolTip}
          onSortStart={disableToolTip}
          onSortItemsEnd={enableToolTip}
          onSortItemsStart={disableToolTip}
          reload={reload}
          toggleNotifications={toggleNotifications}
          toggleAudio={toggleAudio}
          deleteService={deleteService}
          disableService={args => this.disableService(args)}
          enableService={args => this.enableService(args)}
          disableServiceGroup={args => this.disableServiceGroup(args)}
          enableServiceGroup={args => this.enableServiceGroup(args)}
          openSettings={openSettings}
          showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
          showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
          serviceOrder={this.props.stores.ui.serviceOrder}
        />}
      </div>
    );
  }
}
