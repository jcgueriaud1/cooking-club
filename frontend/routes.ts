import { Route } from '@vaadin/router';
import './views/eventgrid/event-grid-view';
import './views/main/main-view';
import './views/events/events-view';

export type ViewRoute = Route & { title?: string; children?: ViewRoute[] };

export const views: ViewRoute[] = [
  // for client-side, place routes below (more info https://vaadin.com/docs/v19/flow/typescript/creating-routes.html)
  {
    path: '',
    component: 'events-view',
    title: 'Events',
  },

  {
    path: 'event-list',
    component: 'event-grid-view',
    title: 'Event Grid',
  },
];
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-view',
    children: [...views],
  },
];
