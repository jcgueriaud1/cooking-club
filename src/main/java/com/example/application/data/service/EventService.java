package com.example.application.data.service;

import com.example.application.data.entity.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vaadin.artur.helpers.CrudService;
import java.time.LocalDateTime;
import javax.annotation.Nullable;

@Service
public class EventService extends CrudService<Event, Integer> {

    private EventRepository repository;

    public EventService(@Autowired EventRepository repository) {
        this.repository = repository;
    }

    @Override
    protected EventRepository getRepository() {
        return repository;
    }

}
