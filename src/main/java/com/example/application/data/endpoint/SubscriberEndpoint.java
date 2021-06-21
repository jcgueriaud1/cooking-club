package com.example.application.data.endpoint;

import java.util.Optional;

import javax.annotation.security.PermitAll;

import com.example.application.data.entity.Event;
import com.example.application.data.entity.Subscriber;
import com.example.application.data.service.EventService;
import com.example.application.data.service.SubscriberService;
import com.vaadin.flow.server.connect.Endpoint;

@Endpoint
public class SubscriberEndpoint {

  private final SubscriberService service;
  private final EventService eventService;

  public SubscriberEndpoint(SubscriberService service, EventService eventService) {
    this.service = service;
    this.eventService = eventService;
  }

  @PermitAll
  public Subscriber subscribeTo(Subscriber entity) {
    Optional<Event> eventOptional = eventService.get(entity.getEvent().getId());
    Event event = eventOptional.orElseThrow();
    entity.setEvent(event);
    return service.update(entity);
  }

}
