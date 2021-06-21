import { customElement, html } from 'lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-button';
import { View } from 'Frontend/views/view';
import { eventStore, uiStore } from 'Frontend/stores/app-store';
import { Binder, field } from '@vaadin/form';
import SubscriberModel from 'Frontend/generated/com/example/application/data/entity/SubscriberModel';
import { showNotification } from 'Frontend/../target/flow-frontend/a-notification';

@customElement('subscription-form')
export class SubscriptionForm extends View {
  private binder = new Binder(this, SubscriberModel);

  constructor() {
    super();
    this.autorun(() => {
      const model = SubscriberModel.createEmptyValue();
      if (eventStore.selectedEvent) {
        model.event = eventStore.selectedEvent;
      }
      this.binder.read(model);
    });
  }

  render() {
    const model = this.binder.model;
    return html`
      ${eventStore.selectedEvent ? html`<h2>Subscribe to ${eventStore.selectedEvent.name}</h2>` : ''}
      <vaadin-text-field
        label="First name"
        ?disabled="${uiStore.offline}"
        ...="${field(model.firstName)}"
      ></vaadin-text-field>
      <vaadin-text-field
        label="Last name"
        ?disabled="${uiStore.offline}"
        ...="${field(model.lastName)}"
      ></vaadin-text-field>
      <vaadin-text-field label="Email" ?disabled="${uiStore.offline}" ...="${field(model.email)}"></vaadin-text-field>

      <div class="spacing-e-s">
        <vaadin-button theme="primary" @click="${this.subscribe}" ?disabled="${uiStore.offline}"
          >Subscribe</vaadin-button
        >
        <vaadin-button theme="tertiary" @click="${this.cancelForm}">Cancel</vaadin-button>
      </div>
    `;
  }

  cancelForm() {
    eventStore.selectedEvent = null;
  }
  async subscribe() {
    await this.binder.submitTo(eventStore.subscribeTo);
    this.binder.clear();
    showNotification('Thanks for your subscription');
  }
}
