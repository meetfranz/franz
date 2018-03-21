import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react';

import SortableComponent from '../../settings/services/SortableComponent';
import TabItem from './TabItem';
import TabGroupComponent from './TabGroupComponent';
// import TabBarSortableList from './TabBarSortableList';

const tabItem = ({
  item: service,
  index,
  setActive,
  reload,
  toggleNotifications,
  toggleAudio,
  deleteService,
  openSettings,
  showMessageBadgeWhenMutedSetting,
  showMessageBadgesEvenWhenMuted,
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
    disableService={() => this.disableService({ serviceId: service.id })}
    enableService={() => this.enableService({ serviceId: service.id })}
    openSettings={openSettings}
    showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
    showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
  />;

const groupComponent = TabGroupComponent;


@inject('stores', 'actions') @observer // TODO: move to container
export default class TabBar extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setActive: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    enableToolTip: PropTypes.func.isRequired,
    disableToolTip: PropTypes.func.isRequired,
    reorder: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
    showMessageBadgeWhenMutedSetting: PropTypes.bool.isRequired,
    showMessageBadgesEvenWhenMuted: PropTypes.bool.isRequired,
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const {
      enableToolTip,
      reorder,
    } = this.props;

    enableToolTip();
    reorder({ oldIndex, newIndex });
  };

  shouldPreventSorting = event => event.target.tagName !== 'LI';

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

  render() {
    const {
      groups,
      services,
      setActive,
      openSettings,
      disableToolTip,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

    return (
      <div>
        {/* <TabBarSortableList
          groups={groups}
          services={services}
          setActive={setActive}
          onSortEnd={this.onSortEnd}
          onSortStart={disableToolTip}
          shouldCancelStart={this.shouldPreventSorting}
          reload={reload}
          toggleNotifications={toggleNotifications}
          toggleAudio={toggleAudio}
          deleteService={deleteService}
          disableService={args => this.disableService(args)}
          enableService={args => this.enableService(args)}
          openSettings={openSettings}
          distance={20}
          axis="y"
          lockAxis="y"
          helperClass="is-reordering"
          showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
          showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
        /> */}
        <SortableComponent
          {...this.props}
          groups={groups}
          reorder={this.props.actions.ui.reorderServiceStructure}
          distance={1}
          // updateServiceGroup={updateServiceGroup}
          // deleteServiceGroup={deleteServiceGroup}
          // goTo={goTo}
          // shouldCancelStart={() => searchNeedle !== null && searchNeedle !== ''}
          serviceItem={tabItem}
          groupComponent={groupComponent}
          useDragHandleGroup
        />
      </div>
    );
  }
}
