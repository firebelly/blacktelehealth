// Dependencies
import { gsap } from "gsap";

// Common js
import appState from '../util/appState';
import Accordion from '../util/accordions';
import modals from '../util/modals';

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
    _initIntroAnimation();
    _initSiteNav();
    _initAccordions();
    _initBios();

    function _initIntroAnimation() {
      let animationText = document.getElementById('animation-text');

      gsap.timeline()
        .from('#animation-text .-top span', {x:-200, opacity: 0, stagger:0.2, duration: 0.5, ease: 'ease-out'})
        .from('#pair-one span',{ x:-200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-out' })
        .to('#pair-one span', { x:200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-in', delay:1 })
        .from('#pair-two span', { x: -200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-out' })
        .to('#pair-two span', { x: 200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-in', delay:1 })
        .from('#pair-three span', { x: -200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-out' })
        .to('#pair-three span', { x: 200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-in', delay:1})
        .from('#pair-four span', { x: -200, opacity: 0, stagger: 0.2, duration: 0.5, ease: 'ease-out' })
        .to('#intro-animation .backdrop', {opacity: 0, duration: 2, delay: 2})
        .to('#animation-text', { x: 200, opacity: 0, duration: 2, ease: 'ease-in' }, '-=2')
        .from('#intro-text', { x: -200, opacity: 0, duration: 2, ease: 'ease-in' }, '-=2')
    }

    function _initSiteNav() {
      $document.on('click.siteNavOpen', '#nav-open', _openNav);
      $document.on('click.siteNavClose', '#nav-close', _closeNav);
      $document.on('click.siteNavClose', '.site-overlay', _closeNav);

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
      document.querySelectorAll('.accordion').forEach((el) => {
        let accordion = new Accordion(el);
      });
    }

    function _initBios() {
      modals.init('.modal');
      const modal = document.querySelector('.modal');
      const peopleWithBios = document.querySelectorAll('.person-with-bio');
      const bioCount = peopleWithBios.length;

      peopleWithBios.forEach(function(person, i) {
        let html = person.innerHTML;
        person.setAttribute('data-modal-index', i);

        person.addEventListener('click', function(e) {
          if (appState.breakpoints.md) {
            modal.setAttribute('data-modal-index', i);
            modals.openModal(html, 'bio-modal');
          }
        });
      });

      // Close Modal
      let modalClose = document.querySelector('.close-modal');
      let modalOverlay = document.querySelector('.site-overlay');
      modalClose.addEventListener('click', modals.closeModal);
      modalOverlay.addEventListener('click', modals.closeModal);

      // Modal Navigation
      function nextBio(currentBio) {
        let html;
        let newIndex = 0;
        if (currentBio === bioCount - 1) {
          html = peopleWithBios[newIndex].innerHTML;
        } else {
          newIndex = currentBio + 1;
          html = peopleWithBios[newIndex].innerHTML;
        }
        modals.closeModal();
        modal.setAttribute('data-modal-index', newIndex);
        modals.openModal(html, 'bio-modal');
      }

      // Modal Navigation
      function prevBio(currentBio) {
        let html;
        let newIndex;
        if (currentBio === 0) {
          newIndex = bioCount - 1;
          html = peopleWithBios[newIndex].innerHTML;
        } else {
          newIndex = currentBio - 1;
          html = peopleWithBios[newIndex].innerHTML;
        }
        modals.closeModal();
        modal.setAttribute('data-modal-index', newIndex);
        modals.openModal(html, 'bio-modal');
      }

      // Modal Navigation Click Handlers
      let prevModal = document.querySelector('.prev-modal');
      prevModal.addEventListener('click', function() {
        let currentBio = parseInt(modal.getAttribute('data-modal-index'));
        prevBio(currentBio);
      });
      let nextModal = document.querySelector('.next-modal');
      nextModal.addEventListener('click', function () {
        let currentBio = parseInt(modal.getAttribute('data-modal-index'));
        nextBio(currentBio);
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
