import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortableContainer, sortableElement, arrayMove, DragLayer, sortableHandle } from 'react-sortable-multiple-hoc';
import InlineEdit from 'react-edit-inline';
import { defineMessages, intlShape } from 'react-intl';


import ServiceGroup from '../../../models/ServiceGroup';
import ServiceItem from './ServiceItem';

const messages = defineMessages({
  groupPlaceholder: {
    id: 'settings.services.groupPlaceholder',
    defaultMessage: '!!!Drag Service here',
  },
});

const dragLayer = new DragLayer();

const DragHandle = sortableHandle(() => <span className="mdi mdi-menu" />);

const SortableService = sortableElement(({ item, goTo }) =>
  <table className="service-table">
    <tbody>
      <ServiceItem
        key={item.id}
        service={item}
        // toggleAction={() => toggleService({ serviceId: service.id })}
        goToServiceForm={() => goTo(`/settings/services/edit/${item.id}`)}
      />
    </tbody>
  </table>,
  // <div key={item.id}>{item.name}</div>
);

const SortableListServices = sortableContainer(({ items, goTo }) =>
  <div>
    {items.map((service, index) => (
      <SortableService
        key={service.id}
        index={index}
        item={service}
        goTo={goTo}
        useDragHandle
      />
    ))}
  </div>,
);

const SortableGroup = sortableElement(props => (props.item.group || null) &&
  <div className={props.item.type === 'group' ? 'services__group' : ''}>
    {props.item.type === 'group' &&
      <div className="services__group-header">
        <DragHandle />
        <InlineEdit
          text={props.item.group.name}
          paramName={`group-header-${props.id}`}
          change={(param) => { props.updateServiceGroup(props.item.group.id, param[`group-header-${props.id}`]); }}
        />
        <span
          onClick={(e) => { e.preventDefault(); props.onDeleteGroup(props.id); }}
          className="mdi mdi-delete"
        />

      </div>
    }
    <SortableListServices
      {...props} // onMultipleSortEnd
      items={props.item.services}
      dragLayer={dragLayer}
      // distance={3}
      helperClass={'selected__service'}
      isMultiple
      helperCollision={{ top: 0, bottom: 0 }}
      lockAxis="y"
      goTo={props.goTo}
      useDragHandle
    />
    {props.item.type === 'group' &&
      <div>
        <span className="mdi mdi-cursor-move">{props.intl.formatMessage(messages.groupPlaceholder)}</span>
      </div>
    }
  </div>,
);

const SortableListGroups = sortableContainer(({
  items,
  onSortItemsEnd,
  onDeleteGroup,
  updateServiceGroup,
  deleteServiceGroup,
  goTo,
  shouldCancel,
  intl,
}) =>
  <div>
    {items.map((group, index) => (group &&
      <SortableGroup
        key={`group-${index}`} // eslint-disable-line react/no-array-index-key
        index={index}
        item={group}
        id={index}
        onMultipleSortEnd={onSortItemsEnd}
        onDeleteGroup={onDeleteGroup}
        updateServiceGroup={updateServiceGroup}
        deleteServiceGroup={deleteServiceGroup}
        goTo={goTo}
        shouldCancelStart={shouldCancel}
        useDragHandle
        intl={intl}
      />
    ))}
  </div>);

export default class SortableComponent extends Component {
  static propTypes = {
    reorder: PropTypes.func.isRequired,
    updateServiceGroup: PropTypes.func.isRequired,
    deleteServiceGroup: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    groups: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    shouldCancelStart: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

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
    this.props.reorder({ structure: arrayMove(this.props.groups, oldIndex, newIndex) });
  }

  onSortItemsEnd = ({ newListIndex, newIndex, items }) => {
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
  }

  render() {
    // console.log('RERENDER', this.props.groups)
    const { intl } = this.context;

    return (
      <div>
        <SortableListGroups
          items={this.props.groups}
          onSortEnd={this.onSortEnd}
          onSortItemsEnd={this.onSortItemsEnd}
          helperClass={'selected__group'}
          lockAxis="y"
          // pressDelay={100}
          onDeleteGroup={this.onDeleteGroup}
          updateServiceGroup={this.props.updateServiceGroup}
          deleteServiceGroup={this.props.deleteServiceGroup}
          goTo={this.props.goTo}
          shouldCancel={this.props.shouldCancelStart}
          shouldCancelStart={this.props.shouldCancelStart}
          useDragHandle
          intl={intl}
        />
      </div>
    );
  }
}
