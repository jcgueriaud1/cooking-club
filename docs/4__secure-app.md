# Secure the application

## Summary

Currently the application and all the endpoints are public.

In this chapter we will:
- Secure the application
- Restrict the access by adding a login page
- Secure the endpoints.

## Secure the application

Stop your application.
Add this dependency to your pom.xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

To configure the security, create a new configuration class extending the `VaadinWebSecurityConfigurerAdapter` class:

```java
@EnableWebSecurity
@Configuration
public class SecurityConfig extends VaadinWebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Set default security policy that permits Vaadin internal requests and
    // denies all other
    super.configure(http);
    // use a form based login
    http.formLogin();
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    // Configure users and roles in memory
    auth.inMemoryAuthentication()
        .withUser("user").password("{noop}user").roles("USER")
        .and()
        .withUser("admin").password("{noop}admin").roles("ADMIN", "USER");
  }
}
```

By default, all the resources will be secured. Make the images folder public, it contains the logo of your application:

```java
@Override
  public void configure(WebSecurity web) throws Exception {
      super.configure(web);
      web.ignoring().antMatchers("/images/**");
  }
```
Start your application.
Now your application has the default login page but the endpoints not yet secured.

Update the Endpoints and replace `@AnonymousAllowed` to `@PermitAll`.
The following annotations are available:

- @PermitAll Allows any authenticated user to call a method via the request.
- @RolesAllowed Grants access to users having the roles specified in the annotation value. Roles are covered in the next section.
- @DenyAll Disallows to call the method via the request by anyone. The default.
- @AnonymousAllowed Permits anyone to call the method via the request without the authorization.

It can be placed on a class or on a method.

## Create your own frontend login page

Before creating your login page, you need to create a ui-store which will store the state of your application. Create a file `ui-store.ts` in `frontend/store/` that will contain the client side login and logout logic and a simple state:

```ts
import {
  login as serverLogin,
  logout as serverLogout,
} from '@vaadin/flow-frontend';
import { makeAutoObservable } from 'mobx';
import { eventStore } from './app-store';

export class UiStore {
  loggedIn = false;

  constructor() {
    makeAutoObservable(
      this,
      {
        login: false,
        logout: false,
      },
      { autoBind: true }
    );
  }

  async login(username: string, password: string) {
    const result = await serverLogin(username, password);
    if (!result.error) {
      this.setLoggedIn(true);
    }
    return result;
  }
  
    async logout() {
        await serverLogout();
        this.setLoggedIn(false);
        window.location.reload();
    }

  private setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      eventStore.initFromServer();
    }
  }
}
```

Update the `app-store.ts` to add the `uiStore` instance:

```ts

import { UiStore } from './ui-store';

export class AppStore {
  eventStore = new EventStore();
  uiStore = new UiStore();

  ...

export const uiStore = appStore.uiStore;
```

You can create your own login page and customize it:

```ts
import { customElement, html, state } from 'lit-element';
import { LoginResult } from '@vaadin/flow-frontend';
import { AfterEnterObserver, RouterLocation } from '@vaadin/router';
import '@vaadin/vaadin-login/vaadin-login-form';
import { uiStore } from 'Frontend/stores/app-store';
import { View } from '../view';

@customElement('login-view')
export class LoginView extends View implements AfterEnterObserver {
  @state()
  private error = false;

  // the url to redirect to after a successful login
  private returnUrl?: string;

  private onSuccess = (result: LoginResult) => {
    // If a login redirect was initiated by opening a protected URL, the server knows where to go (result.redirectUrl).
    // If a login redirect was initiated by the client router, this.returnUrl knows where to go.
    // If login was opened directly, use the default URL provided by the server.
    // As we do not know if the target is a resource or a Fusion view or a Flow view, we cannot just use Router.go
    window.location.href =
      result.redirectUrl || this.returnUrl || result.defaultUrl || '/';
  };

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
  }

  render() {
    return html`
      <vaadin-login-form
        no-forgot-password
        .error="${this.error}"
        @login="${this.login}"
      >
      </vaadin-login-form>
    `;
  }

  async login(event: CustomEvent) {
    this.error = false;
    // use the login helper method from auth.ts, which in turn uses
    // Vaadin provided login helper method to obtain the LoginResult
    const result = await uiStore.login(
      event.detail.username,
      event.detail.password
    );
    this.error = result.error;

    if (!result.error) {
      this.onSuccess(result);
    }

    return result;
  }

  onAfterEnter(location: RouterLocation) {
    this.returnUrl = location.redirectFrom;
  }
}
```

You also need to add this view as a route of your application, in route.ts, add the `login-view` in the `routes` parameter:

```ts
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-view',
    children: [...views],
  },
  {
    path: '/login',
    component: 'login-view',
  },
];
```

Then replace the configure function in the Spring Security configuration `SecurityConfig.java`

```java
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Set default security policy that permits Vaadin internal requests and
    // denies all other
    super.configure(http);
    // use a client side login view
    setLoginView(http, "/login");
  }
```

## Logout button

Add a Logout button in the `main-view.ts`:

```ts
  <vaadin-button @click="${() => uiStore.logout()}">Logout</vaadin-button>
```

Then you should see the new login page after logout.