# Subscribe to an event

## Summary

Currently nobody can attend to these events. You need to create a subscription form.

In this chapter we will:

- Create a new custom form component for subscription
- Update the backend and add the Subscriber logic
- Use it in our events component
- Bind the two components


## Create a new component Subscription form

Create a new file `subscription-form.ts` in `frontend/views/events` :

```ts
import { customElement, html } from 'lit-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-button';
import { View } from 'Frontend/views/view';

@customElement('subscription-form')
export class SubscriptionForm extends View {
  render() {
    return html`
      <vaadin-text-field label="First name"></vaadin-text-field>
      <vaadin-text-field label="Last name"></vaadin-text-field>
      <vaadin-text-field label="Email"></vaadin-text-field>

      <div class="spacing-e-s">
        <vaadin-button theme="primary">Subscribe</vaadin-button>
        <vaadin-button theme="tertiary">Cancel</vaadin-button>
      </div>
    `;
  }
}
```

You can import and display the form in `events-views.ts`:

```ts
import './subscription-form';
...
  render() {
    return html`
      <div class="flex overflow-auto">
        <div class="grid grid-cols-3 gap-m p-m overflow-auto">
          ...
        </div>
        <subscription-form
          class="flex flex-col pl-m pr-m h-full"
        ></subscription-form>
      </div> `;
  }
```

At this point, you should see the subscription form on the right side of the list of events.

## Create a new Java Entity `Subscriber`

In order to save the data in the database you need to create an Entity `Subscriber.java` in `src/main/java/com/example/application/data/entity`:

```java
package com.example.application.data.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.example.application.data.AbstractEntity;

@Entity
public class Subscriber extends AbstractEntity {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotNull
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Event event;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

}
```

You also need to create a repository `SubscriberRepository.java` in `src/main/java/com/example/application/data/service`:

```java
package com.example.application.data.service;

import com.example.application.data.entity.Subscriber;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriberRepository extends JpaRepository<Subscriber, Integer> {

}
```

You also need to create a service `SubscriberService.java` in `src/main/java/com/example/application/data/service`:

```java
package com.example.application.data.service;

import com.example.application.data.entity.Subscriber;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vaadin.artur.helpers.CrudService;

@Service
public class SubscriberService extends CrudService<Subscriber, Integer> {

    private SubscriberRepository repository;

    public SubscriberService(@Autowired SubscriberRepository repository) {
        this.repository = repository;
    }

    @Override
    protected SubscriberRepository getRepository() {
        return repository;
    }

}

```

You also need to create an endpoint `SubscriberEndpoint.java` in `src/main/java/com/example/application/data/endpoint`.

```java
package com.example.application.data.endpoint;

import java.util.Optional;

import com.example.application.data.entity.Event;
import com.example.application.data.entity.Subscriber;
import com.example.application.data.service.EventService;
import com.example.application.data.service.SubscriberService;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;

@Endpoint
public class SubscriberEndpoint {

    private final SubscriberService service;
    private final EventService eventService;

    public SubscriberEndpoint(SubscriberService service, EventService eventService) {
        this.service = service;
        this.eventService = eventService;
    }

    @AnonymousAllowed
    public Subscriber subscribeTo(Subscriber entity) {
        Optional<Event> eventOptional = eventService.get(entity.getEvent().getId());
        Event event = eventOptional.orElseThrow();
        entity.setEvent(event);
        return service.update(entity);
    }

}
```

## Add the subscribe button in the list

Update `event-store.ts` that will store the selectedEvent and add an function to select the event.

```ts

  selectedEvent: Event | null = null;
  ...

  selectEvent(event: Event) {
    this.selectedEvent = event;
  }
```

You can add a `Subscribe` button just after the max. attendees in `events-view.ts` that will call this function.

```ts
<vaadin-button
    theme="primary"
    @click="${() => eventStore.selectEvent(event)}">
    Subscribe
</vaadin-button>
```

Don't forget to add the import for the vaadin-button:
```ts
import '@vaadin/vaadin-button';
```

When an event is selected, you can add the event name at the beginning of the `subscription-form.ts`:

```ts
${eventStore.selectedEvent
        ? html`<h2>Subscribe to ${eventStore.selectedEvent.name}</h2>`
        : ''}
```

And hide the form if no event has been selected in `events-view.ts`:

```ts
${eventStore.selectedEvent
          ? html`<subscription-form
              class="flex flex-col pl-m pr-m h-full"
            ></subscription-form>`
          : ''}
```

At this point, you should see the event list and when you click on `Subscribe` the subscription form should appear with the name of the event.

## Bind the subscription form

Vaadin Fusion uses Binder for binding form input fields to a model. Binder also performs input validation and form submission.

Add a binder in `subscription-form.ts`:

```ts
import { Binder, field } from '@vaadin/form';
import SubscriberModel from 'Frontend/generated/com/example/application/data/entity/SubscriberModel';

...
@customElement('subscription-form')
export class SubscriptionForm extends View {
  private binder = new Binder(this, SubscriberModel);
```

Bind each field:

```ts
  render()
{
    const model = this.binder.model;
    return html`
      ${eventStore.selectedEvent
        ? html`<h2>Subscribe to ${eventStore.selectedEvent.name}</h2>`
        : ''}
      <vaadin-text-field
        label="First name"
        ...="${field(model.firstName)}"
      ></vaadin-text-field>
      <vaadin-text-field
        label="Last name"
        ...="${field(model.lastName)}"
      ></vaadin-text-field>
      <vaadin-text-field
        label="Email"
        ...="${field(model.email)}"
      ></vaadin-text-field>

      <div class="spacing-e-s">
        <vaadin-button theme="primary">Subscribe</vaadin-button>
        <vaadin-button theme="tertiary">Cancel</vaadin-button>
      </div>
    `;
}
```

You can notice the required indicators for each field and the email field is validated if you edit the field. It's coming from the annotations written in `Subscriber.java`.

You can try to add a new annotation on the lastname:
```java
  @Size(min = 3)
````
And check the result in the form.

## Form actions

`Cancel` removes the selected Event. Modify the `subscription-form.ts`

```ts

  cancelForm() {
    eventStore.selectedEvent = null;
  }
...
        <vaadin-button theme="tertiary" @click="${this.cancelForm}"
          >Cancel</vaadin-button
        >
```

`Subscribe` should submit the binder, call the event-store to save the data and show a notification to the user, in `subscription-form.ts` add:

```ts
import { showNotification } from 'Frontend/../target/flow-frontend/a-notification';
...
  async subscribe() {
    await this.binder.submitTo(eventStore.subscribeTo);
    this.binder.clear();
    showNotification('Thanks for your subscription');
  }
...

  <vaadin-button theme="primary" @click="${this.subscribe}"
    >Subscribe</vaadin-button>
```

Update the `event-store.ts` and add the new function `subscribeTo` that will:

- save the data in the backend
- removes the selected event
- refresh the event

```ts

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
```

When the selectedEvent is updated you want to reinitialize the subscription form, in `subscription-form.ts` add:

```ts

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
```

`autorun` takes a function as a parameter. The function runs immediately, and any time an observable value it depends on changes, in this case any time `selectedEvent` changes.
This will rest the Subscriber on selectedEvent change.

## Retrieve the number of attendees of the event

Normally the data is saved, but it could be better to see the result, for example the number of attendees.
In Subscriber.java add a new calculated attribute and the getter and setter:

```java
    @Formula("(select count(s.id) from Subscriber s where s.event_id = id)")
    private Integer nbAttendees;

...
    public Integer getNbAttendees() {
        return nbAttendees;
    }

    public void setNbAttendees(Integer nbAttendees) {
        this.nbAttendees = nbAttendees;
    }

```

Update the event card in events-view.ts:

```ts
<div>
  Attendees: ${event.nbAttendees} / ${event.maxAttendees}
</div>
```

You can go to the next [step](4__secure-app.md)
