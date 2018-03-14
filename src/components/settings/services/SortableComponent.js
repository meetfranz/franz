import React, { Component } from 'react';
import { sortableContainer, sortableElement, arrayMove, DragLayer } from 'react-sortable-multiple-hoc';
import InlineEdit from 'react-edit-inline';

import ServiceGroup from '../../../models/ServiceGroup';

import ServiceItem from './ServiceItem';
import EditInPlace from '../../ui/EditInPlace';

const dragLayer = new DragLayer();

const SortableService = sortableElement(({item}) => {
  // console.log(item.id)
  return (
    <table className="service-table">
      <tbody>
        <ServiceItem
          key={item.id}
          service={item}
          // toggleAction={() => toggleService({ serviceId: service.id })}
          // goToServiceForm={() => goTo(`/settings/services/edit/${service.id}`)}
        />
      </tbody>
    </table>
    // <div key={item.id}>{item.name}</div>
  );
});

const SortableListServices = sortableContainer(({ items }) =>
  <div>
    {items.map((service, index) => (
      <SortableService
        key={service.id}
        index={index}
        item={service}
      />
    ))}
  </div>,
);

const SortableGroup = sortableElement(props => (props.item.group || null) &&
  <div className={props.item.type === 'group' ? 'services__group' : ''}>
    {props.item.type === 'group' &&
      <div className="services__group-header">
        <InlineEdit
          text={props.item.group.name}
          paramName={`group-header-${props.index}`}
          change={(param) => { props.updateServiceGroup(props.item.group.id, param[`group-header-${props.index}`]); 
          console.log(props.item.group.name)}}
        />
        <span
          onClick={() => props.onDeleteGroup(props.index)}
          className="mdi mdi-delete"
        />

      </div>
    }
    <SortableListServices
      {...props} // onMultipleSortEnd
      items={props.item.services}
      dragLayer={dragLayer}
      distance={3}
      helperClass={'selected__service'}
      isMultiple
      helperCollision={{ top: 0, bottom: 0 }}
      lockAxis="y"
    />
  </div>,
);

const SortableListGroups = sortableContainer(({ items, onSortItemsEnd, onDeleteGroup, updateServiceGroup, deleteServiceGroup }) => {
  return (
    <div>
      {items.map((group, index) => (group &&
        <SortableGroup
          key={'group-' + index}
          index={index}
          item={group}
          id={index}
          onMultipleSortEnd={onSortItemsEnd}
          onDeleteGroup={onDeleteGroup}
          updateServiceGroup={updateServiceGroup}
          deleteServiceGroup={deleteServiceGroup}
        />
      ))}
    </div>);
});

export default class SortableComponent extends Component {
  onDeleteGroup = (index) => {
    console.log(index)
    const structure = this.props.groups;
    const group = structure[index];
    // structure.splice(index, 1);
    group.services.forEach((service, i) => {
      service.groupId = '';
      structure.splice(index + i, 0, {
        type: 'root',
        group: new ServiceGroup({ name: 'Uncat' }),
        services: [service],
      });
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const structure = arrayMove(this.props.groups, oldIndex, newIndex);
    console.log(structure);
    this.props.reorder({ structure });
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
    console.log(newListIndex, newIndex, items)
    
    const structure = this.props.groups; //Object.assign([], toJS(this.props.groups));

    items.forEach((item) => {
      const oldListIndex = item.listId;
      const oldIndex = item.id;

      const source = structure[oldListIndex];
      const destination = structure[newListIndex];

      const service = source.services[oldIndex];
      source.services.splice(oldIndex, 1); // remove service from source group
      if (source.type === 'root') {
        structure.splice(oldListIndex, 1);
        // newListIndex = oldListIndex < newListIndex ? newListIndex - 1 : newListIndex;
      }

      switch (destination.type) {
        case 'root':
          service.groupId = '';
          structure.splice(newIndex ? newListIndex + 1 : newListIndex, 0, { // WRONG??
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
  }

  render() {
    console.log('RERENDER', this.props.groups)

    return (
      <div>
        <SortableListGroups
          items={this.props.groups}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected__group'}
          lockAxis="y"
          pressDelay={150}
          onDeleteGroup={this.onDeleteGroup}
          updateServiceGroup={this.props.updateServiceGroup}
          deleteServiceGroup={this.props.deleteServiceGroup}
        />
      </div>
    );
  }
}
