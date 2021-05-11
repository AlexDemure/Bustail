import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';


clientsClaim();

const ignored = self.__WB_MANIFEST;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

registerRoute(
  ({url}) => url.pathname.startsWith('/'),
  new NetworkOnly()
);