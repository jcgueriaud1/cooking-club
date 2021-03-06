# Creating a new view: Events

## Summary

In this step we will:

- Create a new view based on html elements
- Fetch the data
- Modify the design using your own css class
- Add the menu entry
- Modify the design using lumo-utility classes


### Technical requirements

This project is the starting point for the Cooking Club Workshop given in [SimpleWebConf 2021](https://simplewebconf.com/)

You need the following tools and libraries to complete the workshop:
- Java 8 or later and Maven. See [Installing Development Tools for instructions](https://vaadin.com/docs/v20/guide/install). The recommended Java version is Java 11.
- Visual Studio Code is used in this tutorial. See the setup instructions on [YouTube](https://www.youtube.com/watch?v=G_aJONwi0qo).

Unzip the downloaded file and open the project in your IDE. The instructions assume you use [VS Code](https://code.visualstudio.com/)

Open the project by either:
- Navigating to the project folder and running code . (note the period).
- Choosing File > Open... in VS Code and selecting the project folder.
  Installing the following plugins in VS Code is recommended for an optimal development experience:
- [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
- [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
- [Spring Boot Tools](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot)
  VS Code should automatically suggest these for you when you open the project.

There are different ways to run the application:
- To run from the command line, use `mvn spring-boot:run`
- In VS Code with the Spring Boot Tools extension, you can use the panel `Spring Boot Dashboard` and click on Start
- In VS Code, you can also navigate to `Application.java` right-click and choose `run Java`.

Open [http://localhost:8080](http://localhost:8080) in your browser.

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

There are few things to notice in this example:
- `classList` is a standard property that returns a collection of `class` attributes
- `map` is a standard function that method creates a new array populated with the results of calling a provided function on every element in the calling array.

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


You can fetch the data with the generated endpoint. Add the following code in `connectedCallback` of `events-view.ts`:

```ts
this._events = await EventEndpoint.findAll();
```

You can use auto-import to import the EventEndpoint and also check all the methods you already have.

```ts
import { EventEndpoint } from 'Frontend/generated/EventEndpoint';
```

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

The name of the event should be in blue, the primary color of Lumo theme. If you're comfortable with CSS, you can design the list of events with custom css.


## CSS Helper Classes

In `styles.css`, you can also see in this file `@import url('lumo-css-framework/all-classes.css');`

This file contains a lot of utility css classes that already use the default values of the main Vaadin theme `Lumo`.
The styles are now automatically available in all views and layouts. You can browse all the classes in `node_modules/lumo-css-framework/all-classes.css`

For people who are familiar with tailwind, you will notice that the naming convention is quite similar.

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

Now you should see the list of events in a 3-columns grid. Each event is displayed as a card with simple html elements and some css-utility classes.


You can go to the next [step](2__event-store.md)
