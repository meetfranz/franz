import React, { Component } from 'react';
import InlineEdit from 'react-edit-inline';
import { sortableHandle } from 'react-sortable-multiple-hoc';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  groupPlaceholder: {
    id: 'settings.services.groupPlaceholder',
    defaultMessage: '!!!Drag Service here',
  },
});

const DragHandle = sortableHandle(() => <span className="mdi mdi-menu" />);

export default class ServiceGroupComponent extends Component {
  state = {
    editing: false,
  };

  render() {
    const {
      item,
      id,
      updateServiceGroup,
      onDeleteGroup,
      services,
      intl
    } = this.props;

    return (item.group || null) &&
      <div className={item.type === 'group' ? 'services__group' : ''}>
        {item.type === 'group' &&
          <div className="services__group-header">
            <DragHandle />
            <InlineEdit
              text={item.group.name}
              paramName={`group-header-${id}`}
              change={(param) => { updateServiceGroup(item.group.id, param[`group-header-${id}`]); }}
              editing={this.state.editing}
            />
            <span
              onClick={() => this.setState({ editing: !this.state.editing })}
              className="mdi mdi-pencil"
            />
            <span
              onClick={() => onDeleteGroup(id)}
              className="mdi mdi-delete"
            />

          </div>
        }
        {services}
        {item.type === 'group' &&
          <div>
            <span className="mdi mdi-cursor-move">{intl.formatMessage(messages.groupPlaceholder)}</span>
          </div>
        }
      </div>;
  }
}