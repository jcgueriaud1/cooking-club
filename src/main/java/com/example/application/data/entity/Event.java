package com.example.application.data.entity;

import javax.persistence.Entity;

import com.example.application.data.AbstractEntity;
import java.time.LocalDateTime;
import javax.annotation.Nullable;

@Entity
public class Event extends AbstractEntity {

    private String name;
    private String description;
    @Nullable
    private LocalDateTime eventDate;
    private String location;
    private Integer maxAttendees;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDateTime getEventDate() {
        return eventDate;
    }
    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public Integer getMaxAttendees() {
        return maxAttendees;
    }
    public void setMaxAttendees(Integer maxAttendees) {
        this.maxAttendees = maxAttendees;
    }

}
