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
* @fileoverview The JavaScript for our single page app.
*/

"use strict";

// the templates & the target container for the view
const itemTemplate = document.querySelector('template#story-item');
const errorTemplate = document.querySelector('template#error');
const listContainer = document.querySelector('#content-container');
const notificationsContainer = document.querySelector('#notifications-container');
const heading = document.querySelector('h1');

// we want our web app to work offline and load faster, so we try to install a service worker.
if ('serviceWorker' in navigator) {
  // this browser supports service workers!
  navigator.serviceWorker.register('sw.js').then(initApp);
} else {
  // this browser doesn't support service workers, so we don't install one.
  initApp();
}

// Functions
/**
* Initializes our single page app - sets up routing, etc.
*/
function initApp() {
  // whenever the hash of the URL changes, we load the view for the new hash
  window.addEventListener('hashchange', evt => {
    let category = window.location.hash.slice(1); // removes the leading '#'
    // if the category is empty, show the_keyword as the homepage.
    if (category == '') category = 'the_keyword';
    showStoriesForCategory(category);
  });

  // Load the content for the current hash
  let category = window.location.hash.slice(1); // we remove the leading '#'
  // if the category is empty, show the_keyword as the homepage.
  if (category == '') category = 'the_keyword';
  showStoriesForCategory(category);

  // Load the Material Component code for the navigation drawer menu
  const menu = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
  // Make the menu button toggle the navigation menu
  document.getElementById('menuToggle').addEventListener('click', () => {
    menu.open = !menu.open;
  });  
}

/**
 * Loads the articles for the given category,
 * clears the target container and adds the articles as cards to the container.
 * @param {string} category the category to load stories for
*/
function showStoriesForCategory(category) {
  // load the stories from the JSON file of the desired category
  // Note: in a real application this would be an API with the latest stories
  // instead of a static file.
  fetch(`/data/${category}.json`)
  .then(response => response.json())
  .then(stories => {
    // remove the previous view content
    notificationsContainer.innerHTML = '';
    listContainer.innerHTML = '';
    // update the heading
    heading.textContent = stories[0].category;

    return stories.map(story => {
      // load the template for an article card
      let item = document.importNode(itemTemplate.content, true);
      // fill in the data
      item.querySelector('h2').textContent = story.title;
      item.querySelector('h3').textContent = `by ${story.author}`;
      item.querySelector('img').src = `/data/${story.imgSrc}`;
      item.querySelector('.summary').textContent = story.summary;
      item.querySelector('button').addEventListener('click', () => {
        location.href = story.link;
      });
      return item;
    });
  })
  .then(cards => {
    // add the article card to the view
    cards.forEach(card => listContainer.appendChild(card));
  }).catch(e => {
    notificationsContainer.innerHTML = '';
    listContainer.innerHTML = '';
    // load and display the error message template
    let errorMsg = document.importNode(errorTemplate.content, true);
    notificationsContainer.appendChild(errorMsg);
  });
}
