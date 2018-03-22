import React, { Component } from 'react';
import { sortableHandle } from 'react-sortable-multiple-hoc';

const DragHandle = sortableHandle(props => <span>{props.title}</span>);

export default class TabGroupComponent extends Component {
  state = {
    collapsed: false,
  };

  render() {
    const {
      item,
      services,
      sorting
    } = this.props;

    return (item.group || null) &&
      <div className={item.type === 'group' ? 'services__group' : ''}>
        {item.type === 'group' &&
          <div className="services__group-header">
            <span
              className={this.state.collapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-down'}
              onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            />
            <DragHandle title={item.group.name} />
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
