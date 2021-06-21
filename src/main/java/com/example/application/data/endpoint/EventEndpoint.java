package com.example.application.data.endpoint;

import java.util.List;

import com.example.application.data.CrudEndpoint;
import com.example.application.data.entity.Event;
import com.example.application.data.service.EventService;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;

import org.springframework.beans.factory.annotation.Autowired;

@Endpoint
public class EventEndpoint extends CrudEndpoint<Event, Integer> {

    private EventService service;

    public EventEndpoint(@Autowired EventService service) {
        this.service = service;
    }

    @Override
    protected EventService getService() {
        return service;
    }

    @AnonymousAllowed
    public List<Event> findAll() {
        return service.findAll();
    }

}
