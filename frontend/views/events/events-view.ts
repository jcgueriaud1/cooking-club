import './subscription-form';
import { eventStore } from 'Frontend/stores/app-store';
import { customElement, html } from 'lit-element';
import { View } from '../../views/view';
import '@vaadin/vaadin-button';

@customElement('events-view')
export class EventsView extends View {
  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('pl-m', 'flex', 'flex-col', 'h-full');
  }

  render() {
    return html` <div class="flex overflow-auto">
      <div class="grid grid-cols-3 gap-m p-m overflow-auto">
        ${eventStore.events.map(
          (event) => html`<div class="shadow-s rounded-m">
            <div class="bg-primary-10 p-s text-m">${event.name}</div>
            <div class="p-s">
              <div class="text-secondary">${event.description}</div>
              <div>Where: ${event.location}</div>
              ${event.eventDate ? html`<div>When: ${new Date(event.eventDate).toLocaleString()}</div>` : ''}
              <div>Attendees: ${event.nbAttendees} / ${event.maxAttendees}</div>
              <vaadin-button theme="primary" @click="${() => eventStore.selectEvent(event)}"> Subscribe </vaadin-button>
            </div>
          </div> `
        )}
      </div>
      ${eventStore.selectedEvent
        ? html`<subscription-form class="flex flex-col pl-m pr-m h-full"></subscription-form>`
        : ''}
    </div>`;
  }
}
