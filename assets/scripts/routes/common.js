// Common js
import appState from '../util/appState';
import Accordion from '../util/accordions';

// Shared vars
let $window = $(window),
    $body = $('body'),
    $document = $(document),
    $siteNav,
    transitionElements = [],
    resizeTimer;

// Accessibility/tab trap taken from https://github.com/gdkraus/accessible-modal-dialog
// jQuery formatted selector to search for focusable items
let focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

export default {
  // JavaScript to be fired on all pages
  init() {
    // Establish Vars
    $siteNav = $('.site-nav');

    // Transition elements to enable/disable on resize
    transitionElements = [];

    // Init Functions
    _initSiteNav();
    _initAccordions();

    function _initSiteNav() {
      $document.on('click.siteNavOpen', '#nav-open', _openNav);
      $document.on('click.siteNavClose', '#nav-close', _closeNav);

      $('.site-nav.-active').keydown(function(event) {
        trapTabKey($(this), event);
      });

      $siteNav.on('click', 'a', _closeNav);
    }

    function _openNav() {
      $body.addClass('nav-open');
      appState.navOpen = true;
      $siteNav.addClass('-active');

      // attach a listener to redirect the tab to the modal window if the user somehow gets out of the modal window
      $('body').on('focusin', '.site-main', function() {
        setFocusToFirstItemInContainer($('.site-nav'));
      });
    }

    function _closeNav() {
      if (!appState.navOpen) {
        return;
      }
      appState.navOpen = false;
      $body.removeClass('nav-open');
      $siteNav.removeClass('-active');

      // remove the listener which redirects tab keys in the main content area to the modal
      $('body').off('focusin','.site-nav');
    }

    function trapTabKey(obj, evt) {
      // if tab or shift-tab pressed
      if (evt.which == 9) {

        // get list of all children elements in given object
        var o = obj.find('*');

        // get list of focusable items
        var focusableItems;
        focusableItems = o.filter(focusableElementsString).filter(':visible')

        // get currently focused item
        var focusedItem;
        focusedItem = $(':focus');

        // get the number of focusable items
        var numberOfFocusableItems;
        numberOfFocusableItems = focusableItems.length

        // get the index of the currently focused item
        var focusedItemIndex;
        focusedItemIndex = focusableItems.index(focusedItem);

        if (evt.shiftKey) {
          //back tab
          // if focused on first item and user preses back-tab, go to the last focusable item
          if (focusedItemIndex == 0) {
            focusableItems.get(numberOfFocusableItems - 1).focus();
            evt.preventDefault();
          }

        } else {
          //forward tab
          // if focused on the last item and user preses tab, go to the first focusable item
          if (focusedItemIndex == numberOfFocusableItems - 1) {
            focusableItems.get(0).focus();
            evt.preventDefault();
          }
        }
      }
    }

    function setFocusToFirstItemInContainer(obj) {
      // get list of all children elements in given object
      var o = obj.find('*');

      // set the focus to the first keyboard focusable item
      o.filter(focusableElementsString).filter(':visible').first().focus();
    }

    function _initAccordions() {
      document.querySelectorAll('details').forEach((el) => {
        let accordion = new Accordion(el);
      });
    }

    // Disabling transitions on certain elements on resize
    function _disableTransitions() {
      $.each(transitionElements, function() {
        $(this).css('transition', 'none');
      });
    }

    function _enableTransitions() {
      $.each(transitionElements, function() {
        $(this).attr('style', '');
      });
    }

    function _resize() {
      // Disable transitions when resizing
      _disableTransitions();

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
      }, 250);
    }
    $(window).resize(_resize);

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
