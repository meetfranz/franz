import React, { Component } from 'react';
import { sortableContainer, sortableElement, arrayMove, DragLayer } from 'react-sortable-multiple-hoc';

import ServiceItem from './ServiceItem';

const dragLayer = new DragLayer();

const SortableService = sortableElement(({item}) => {
  return (
    <ServiceItem
      key={item.id}
      service={item}
      // toggleAction={() => toggleService({ serviceId: service.id })}
      // goToServiceForm={() => goTo(`/settings/services/edit/${service.id}`)}
    />
  );
});

const SortableListServices = sortableContainer(({ items }) =>
  <div>
    {items.map((service, index) => (
      <SortableService
        key={index}
        index={index}
        item={service}
      />
    ))}
  </div>,
);

const SortableGroup = sortableElement(props => (props.item.group || null) &&
  <div>
    <div>
      <span style={{ marginLeft: '50px' }}>{props.item.group.name}</span>
    </div>
    <SortableListServices
      {...props} // onMultipleSortEnd
      items={props.item.services}
      dragLayer={dragLayer}
      distance={3}
      helperClass={'selected__service'}
      isMultiple
      helperCollision={{ top: 0, bottom: 0 }}
    />
  </div>,
);

const SortableListGroups = sortableContainer(({ items, onSortItemsEnd }) =>
  <div>
    {items.map((group, index) => (group &&
      <SortableGroup
        key={index}
        index={index}
        item={group}
        id={index}
        onMultipleSortEnd={onSortItemsEnd}
      />
    ))}
  </div>,
);

export default class SortableComponent extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    arrayMove(this.props.groups, oldIndex, newIndex);
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
    // console.time()
    console.log(newListIndex, newIndex, items)

    items.forEach((item, i) => {
      this.props.reorder({
        oldIndex: item.id,
        newIndex,
      });
    });
    // console.timeEnd()
  }

  render() {
    // console.log('RERENDER', this.props.groups)

    return (
      <div>
        <SortableListGroups
          items={this.props.groups}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected__group'}
        />
      </div>
    );
  }
}
