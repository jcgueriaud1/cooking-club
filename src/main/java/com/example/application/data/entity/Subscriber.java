package com.example.application.data.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.example.application.data.AbstractEntity;

@Entity
public class Subscriber extends AbstractEntity {

  @NotBlank
  private String firstName;

  @Size(min = 3)
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
