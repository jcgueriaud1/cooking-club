package com.example.application.data.endpoint;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.security.PermitAll;

import com.example.application.data.entity.UserInfo;
import com.vaadin.flow.server.connect.Endpoint;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Provides information about the current user.
 */
@Endpoint
public class UserInfoEndpoint {

  @PermitAll
  public UserInfo getUserInfo() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    final List<String> authorities = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    return new UserInfo(auth.getName(), authorities);
  }
}
