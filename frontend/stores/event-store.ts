import { makeAutoObservable, observable, runInAction } from 'mobx';
import Event from 'Frontend/generated/com/example/application/data/entity/Event';
import { EventEndpoint } from 'Frontend/generated/EventEndpoint';
import Subscriber from 'Frontend/generated/com/example/application/data/entity/Subscriber';
import { SubscriberEndpoint } from 'Frontend/generated/SubscriberEndpoint';
import { cacheable } from './cache';

export class EventStore {
  events: Event[] = [];

  selectedEvent: Event | null = null;

  constructor() {
    makeAutoObservable(
      this,
      {
        initFromServer: false,
        selectEvent: false,
        events: observable.shallow,
      },
      { autoBind: true }
    );

    this.initFromServer();
  }

  async initFromServer() {
    const events = await cacheable(EventEndpoint.findAll, 'event', []);
    runInAction(() => {
      this.events = events;
    });
  }

  selectEvent(event: Event) {
    this.selectedEvent = event;
  }

  async subscribeTo(subscriber: Subscriber) {
    const saved = await SubscriberEndpoint.subscribeTo(subscriber);

    // refresh the event from the backend
    const updatedEvent = await EventEndpoint.get(subscriber.event.id!);

    if (updatedEvent) this._updateStoreEvent(updatedEvent);
    this.selectedEvent = null;
  }

  private _updateStoreEvent(updatedEvent: Event) {
    this.events = this.events.map((existing) => {
      if (existing.id === updatedEvent.id) {
        return updatedEvent;
      } else {
        return existing;
      }
    });
  }
}
