import '@polymer/iron-icon';
import { EndpointError } from '@vaadin/flow-frontend';
import { showNotification } from '@vaadin/flow-frontend/a-notification';
import { Binder, field } from '@vaadin/form';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-date-time-picker';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-grid';
import { GridDataProviderCallback, GridDataProviderParams, GridElement } from '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import Event from 'Frontend/generated/com/example/application/data/entity/Event';
import EventModel from 'Frontend/generated/com/example/application/data/entity/EventModel';
import * as EventEndpoint from 'Frontend/generated/EventEndpoint';
import { customElement, html, property, query } from 'lit-element';
import { View } from '../view';

@customElement('event-grid-view')
export class EventGridView extends View {
  @query('#grid')
  private grid!: GridElement;

  @property({ type: Number })
  private gridSize = 0;

  private gridDataProvider = this.getGridData.bind(this);

  private binder = new Binder<Event, EventModel>(this, EventModel);

  render() {
    return html`
      <vaadin-split-layout class="w-full h-full">
        <div class="flex-grow w-full">
          <vaadin-grid
            id="grid"
            class="w-full h-full"
            theme="no-border"
            .size="${this.gridSize}"
            .dataProvider="${this.gridDataProvider}"
            @active-item-changed=${this.itemSelected}
          >
            <vaadin-grid-sort-column auto-width path="name"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="description"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="eventDate"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="location"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="maxAttendees"></vaadin-grid-sort-column>
          </vaadin-grid>
        </div>
        <div class="flex flex-col" style="width: 400px;">
          <div class="p-l flex-grow">
            <vaadin-form-layout
              ><vaadin-text-field label="Name" id="name" ...=${field(this.binder.model.name)}></vaadin-text-field
              ><vaadin-text-field
                label="Description"
                id="description"
                ...=${field(this.binder.model.description)}
              ></vaadin-text-field
              ><vaadin-date-time-picker
                label="Event date"
                id="eventDate"
                step="1"
                ...=${field(this.binder.model.eventDate)}
              ></vaadin-date-time-picker
              ><vaadin-text-field
                label="Location"
                id="location"
                ...=${field(this.binder.model.location)}
              ></vaadin-text-field
              ><vaadin-text-field
                label="Max attendees"
                id="maxAttendees"
                ...=${field(this.binder.model.maxAttendees)}
              ></vaadin-text-field
            ></vaadin-form-layout>
          </div>
          <vaadin-horizontal-layout class="w-full flex-wrap bg-contrast-5 py-s px-l" theme="spacing">
            <vaadin-button theme="primary" @click="${this.save}">Save</vaadin-button>
            <vaadin-button theme="tertiary" @click="${this.cancel}">Cancel</vaadin-button>
          </vaadin-horizontal-layout>
        </div>
      </vaadin-split-layout>
    `;
  }

  private async getGridData(params: GridDataProviderParams, callback: GridDataProviderCallback) {
    const index = params.page * params.pageSize;
    const data = await EventEndpoint.list(index, params.pageSize, params.sortOrders as any);
    callback(data ?? []);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'h-full');
    this.gridSize = (await EventEndpoint.count()) ?? 0;
  }

  private async itemSelected(event: CustomEvent) {
    const item: Event = event.detail.value as Event;
    this.grid.selectedItems = item ? [item] : [];

    if (item) {
      const fromBackend = await EventEndpoint.get(item.id!);
      fromBackend ? this.binder.read(fromBackend) : this.refreshGrid();
    } else {
      this.clearForm();
    }
  }

  private async save() {
    try {
      const isNew = !this.binder.value.id;
      await this.binder.submitTo(EventEndpoint.update);
      if (isNew) {
        // We added a new item
        this.gridSize++;
      }
      this.clearForm();
      this.refreshGrid();
      showNotification(`Event details stored.`, { position: 'bottom-start' });
    } catch (error) {
      if (error instanceof EndpointError) {
        showNotification(`Server error. ${error.message}`, { position: 'bottom-start' });
      } else {
        throw error;
      }
    }
  }

  private cancel() {
    this.grid.activeItem = undefined;
  }

  private clearForm() {
    this.binder.clear();
  }

  private refreshGrid() {
    this.grid.selectedItems = [];
    this.grid.clearCache();
  }
}
