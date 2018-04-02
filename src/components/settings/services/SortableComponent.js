import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortableContainer, sortableElement, arrayMove, DragLayer } from 'react-sortable-multiple-hoc';
import { intlShape } from 'react-intl';

import ServiceGroup from '../../../models/ServiceGroup';

const dragLayer = new DragLayer();

const SortableService = sortableElement((props) => {// props are undefined during drag except for item
  // console.log(props)
  return props.serviceItem(props);
  // <div key={item.id}>{item.name}</div>
},
);

const SortableListServices = sortableContainer((props) => {
  // console.log(props);
  return (<div>
    {props.items.map((service, index) => (
      <SortableService
        {...props}
        key={service.id}
        index={index}
        item={service}
        // goTo={goTo}
        useDragHandle={props.useDragHandleProp}
      />
    ))}
  </div>);
});

const SortableGroup = sortableElement(props =>
  <props.groupComponent
    {...props}
    item={props.item}
    services={
      <SortableListServices
        {...props} // onMultipleSortEnd
        items={props.item.services}
        dragLayer={dragLayer}
        distance={props.distanceProp}
        helperClass={'selected__service'}
        isMultiple
        helperCollision={{ top: 0, bottom: 0 }}
        lockAxis="y"
        useDragHandle={props.useDragHandleProp}
        // onSortStart={props.onSortItemsStart}
      />
    }
    sorting={props.sorting}
  />,
);

const SortableListGroups = sortableContainer((props) => {
  return (<div className="sortable__tabbar__groups">
    {props.items.map((group, index) => (group &&
      <SortableGroup
        {...props}
        key={group.group.id}
        index={index}
        item={group}
        id={index}
        onMultipleSortEnd={props.onSortItemsEnd}
        onDeleteGroup={props.onDeleteGroup}
        updateServiceGroup={props.updateServiceGroup}
        deleteServiceGroup={props.deleteServiceGroup}
        shouldCancelStart={props.shouldCancelStartProp}
        useDragHandle={props.useDragHandleProp}
        intl={props.intl}
      />),
    )}
  </div>);
});

export default class SortableComponent extends Component {
  static propTypes = {
    reorder: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    // shouldCancelStart: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    sorting: false,
  };

  onSortStart = () => {
    this.setState({ sorting: true });

    if (typeof this.props.onSortStart === 'function') {
      this.props.onSortStart();
    }

  }

  onDeleteGroup = (index) => {
    const structure = this.props.groups;
    const group = structure[index];
    structure.splice(index, 1);
    group.services.forEach((s, i) => {
      const service = s;

      service.groupId = '';
      structure.splice(index + i, 0, {
        type: 'root',
        group: new ServiceGroup({ name: 'Uncat' }),
        services: [service],
      });
    });
    this.props.deleteServiceGroup(group.group.id);
    this.props.reorder({ structure });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ sorting: false });
    this.props.reorder({ structure: arrayMove(this.props.groups, oldIndex, newIndex) });

    if (typeof this.props.onSortEnd === 'function') {
      this.props.onSortEnd();
    }
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
    // console.time('onSortItemsEnd')
    // console.log(newListIndex, newIndex, items)
    const structure = this.props.groups;

    items.forEach((item) => {
      const oldListIndex = item.listId;
      const oldIndex = item.id;

      if (oldListIndex === newListIndex && oldIndex === newIndex) {
        return;
      }

      const source = structure[oldListIndex];
      const destination = structure[newListIndex];

      const service = source.services[oldIndex];
      source.services.splice(oldIndex, 1); // remove service from source group
      if (source.type === 'root') {
        structure.splice(oldListIndex, 1);
      }

      switch (destination.type) {
        case 'root':
          service.groupId = '';
          structure.splice(newIndex > 0 ? newListIndex + (source.type === 'root' ? 0 : 1) : newListIndex, 0, {
            type: 'root',
            group: new ServiceGroup({ name: 'Uncat' }),
            services: [service],
          });
          break;
        case 'group':
          service.groupId = destination.group.id;
          destination.services.splice(newIndex, 0, service);
          break;
        default:
      }
    });

    // reorder data model
    this.props.reorder({ structure });
    // console.timeEnd('onSortItemsEnd')

    if (typeof this.props.onSortItemsEnd === 'function') {
      this.props.onSortItemsEnd();
    }
  }

  render() {
    // console.log('RERENDER', this.props.groups)
    const { intl } = this.context;

    return (
      <div className="sortable__tabbar">
        <SortableListGroups
          {...this.props}
          items={this.props.groups}
          onSortStart={this.onSortStart}
          sorting={this.state.sorting}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected__group'}
          lockAxis="y"
          distance={0}
          distanceProp={this.props.distance}
          onDeleteGroup={this.onDeleteGroup}
          updateServiceGroup={this.props.updateServiceGroup}
          deleteServiceGroup={this.props.deleteServiceGroup}
          shouldCancelStartProp={this.props.shouldCancelStart}
          useDragHandle={this.props.useDragHandleGroup}
          useDragHandleProp={this.props.useDragHandle}
          intl={intl}
          serviceItem={this.props.serviceItem}
          groupComponent={this.props.groupComponent}
        />
      </div>
    );
  }
}
