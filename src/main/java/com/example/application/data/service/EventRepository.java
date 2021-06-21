package com.example.application.data.service;

import com.example.application.data.entity.Event;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Integer> {

}