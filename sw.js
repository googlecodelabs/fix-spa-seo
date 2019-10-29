/*
    Copyright 2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/**
* @fileoverview The service worker to make our web app faster and work offline.
* This file is irrelevant for the codelab. To learn more about what this file does, 
* check out the codelab at https://codelabs.developers.google.com/codelabs/workbox-lab/#0
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  // make sure to add the application files to the cache for offline usage & improved loading speed
  workbox.precaching.precacheAndRoute([
    '/styles.css',
    '/app.js',
    '/index.html'
  ]);

  // try loading JS from the network, fall back to cache
  workbox.routing.registerRoute(/\.(js|css)$/, new workbox.strategies.NetworkFirst());
  // use cached images & fonts, refresh in the background
  workbox.routing.registerRoute(/\.(?:png|gif|jpg|jpeg|webp|svg|woff2)$/, new workbox.strategies.CacheFirst());
  // use cached json, refresh in the background
  workbox.routing.registerRoute(/\.json$/, new workbox.strategies.StaleWhileRevalidate());
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}