package com.example.application.data.entity;

import java.util.Collection;
import java.util.Collections;

/**
 * User information used in client-side authentication and authorization. To be
 * saved in browsers’ LocalStorage for offline support.
 */
public class UserInfo {

  private String name;
  private Collection<String> authorities;

  public UserInfo(String name, Collection<String> authorities) {
    this.name = name;
    this.authorities = Collections.unmodifiableCollection(authorities);
  }

  public String getName() {
    return name;
  }

  public Collection<String> getAuthorities() {
    return authorities;
  }

}