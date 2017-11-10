import React, { Component } from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import { defineMessages, intlShape } from 'react-intl';

import TabItem from './TabItem';
import { ctrlKey } from '../../../environment';

const messages = defineMessages({
  addNewService: {
    id: 'sidebar.addNewService',
    defaultMessage: '!!!Add new service',
  },
});

@observer
class TabBarSortableList extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setActive: PropTypes.func.isRequired,
    setActiveNext: PropTypes.func.isRequired,
    setActivePrev: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    disableService: PropTypes.func.isRequired,
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      services,
      setActive,
      setActiveNext,
      setActivePrev,
      reload,
      toggleNotifications,
      deleteService,
      disableService,
      openSettings,
    } = this.props;

    const { intl } = this.context;

    return (
      <ul
        className="tabs"
        onWheel={e => (e.deltaY > 0 ? setActiveNext() : setActivePrev())}
      >
        {services.map((service, index) => (
          <TabItem
            key={service.id}
            clickHandler={() => setActive({ serviceId: service.id })}
            service={service}
            index={index}
            shortcutIndex={index + 1}
            reload={() => reload({ serviceId: service.id })}
            toggleNotifications={() => toggleNotifications({ serviceId: service.id })}
            deleteService={() => deleteService({ serviceId: service.id })}
            disableService={() => disableService({ serviceId: service.id })}
            openSettings={openSettings}
          />
        ))}
        <li>
          <button
            className="sidebar__add-service"
            onClick={() => openSettings({ path: 'recipes' })}
            data-tip={`${intl.formatMessage(messages.addNewService)} (${ctrlKey}+N)`}
          >
            <span className="mdi mdi-plus" />
          </button>
        </li>
      </ul>
    );
  }
}

export default SortableContainer(TabBarSortableList);
