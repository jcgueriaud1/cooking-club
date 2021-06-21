# Creating a new view: Events

## Summary

In this chapter we will:

- Create a new view based on html elements
- Fetch the data
- Modify the design using your own css class
- Add the menu entry
- Modify the design using lumo-utility classes

## Create the view

Create a new directory: `frontend/views/events/`

Create a new file in this directory: `frontend/views/events/events-view.ts`

Add the following content to the file:

```ts
import Event from 'Frontend/generated/com/example/application/data/entity/Event';
import { customElement, html, state } from 'lit-element';
import { View } from '../../views/view';

@customElement('events-view')
export class EventsView extends View {
  @state()
  private _events: Event[] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('pl-m', 'flex', 'flex-col', 'h-full');
  }

  render() {
    return html`<div class="grid grid-cols-3 gap-m p-m overflow-auto">
      ${this._events.map((event) => html`<div class="event-name">${event.name}</div>`)}
    </div>`;
  }
}
```

To view the view as the homepage http://localhost:8080/ you can update the `views` variable in `frontend/routes.ts`.
Replace the default path by the new view:
```ts
export const views: ViewRoute[] = [
  // for client-side, place routes below (more info https://vaadin.com/docs/v19/flow/typescript/creating-routes.html)
{
    path: '',
    component: 'events-view',
    title: 'Events',
  },
```

Also import the file at the beginning of the file:

```ts
import './views/events/events-view';
```

Now you should be able to view it in http://localhost:8080/

The list of events is empty.

Update `EventService.java` and add a new method `findAll()` that fetches all the event data:

```java
    public List<Event> findAll() {
        return repository.findAll();
    }
```

Don't forget to import the java class:

```java
import java.util.List;
```

Update EventEndpoint.java and add a new method `findAll()` that fetches all the event data:

```java

    @AnonymousAllowed
    public List<Event> findAll() {
        return service.findAll();
    }
```

Don't forget to import the two java classes:

```java
import java.util.List;
import com.vaadin.flow.server.auth.AnonymousAllowed;
```

Now you will have a new function available for the anonymous users.


You can fetch the data with the generated endpoint. Add the following code in `connectedCallback`:

```ts
this._events = await EventEndpoint.findAll();
```

You can use auto-import to import the EventEndpoint and also check all the methods you already have.

## Use Custom CSS

You can use custom css in the events-view.
Create a new `events-view.css` in `frontend/themes/views/` :
```css
events-view {
  display: block;
}

events-view .event-name {
  color: var(--lumo-primary-color);
}
```

Import it in `styles.css`:
```css
@import url('./views/events-view.css');
```

You can also see in this file `@import url('lumo-css-framework/all-classes.css');`

This file contains a lot of utility css classes that already uses the default values of the main Vaadin theme `Lumo`

## Create an Event Card

You can now add all the information of the event and improve the look and feel.
Replace the `render` function in `events-view.ts` with this one:

```ts
  render() {
    return html`
      <div class="grid grid-cols-3 gap-m p-m overflow-auto">
        ${this._events.map(
          (event) => html`<div class="shadow-s rounded-m">
            <div class="bg-primary-10 p-s text-m">${event.name}</div>
            <div class="p-s">
              <div class="text-secondary">${event.description}</div>
              <div>Where: ${event.location}</div>
              ${event.eventDate
                ? html`<div>
                    When: ${new Date(event.eventDate).toLocaleString()}
                  </div>`
                : ''}
              <div>Max. attendees: ${event.maxAttendees}</div>
            </div>
          </div>`
        )}
      </div>`;
  }
```


You can go to the next [step](2__event-store.md)
