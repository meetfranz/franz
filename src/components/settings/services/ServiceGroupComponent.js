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
  constructor(props) {
    super(props);
    this.dataChanged = this.dataChanged.bind(this);
    this.state = {
      editing: false,
      title: props.item.group.name,
    };
  }

  dataChanged(data) {
    const value = data[`group-header-${this.props.id}`];
    this.props.updateServiceGroup(this.props.item.group.id, value);
    this.setState({
      editing: false,
      title: value,
    });
  }

  render() {
    const {
      item,
      id,
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
              change={this.dataChanged}
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
        {item.type === 'group' && item.group.services.length === 0 &&
          <div>
            <span className="mdi mdi-cursor-move">{intl.formatMessage(messages.groupPlaceholder)}</span>
          </div>
        }
      </div>;
  }
}