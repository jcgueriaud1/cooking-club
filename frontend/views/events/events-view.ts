import { eventStore } from 'Frontend/stores/app-store';
import { customElement, html, state } from 'lit-element';
import { View } from '../../views/view';

@customElement('events-view')
export class EventsView extends View {
  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('pl-m', 'flex', 'flex-col', 'h-full');
  }

  render() {
    return html` <div class="grid grid-cols-3 gap-m p-m overflow-auto">
      ${eventStore.events.map(
        (event) => html`<div class="shadow-s rounded-m">
          <div class="bg-primary-10 p-s text-m">${event.name}</div>
          <div class="p-s">
            <div class="text-secondary">${event.description}</div>
            <div>Where: ${event.location}</div>
            ${event.eventDate ? html`<div>When: ${new Date(event.eventDate).toLocaleString()}</div>` : ''}
            <div>Max. attendees: ${event.maxAttendees}</div>
          </div>
        </div>`
      )}
    </div>`;
  }
}
