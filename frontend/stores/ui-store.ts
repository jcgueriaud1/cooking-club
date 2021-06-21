import { login as serverLogin, logout as serverLogout } from '@vaadin/flow-frontend';
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
