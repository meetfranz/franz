import React, { Component } from 'react';
import { sortableHandle } from 'react-sortable-multiple-hoc';
import { observer } from 'mobx-react';

const DragHandle = sortableHandle(props => <span>{props.title}</span>);

@observer
export default class TabGroupComponent extends Component {
  state = {
    collapsed: false,
  };

  render() {
    const {
      item,
      services,
      sorting,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

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

    return (item.group || null) &&
      <div className={item.type === 'group' ? 'services__group' : ''}>
        {item.type === 'group' &&
          <div className="services__group-header">
            <span
              className={this.state.collapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-down'}
              onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            />
            <DragHandle title={item.group.name} />
            {this.state.collapsed && <span>{notificationBadge}</span>}
          </div>
        }
        <div
          className="services__group-services"
          // style={this.state.collapsed ? { height: 0, overflow: 'hidden' } : { height: 'auto', overflow: 'auto' }}
          style={this.state.collapsed ? { display: 'none' } : { display: 'block' }}
        >
          {services}
        </div>
      </div>;
  }
}
