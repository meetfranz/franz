import { remote } from 'electron';
import React, { Component } from 'react';
import { sortableHandle } from 'react-sortable-multiple-hoc';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';  

const { Menu } = remote;

const DragHandle = sortableHandle(props => <span>{props.title}</span>);

const messages = defineMessages({
  disableGroup: {
    id: 'tabs.group.disable',
    defaultMessage: '!!!Disable Group',
  },
  enableGroup: {
    id: 'tabs.group.enable',
    defaultMessage: '!!!Enable Group',
  },
});

@observer
export default class TabGroupComponent extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  state = {
    collapsed: false,
  };

  componentWillMount() {

  }

  render() {
    const {
      item,
      services,
      sorting,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
      disableServiceGroup,
      enableServiceGroup,
      collapsedState,
      updateCollapsedState,
    } = this.props;
    const { intl } = this.context;

    const menuTemplate = [{
      label: intl.formatMessage(item.group.isEnabled ? messages.disableGroup : messages.enableGroup),
      click: () => (item.group.isEnabled ?
        disableServiceGroup({ serviceGroupId: item.group.id }) :
        enableServiceGroup({ serviceGroupId: item.group.id })),
    }];
    const menu = Menu.buildFromTemplate(menuTemplate);


    let notificationBadge = null;
    if (showMessageBadgeWhenMutedSetting && showMessageBadgesEvenWhenMuted) {
      notificationBadge = (
        <span>
          {item.group.unreadDirectMessageCount > 0 && (
            <span className="tab-item__message-count">
              {item.group.unreadDirectMessageCount}
            </span>
          )}
          {item.group.unreadIndirectMessageCount > 0
            && item.group.unreadDirectMessageCount === 0
            && // service.isIndirectMessageBadgeEnabled && // TODO: loop through group services beforehand
            <span className="tab-item__message-count is-indirect">•</span>
          }
        </span>
      );
    }

    const collapsed = collapsedState.includes(item.group.id);

    return (item.group || null) &&
      <div className={item.type === 'group' ? 'services__group' : ''}>
        {item.type === 'group' &&
          <div
            className="services__group-header"
            onContextMenu={() => menu.popup(remote.getCurrentWindow())}
          >
            <span
              className={collapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-down'}
              onClick={() => updateCollapsedState(item.group.id, !collapsed)}
            />
            <DragHandle title={item.group.name} />
            {collapsed && <span>{notificationBadge}</span>}
          </div>
        }
        <div
          className="services__group-services"
          // style={this.state.collapsed ? { height: 0, overflow: 'hidden' } : { height: 'auto', overflow: 'auto' }}
          style={collapsed ? { display: 'none' } : { display: 'block' }}
        >
          {services}
        </div>
      </div>;
  }
}
