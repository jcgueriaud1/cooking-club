package com.example.application.data.endpoint;

import com.example.application.data.CrudEndpoint;
import com.example.application.data.entity.Event;
import com.example.application.data.service.EventService;
import com.vaadin.flow.server.connect.Endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import javax.annotation.Nullable;

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

}
