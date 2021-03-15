// Import external dependencies

// polyfill for the details element to work in IE11
require('details-polyfill');

// Import local dependencies
import Router from './util/Router';
import appState from './util/appState';

// Routes
import common from './routes/common';
import home from './routes/home';

// missing forEach on NodeList for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Populate Router instance with DOM routes
const routes = new Router({
  common,
  home
});

// Inits
appState.init();

// Load events
$(document).ready(() => routes.loadEvents());