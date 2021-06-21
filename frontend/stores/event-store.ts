import { makeAutoObservable, observable, runInAction } from 'mobx';
import Event from 'Frontend/generated/com/example/application/data/entity/Event';
import { EventEndpoint } from 'Frontend/generated/EventEndpoint';

export class EventStore {
  events: Event[] = [];

  constructor() {
    makeAutoObservable(
      this,
      {
        initFromServer: false,
        events: observable.shallow,
      },
      { autoBind: true }
    );

    this.initFromServer();
  }

  async initFromServer() {
    const events = await EventEndpoint.findAll();

    runInAction(() => {
      this.events = events;
    });
  }
}
