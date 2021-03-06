import camelCase from './camelCase';

/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
class Router {

  /**
   * Create a new Router
   * @param {Object} routes
   */
  constructor(routes) {
    this.routes = routes;
  }

  /**
   * Fire Router events
   * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
   * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
   * @param {string} [arg] Any custom argument to be passed to the event.
   */
  fire(route, event = 'init', arg) {
    if (typeof (event) === 'function') {
      document.dispatchEvent(new CustomEvent('routed', {
        bubbles: true,
        detail: {
          route,
          fn: event,
        },
      }));
    }

    const fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
    if (fire) {
      this.routes[route][event](arg);
    }
  }

  /**
   * Automatically load and fire Router events
   *
   * Events are fired in the following order:
   *  * common init
   *  * page-specific init
   *  * page-specific finalize
   *  * common finalize
   */
  loadEvents() {
    // Fire common init JS
    this.fire('common');

    // Fire page-specific init JS, and then finalize JS
    if (document.body.className.match(/page\-/)) {
      document.body.className
        .match(/page\-([^ ]+)/)
        .map(camelCase)
        .forEach((className) => {
          this.fire(className);
          this.fire(className, 'finalize');
        });
      }

    // Fire common finalize JS
    this.fire('common', 'finalize');
  }

  /**
   * Cleanup called from swup for live page reloads
   *
   * e.g. any carousels, scroll handlers, etc
   */
  unload() {
    // Fire common unload JS
    this.fire('common', 'unload');

    // Fire page-specific unload JS
    if (document.body.className.match(/page\-/)) {
      document.body.className
        .match(/page\-([^ ]+)/)
        .map(camelCase)
        .forEach((className) => {
          this.fire(className, 'unload');
      });
    }
  }
}

export default Router;
