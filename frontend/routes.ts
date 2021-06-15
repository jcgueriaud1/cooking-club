import { Route } from '@vaadin/router';
import './views/eventgrid/event-grid-view';
import './views/main/main-view';

export type ViewRoute = Route & { title?: string; children?: ViewRoute[] };

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'event-grid-view',
    title: '',
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
