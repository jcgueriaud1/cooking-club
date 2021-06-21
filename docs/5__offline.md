# Installing and offline use (PWA)

## Summary

Currently the application requires a server to:
- fetch the data
- Login and logout

In this chapter we will:

- Detect if the application is offline
- Disable some features if offline
- Cache the data
- Cache the login information

## Vaadin PWA Configuration

Vaadin is generating the configuration automatically with an annotation in the `Application.java`:

```java
@PWA(name = "Cooking club", shortName = "Cooking club", offlineResources = {"images/logo.png"})
```

By default, Vaadin caches all your frontend views for offline use. You can specify additional resources to cache with the `offlineResources` array.

## Simulate offline status

You can simulate the offline status using the browser developer tools. In Chrome, you can find the network throttling controls under the Network tab. Select the Offline option to simulate going offline.

You should automatically see the Vaadin status bar: `Connection lost` when offline.

If you navigate to the Event list page, you will have a javascript error.
If you refresh the page and navigate to the events, the page is empty.

## Detect the connection state of the application

The `ui-store.ts` is the perfect place to keep the connectionState of the application. Add the imports in `ui-store.ts`:

```ts
import {
  ConnectionState,
  ConnectionStateStore,
} from '@vaadin/flow-frontend/ConnectionState';
```

And this code inside the class:

```ts
offline = false;
connectionStateStore?: ConnectionStateStore;

connectionStateListener = () => {
 this.setOffline(
   this.connectionStateStore?.state === ConnectionState.CONNECTION_LOST
 );
};

setupOfflineListener() {
 const $wnd = window as any;
 if ($wnd.Vaadin?.connectionState) {
   this.connectionStateStore = $wnd.Vaadin
     .connectionState as ConnectionStateStore;
   this.connectionStateStore.addStateChangeListener(
     this.connectionStateListener
   );
   this.connectionStateListener();
 }
}

private setOffline(offline: boolean) {
 // Refresh from server when going online
 if (this.offline && !offline) {
   eventStore.initFromServer();
 }
 this.offline = offline;
}
```

The `setupOfflineListener` is listening the changes of the connection state.

Update the constructor to avoid creating actions for the listener and setup methods and to call the setup method on start.

```ts
  constructor() {
    makeAutoObservable(
      this,
      {
        login: false,
        logout: false,
        connectionStateListener: false,
        connectionStateStore: false,
        setupOfflineListener: false,
      },
      { autoBind: true }
    );
    this.setupOfflineListener();
  }

```

You can use the `offline` property of the ui-store.ts to disable some functionalities in the application like the logout or the subscribe button.

In the `main-view.ts` update the Logout button:

```ts
<vaadin-button
            @click="${() => uiStore.logout()}"
            ?disabled=${uiStore.offline}
            >Logout</vaadin-button
          >
```

Do the same for the Subscribe button and the fields in `subscription-form.ts`:

```html
<vaadin-text-field
  label="First name"
  ?disabled="${uiStore.offline}"
  ...="${field(model.firstName)}"
></vaadin-text-field>
<vaadin-text-field
  label="Last name"
  ?disabled="${uiStore.offline}"
  ...="${field(model.lastName)}"
></vaadin-text-field>
<vaadin-text-field
  label="Email"
  ?disabled="${uiStore.offline}"
  ...="${field(model.email)}"
></vaadin-text-field>

<div class="spacing-e-s">
  <vaadin-button
    theme="primary"
    @click="${this.subscribe}"
    ?disabled="${uiStore.offline}"
    >Subscribe</vaadin-button
  >
  <vaadin-button theme="tertiary" @click="${this.cancelForm}"
    >Cancel</vaadin-button
  >
</div>
```

If you refresh the page, the logout button should be disabled, but the list of events is still empty.

You can also update the login, since the login page will always require the server for the authentication. In `login-view.ts`:

```ts
  render() {
    return html`
      <vaadin-login-form
        no-forgot-password
        .error="${this.error}"
        @login="${this.login}"
        ?disabled=${uiStore.offline}
      >
      </vaadin-login-form>
      ${uiStore.offline
        ? html`You are currently offline. You need to be online to login into
          the application`
        : ''}
    `;
  }
```

## Cache the data

We need to cache the data when the endpoint is done to retrieve it when offline.
We can cache it in the localStorage with this utility class: `cache.ts`

```ts
const CACHE_NAME = 'event-cache';

export async function cacheable<T>(
  fn: () => Promise<T>,
  key: string,
  defaultValue: T
) {
  let result;
  try {
    // retrieve the data from backend.
    result = await fn();
    // save the data to localStorage.
    const cache = getCache();
    cache[key] = result;
    localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
  } catch {
    // if failed to retrieve the data from backend, try localStorage.
    const cache = getCache();
    const cached = cache[key];
    // use the cached data if available, otherwise the default value.
    result = result = cached === undefined ? defaultValue : cached;
  }

  return result;
}

function getCache(): any {
  const cache = localStorage.getItem(CACHE_NAME) || '{}';
  return JSON.parse(cache);
}

export function clearCache() {
  localStorage.removeItem(CACHE_NAME);
}
```

Then you can update `initFromServer()` in `event-store.ts` to use the `cacheable` function.

```ts
  async initFromServer() {
    const events = await cacheable(EventEndpoint.findAll, 'event', []);
    runInAction(() => {
      this.events = events;
    });
  }
```

Now you can try your application. The data is fetched when the application is online, if you put your application offline then you can refresh the application and it will still work.

In the browser inspector you can find the content of the localStorage that should contain the list of events.

## Get the login information and cache it

Spring security can give you all the required information of the user like username and their roles.

We can add a `UserInfo.java` in the `com.example.application.entity` package:
```java
package com.example.application.data.entity;

import java.util.Collection;
import java.util.Collections;

/**
 * User information used in client-side authentication and authorization.
 * To be saved in browsers’ LocalStorage for offline support.
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
```

Then to retrieve the data wit a new `UserInfoEnpoint.java` :
```java
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

```

Now when the user logged in you can save the user information with a expiration date in the localStorage.
Update the `ui-store.ts`.

Add a new interface Authentication:

```ts
interface Authentication {
  timestamp: number;
  user: UserInfo;
}
```
Replace the loggedIn attribute to an authentication object:
```ts
  authentication: Authentication | null = null;
  AUTHENTICATION_KEY = 'authentication';
  THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
```

Update setLoggedIn to call the backend, retrieve the UserInfo and store it:

```ts

  private async setLoggedIn(loggedIn: boolean) {
    if (loggedIn) {
      // Get user info from endpoint
      const user = await UserInfoEndpoint.getUserInfo();
      this.authentication = {
        timestamp: new Date().getTime(),
        user,
      };
      // Save the authentication to local storage
      localStorage.setItem(this.AUTHENTICATION_KEY, JSON.stringify(this.authentication));
      eventStore.initFromServer();
    } else {
      this.authentication = null;
      this.setSessionExpired();
    }
  }

  private setSessionExpired() {
    this.authentication = null;

    // Delete the authentication from the local storage
    localStorage.removeItem(this.AUTHENTICATION_KEY);
  }
```

Then in the constructor of the ui-store retrieve the data from the  localStorage:

```ts

  constructor() {
    makeAutoObservable(
      this,
      {
        login: false,
        logout: false,
        connectionStateListener: false,
        connectionStateStore: false,
        setupOfflineListener: false,
      },
      { autoBind: true }
    );
    this.setupOfflineListener();
    this.retrieveAuthentication();
  }

  private retrieveAuthentication() {
    // Get authentication from local storage
    const storedAuthenticationJson = localStorage.getItem(this.AUTHENTICATION_KEY);
    if (storedAuthenticationJson !== null) {
      const storedAuthentication = JSON.parse(storedAuthenticationJson) as Authentication;
      // Check that the stored timestamp is not older than 30 days
      const hasRecentAuthenticationTimestamp =
        new Date().getTime() - storedAuthentication.timestamp < this.THIRTY_DAYS_MS;
      if (hasRecentAuthenticationTimestamp) {
        // Use loaded authentication
        this.authentication = storedAuthentication;
      } else {
        // Delete expired stored authentication
        this.setSessionExpired();
      }
    }
  }

```

You can now update the vaadin-avatar and use the property name. In `main-view.ts`:

```ts
<vaadin-avatar .name="${uiStore.authentication?.user.name}"></vaadin-avatar>
```

You also have the role of your users that you can use to hide some menu items.

You can go to the next [step](6__deploy_heroku.md)
