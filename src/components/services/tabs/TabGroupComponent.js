import React, { Component } from 'react';
import { sortableHandle } from 'react-sortable-multiple-hoc';

const DragHandle = sortableHandle(props => <span>{props.title}</span>);

export default class TabGroupComponent extends Component {
  state = {
    open: true,
  };

  render() {
    const {
      item,
      services,
      sorting
    } = this.props;
// console.log(sorting)
    return (item.group || null) &&
      <div className={item.type === 'group' ? 'services__group' : ''}>
        {item.type === 'group' &&
          <div className="services__group-header">
            <span
              className={this.state.open ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-right'}
              onClick={() => this.setState({ open: !this.state.open })}
            />
            <DragHandle title={item.group.name} />
          </div>
        }
        {this.state.open && services}
      </div>;
  }
}
