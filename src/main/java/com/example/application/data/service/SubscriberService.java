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
