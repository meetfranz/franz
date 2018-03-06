import React, { Component } from 'react';

import ServiceItem from './ServiceItem';
import { sortableContainer, sortableElement, arrayMove, DragLayer } from 'react-sortable-multiple-hoc';
// import './SortableComponent.css';
// console.log(sortableContainer)

const dragLayer = new DragLayer();

const SortableService = sortableElement(({item}) => {
  return (
    // <div
    //   onClick={props.onSelect}
    //   className={props.className}
    // >
    //   <span style={{ display: 'inline-block', width: '50px' }}>{props.item.order}</span>
    //   {props.item.service}
    // </div>
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

const SortableGroup = sortableElement(props =>
  <div>
    <div>
      <span style={{ marginLeft: '50px' }}>{props.item.name}</span>
    </div>
    <SortableListServices
      {...props} // onMultipleSortEnd
      items={props.item.items}
      dragLayer={dragLayer}
      distance={3}
      helperClass={'selected__service'}
      isMultiple
      helperCollision={{ top: 0, bottom: 0 }}
    />
  </div>,
);

const SortableListGroups = sortableContainer(({ items, onSortItemsEnd }) =>
  <div> {/*style={{ height: '76px', overflow: 'auto' }}>*/}
    {items.map((group, index) => (
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
  constructor(props) {
    super(props);

    console.log(props.items)

    this.state = {
      groups: [
        {
          name: 'Private',
          items: props.items,
        },
        // {
        //   name: 'Job',
        //   items: [
        //     {
        //       name: 'Slack',
        //     },
        //     {
        //       name: 'Github',
        //     }
        //   ],
        // },
      ],
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      groups: arrayMove(this.state.groups, oldIndex, newIndex),
    });
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
    console.time()
    // console.log(newListIndex, newIndex, items)
    const parts = this.state.groups.slice();
    const itemsValue = [];

    items.forEach((item) => {
      itemsValue.push(parts[item.listId].items[item.id]);
    });
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];

      parts[item.listId].items.splice(item.id, 1);
    }
    parts[newListIndex].items.splice(newIndex, 0, ...itemsValue);
    console.timeEnd()
    this.setState({
      groups: parts,
    });
  }

  render() {
    const groups = this.state.groups.map((group, index) => {
      return {
        name: group.name,
        items: group.items.map((service, order) => {
          return {
            service: service.name,
            order: (index + 1) + '.' + (order + 1),
          };
        }),
      };
    });

    return (
      <div>
        <SortableListGroups
          items={this.state.groups}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected__group'}
        />
      </div>
    );
  }
}
