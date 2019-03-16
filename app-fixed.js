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
var itemTemplate = document.querySelector('template#story-item');
var errorTemplate = document.querySelector('template#error');
var listContainer = document.querySelector('#content-container');
var notificationsContainer = document.querySelector('#notifications-container');
var heading = document.querySelector('h1');
var metaDesc = document.querySelector('meta[name="description"]');

// whenever a link with the class "spa-link" is clicked,
// we will change the view & update the history
// we use event delegation here to avoid having to maintain many listeners...
window.addEventListener('click', function (evt) {
  if (!evt.target.classList.contains('spa-link')) return;

  evt.preventDefault();
  var category = trimSlashes(evt.target.getAttribute('href'));
  // if the category is empty, show the_keyword as the homepage.
  if (category == '') category = 'the_keyword';
  showStoriesForCategory(category);
  // update history
  window.history.pushState({category: category}, window.title, evt.target.getAttribute('href'));
});

// The browser navigates through the browser history, time to update our view!
window.addEventListener('popstate', function (evt) {
  // if this history entry has 'state' (that is when we created it), use the state
  // if it's a "real" browser history entry, find out what URL it comes from.
  var category = event.state ? event.state.category : trimSlashes(window.location.pathname);
  if (category == '') category = 'the_keyword';
  showStoriesForCategory(category);
});

// Load the content for the current URL
var category = trimSlashes(window.location.pathname);
// if the category is empty, show the_keyword as the homepage.
if (category == '') category = 'the_keyword';
showStoriesForCategory(category);

// Load the Material Component code for the navigation drawer menu
var menu = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
// Make the menu button toggle the navigation menu
document.getElementById('menuToggle').addEventListener('click', function () {
  menu.open = !menu.open;
});

// Functions

/**
 * Loads the articles for the given category,
 * clears the target container and adds the articles as cards to the container.
 * @param {string} category the category to load stories for
*/
function showStoriesForCategory(category) {
  // load the stories from the JSON file of the desired category
  // Note: in a real application this would be an API with the latest stories
  // instead of a static file.
  fetch('/data/' + category + '.json')
  .then(response => response.json())
  .then(stories => {
    // remove the previous view content
    notificationsContainer.innerHTML = '';
    listContainer.innerHTML = '';
    // update the title, meta description and heading
    document.title = 'Articles about ' + stories[0].category;
    metaDesc.setAttribute('content', 'Articles from Google blogs about ' + stories[0].category);
    heading.textContent = stories[0].category;

    // add all stories as cards to the view
    return stories.map(function (story) {
      // load the template for an article card
      var item = document.importNode(itemTemplate.content, true);
      // fill in the data
      item.querySelector('h2').textContent = story.title;
      item.querySelector('h3').textContent = 'by ' + story.author;
      item.querySelector('img').src = '/data/' + story.imgSrc;
      item.querySelector('.summary').textContent = story.summary;
      item.querySelector('a').setAttribute('href', story.link);
      return item;
    });
  })
  .then(function (cards) {
    // add the article card to the view
    cards.forEach(function(card) { listContainer.appendChild(card); });
  }).catch(function (e) {
    notificationsContainer.innerHTML = '';
    listContainer.innerHTML = '';
    // load and display the error message template
    var errorMsg = document.importNode(errorTemplate.content, true);
    notificationsContainer.appendChild(errorMsg);
  });
}

/**
 * Removes leading and trailing slashes
 * @param {string} pathName The path to remove leading and trailing slashes from
 * @return {string} The pathName without leading and trailing slashes
 */
function trimSlashes(pathName) {
  if (pathName[0] === '/') pathName = pathName.slice(1);
  if (pathName.slice(-1) === '/') pathName = pathName.slice(-1);
  return pathName;
}
