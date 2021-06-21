import { login as serverLogin, logout as serverLogout } from '@vaadin/flow-frontend';
import { makeAutoObservable } from 'mobx';
import { eventStore } from './app-store';
import { ConnectionState, ConnectionStateStore } from '@vaadin/flow-frontend/ConnectionState';
import UserInfo from 'Frontend/generated/com/example/application/data/entity/UserInfo';
import { UserInfoEndpoint } from 'Frontend/generated/UserInfoEndpoint';

export class UiStore {
  loggedIn = false;
  offline = false;
  connectionStateStore?: ConnectionStateStore;
  authentication: Authentication | null = null;
  AUTHENTICATION_KEY = 'authentication';
  THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

  connectionStateListener = () => {
    this.setOffline(this.connectionStateStore?.state === ConnectionState.CONNECTION_LOST);
  };

  setupOfflineListener() {
    const $wnd = window as any;
    if ($wnd.Vaadin?.connectionState) {
      this.connectionStateStore = $wnd.Vaadin.connectionState as ConnectionStateStore;
      this.connectionStateStore.addStateChangeListener(this.connectionStateListener);
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
}

interface Authentication {
  timestamp: number;
  user: UserInfo;
}
