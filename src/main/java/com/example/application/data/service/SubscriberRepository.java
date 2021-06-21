package com.example.application.data.service;

import com.example.application.data.entity.Subscriber;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriberRepository extends JpaRepository<Subscriber, Integer> {

}
