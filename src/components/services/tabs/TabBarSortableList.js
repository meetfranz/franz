import React from 'react';
import { observer } from 'mobx-react';
import { SortableContainer } from 'react-sortable-hoc';

import TabItem from './TabItem';
import { ctrlKey } from '../../../environment';

export default SortableContainer(observer(({
  services,
  setActive,
  reload,
  toggleNotifications,
  deleteService,
  disableService,
  openSettings,
}) => (
  <ul
    className="tabs"
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
        data-tip={`Add new service (${ctrlKey}+N)`}
      >
        <span className="mdi mdi-plus" />
      </button>
    </li>
  </ul>
)));
