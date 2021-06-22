# Creating a new view: Events

## Summary

Currently the view fetches the data. If we continue this way, the view is directly bounded to the backend.
That will be an issue if we want to cache the data for the offline or if we want to share the same data in different views.

In this step we will:

- Create an event store that contains the logic to fetch the data
- Update the view

## Externalize the logic in the store

Create a new store `event-store.ts` in `frontend/stores`:

```ts
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
```

`makeAutoObservable` traps existing object properties and make them observable. It takes in three arguments:
- The observable class.
- Overrides. By default (true), all fields are made into observed values, all functions into actions, and all getters into computed values.
    - if value is set to false: MobX won't trap the property or function
    - `observable.shallow`: Any collection assigned will be made observable, but the contents of the collection itself won't become observable.
- Options. Enable `autoBind`, which will bind all actions to this class. It makes it easier to use them in listeners later on.

You can read more about the observable state in MobX here: https://mobx.js.org/observable-state.html

Update the main store app-store and save an instance of the event-store:

```ts
import { RouterLocation } from '@vaadin/router';
import { makeAutoObservable } from 'mobx';
import { EventStore } from './event-store';

export class AppStore {
  eventStore = new EventStore();
  applicationName = 'Cooking club';

  // The location, relative to the base path, e.g. "hello" when viewing "/hello"
  location = '';

  currentViewTitle = '';

  constructor() {
    makeAutoObservable(this);
  }

  setLocation(location: RouterLocation) {
    if (location.route) {
      this.location = location.route.path;
    } else if (location.pathname.startsWith(location.baseUrl)) {
      this.location = location.pathname.substr(location.baseUrl.length);
    } else {
      this.location = location.pathname;
    }
    this.currentViewTitle = (location?.route as any)?.title || '';
  }
}
export const appStore = new AppStore();
export const eventStore = appStore.eventStore;
```

Now you can use this store in the `events-view.ts`.

Remove the state `_events`
```ts
@state()
private _events: Event[] = [];
```

And remove this call:

```ts
this._events = await EventEndpoint.findAll();
```

And replace `this._events` to `eventStore.events`.

The file should look like this:
```ts
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
    return html` <div class="grid grid-cols-3 gap-m p-m">
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
```

That gives you a good separation between this view and the backend.

You can go to the next [step](3__subscribe-event.md)
