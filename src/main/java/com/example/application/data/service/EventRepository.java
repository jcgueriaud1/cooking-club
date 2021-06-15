package com.example.application.data.service;

import com.example.application.data.entity.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import javax.annotation.Nullable;

public interface EventRepository extends JpaRepository<Event, Integer> {

}