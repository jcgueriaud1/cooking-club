import { RouterLocation } from '@vaadin/router';
import { makeAutoObservable } from 'mobx';
import { EventStore } from './event-store';
import { UiStore } from './ui-store';

export class AppStore {
  eventStore = new EventStore();
  uiStore = new UiStore();
  applicationName = 'Cooking club';

  // The location, relative to the base path, e.g. "hello" when viewing "/hello"
  location = '';

  currentViewTitle = '';

  constructor() {
    makeAutoObservable(this);
  }

  setLocation(location: RouterLocation) {
    if (location.route) {
      this.location = location.route.path;
    } else if (location.pathname.startsWith(location.baseUrl)) {
      this.location = location.pathname.substr(location.baseUrl.length);
    } else {
      this.location = location.pathname;
    }
    this.currentViewTitle = (location?.route as any)?.title || '';
  }
}
export const appStore = new AppStore();
export const eventStore = appStore.eventStore;
export const uiStore = appStore.uiStore;
