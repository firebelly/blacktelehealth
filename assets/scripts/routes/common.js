// Dependencies
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import { DrawSVGPlugin } from "../private/DrawSVGPlugin.js";
import { GSDevTools } from "../private/GSDevTools.min.js";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, DrawSVGPlugin, GSDevTools);

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
    introTimeline,
    timelineProgress = 0,
    introSection,
    lettermark,
    logoGradient,
    logoBackground,
    introComplete = false,
    resizeTimer;

// Accessibility/tab trap taken from https://github.com/gdkraus/accessible-modal-dialog
// jQuery formatted selector to search for focusable items
let focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

export default {
  // JavaScript to be fired on all pages
  init() {
    // Establish Vars
    $siteNav = $('.site-nav');
    logoBackground = document.getElementById("logo-background");
    introSection = document.getElementById('intro-section');
    lettermark = document.getElementById('lettermark');

    // Transition elements to enable/disable on resize
    transitionElements = [];

    // Init Functions
    _initIntroAnimation(timelineProgress);
    _initParallax();
    _initLettermark();
    _initSiteNav();
    _initAccordions();
    _initBios();
    _initNewsletterForm();
    _initSmoothScrolling();

    function _initIntroAnimation(progress) {
      // GSDevTools.create();

      let stagger = 0.1,
          short = 0.5,
          medium= 0.75,
          long = 1,
          small = 50,
          large = 125,
          easeIn = 'ease-in',
          easeOut = 'ease-out',
          options = {
            id: "introAnimation",
            delay: 1,
            pause: true,
            defaults: {
              duration: short,
              ease: easeOut
            },
            onComplete: function() {
              introComplete = true;
            }
          };

      // Kill the old timeline
      if (introTimeline) {
        introTimeline.set('#intro-animation *', {clearProps: "all"});
        introTimeline.progress(0).kill();
      }

      // Create a new timeline
      introTimeline = gsap.timeline(options);

      if (appState.breakpoints.md) {
        introTimeline
          .set('#animation-text', { opacity: 1 })
          .set('#animation-text .-top span, #animation-text .pair span', { opacity: 0, x: -small })
          .set('.bt-wordmark', { fill: '#ede7de' })
          .set('#animation-text', { y: 0, x: -large, opacity: 1 })
          .set('#intro-text', { y: 0, x: -large, opacity: 0, duration: long })
          .set('#b-outline path', { drawSVG: '0%' })
          .set('.big-b > div', { opacity: 0 })
          // begin timeline
          .to('#animation-text .-top span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-one span', { x: 0, opacity: 1, stagger: stagger }, '-=' + (short - stagger))
          .to('#pair-one span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-two span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-two span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-three span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-three span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-four span', { x: 0, opacity: 1, stagger: stagger })
          .to('#intro-animation .backdrop', { opacity: 0, delay: medium })
          .add(function () {
            introSection.setAttribute('data-lettermark', 'dark');
            _buildLogoGradient();
          }, '-=' + short)
          .to('.bt-wordmark', { fill: '#0f332a' }, '-=' + short)
          .to('#animation-text', { x: 0, opacity: 0, duration: long }, '-=' + short)
          .to('#intro-text', { y: 0, x: 0, opacity: 1, duration: long }, '-=' + long)
          .to('#b-outline path', { drawSVG: '100%', duration: 1.25 }, '-=' + long)
          .to('#b-outline', { opacity: 0, duration: 0.25, ease: easeIn, delay: 0.2 })
          .to('.big-b > div', { opacity: 1, duration: long }, '-=0.3')
          ;
        introTimeline.progress(progress).play();
      } else {
        introTimeline
          .set('#animation-text', { opacity: 1 })
          .set('#animation-text .-top span, #animation-text .pair span', { opacity: 0, x: -small })
          .set('#lettermark', { backgroundColor: '#ede7de' })
          .set('.bt-wordmark', { fill: '#ede7de' })
          .set('#animation-text', { x: 0, y: -large, opacity: 1 })
          .set('#intro-text', { x: 0, y: -large, opacity: 0 })
          .set('#b-outline path', { drawSVG: '0%' })
          .set('.big-b > div', { opacity: 0 })
          // begin timeline
          .to('#animation-text .-top span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-one span', { x: 0, opacity: 1, stagger: stagger }, '-=' + (short - stagger))
          .to('#pair-one span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-two span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-two span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-three span', { x: 0, opacity: 1, stagger: stagger })
          .to('#pair-three span', { x: small, opacity: 0, stagger: stagger, ease: easeIn, delay: short })
          .to('#pair-four span', { x: 0, opacity: 1, stagger: stagger })
          .to('#intro-animation .backdrop', { opacity: 0, delay: medium })
          .to('#lettermark', { backgroundColor: '#0f332a' }, '-=' + short)
          .to('.bt-wordmark', { fill: '#0f332a' }, '-=' + short)
          .to('#animation-text', { x: 0, y: 0, opacity: 0, duration: long }, '-=' + short)
          .to('#intro-text', { x: 0, y: 0, opacity: 1, duration: long }, '-=' + long)
          .to('#b-outline path', { drawSVG: '100%', duration: 1.25 }, '-=' + long)
          .to('#b-outline', { opacity: 0, duration: 0.25, ease: easeIn, delay: 0.2 })
          .to('.big-b > div', { opacity: 1, duration: long }, '-=0.3')
          ;
          introTimeline.progress(progress).play();
      }
    }

    function _initParallax() {
      gsap.utils.toArray('.title-icon svg').forEach((icon, index) => {
        const trigger = icon.parentElement;
        gsap.fromTo(icon, { y: '30%' }, {
          y: '-20%',
          scrollTrigger: {
            trigger: trigger,
            scrub: 0.2
          }
        });
      });

      gsap.utils.toArray('.image-shift').forEach((image, index) => {
        const trigger = image.parentElement;
        const img = image.querySelector('img');
        gsap.fromTo(img, { y: '5%', x: '-50%' }, {
          y: '-5%',
          x: '-50%',
          scrollTrigger: {
            trigger: trigger,
            scrub: 0.2
          }
        });
      });
    }

    function _initLettermark() {
      const offset = 60;
      let scrollPosition = document.documentElement.scrollTop + offset;
      lettermark.style.opacity = 0;

      setTimeout(_buildLogoGradient, 200);

      window.addEventListener("scroll", function (e) {
        scrollPosition = document.documentElement.scrollTop;
        logoBackground.style.transform = "translateY(-" + scrollPosition + "px)";
      });

    }

    function _buildLogoGradient() {
      let gradientPosition = 0;
      let currentColor;

      // Get sections with backgrounds to construct background-gradient
      let sections = document.querySelectorAll(".section");

      let docHeight = document.body.offsetHeight;
      sections.forEach(function (section, i) {
        const sectionH = section.offsetHeight;
        let prevGradientPosition = gradientPosition;
        gradientPosition += sectionH;
        const sectionColor = section.getAttribute("data-lettermark");
        let lettermarkColor = sectionColor === 'light' ? '#ede7de' : '#0f332a';

        if (i === 0) {
          currentColor = sectionColor;
          logoGradient = "linear-gradient(" + lettermarkColor + ', ' + lettermarkColor + ' ' + gradientPosition + 'px';
        }

        if (i !== 0 && sectionColor !== currentColor) {
          currentColor = sectionColor;
          logoGradient =
            logoGradient +
            ", " +
            lettermarkColor +
            " " +
            prevGradientPosition +
            "px, " +
            lettermarkColor +
            " " +
            gradientPosition +
            "px";
        }

        if (i === sections.length - 1) {
          logoGradient = logoGradient + ")";
        }
      });

      logoBackground.style.height = docHeight + "px";
      logoBackground.style.backgroundSize = "100% " + docHeight + "px";
      logoBackground.style.backgroundImage = logoGradient;
      lettermark.style.opacity = 1;
    }

    function _initSiteNav() {
      $document.on('click.siteNavOpen', '#nav-open', _openNav);
      $document.on('click.siteNavClose', '#nav-close', _closeNav);
      $document.on('click.siteNavClose', '.nav-overlay', _closeNav);

      $('.site-nav.-active').keydown(function(event) {
        trapTabKey($(this), event);
      });

      $siteNav.on('click', 'a', _closeNav);
    }

    function _openNav() {
      $body.addClass('nav-open');
      appState.navOpen = true;
      $siteNav.addClass('-active');
      disableBodyScroll($siteNav);

      // attach a listener to redirect the tab to the modal window if the user somehow gets out of the modal window
      $('body').on('focusin', '.site-main', function() {
        setFocusToFirstItemInContainer($('.site-nav'));
      });
    }

    function _closeNav() {
      if (!appState.navOpen) {
        return;
      }
      enableBodyScroll($siteNav);
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
      modal.addEventListener('click', function(e) {
        const $target = $(e.target);
        // close when clicking away

        if (!$target.is('.-inner') && !$target.parents('.-inner').length) {
          modals.closeModal();
        }
      });

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

    function _initNewsletterForm() {
      // Focus State Handling
      let inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', function(e) {
          input.parentElement.classList.add('-focus');
        });

        input.addEventListener('blur', function (e) {
          if (e.target.value === '' || e.target.value == null) {
            input.parentElement.classList.remove('-focus');
          }
        });
      });

      // All of this junk was taken directly from ActiveCampaign
      // as a quick way to implement the signup form
      window.cfields = [];
      window._show_thank_you = function (id, message, trackcmp_url, email) {
        var form = document.getElementById('_form_' + id + '_'), thank_you = form.querySelector('._form-thank-you');
        form.querySelector('._form-content').classList.add('_submission-successful');
        thank_you.innerHTML = message;
        thank_you.style.display = 'block';
        const vgoAlias = typeof visitorGlobalObjectAlias === 'undefined' ? 'vgo' : visitorGlobalObjectAlias;
        var visitorObject = window[vgoAlias];
        if (email && typeof visitorObject !== 'undefined') {
          visitorObject('setEmail', email);
          visitorObject('update');
        } else if (typeof (trackcmp_url) != 'undefined' && trackcmp_url) {
          // Site tracking URL to use after inline form submission.
          _load_script(trackcmp_url);
        }
        if (typeof window._form_callback !== 'undefined') window._form_callback(id);
      };
      window._show_error = function (id, message, html) {
        var form = document.getElementById('_form_' + id + '_'), err = document.createElement('div'), button = form.querySelector('button'), old_error = form.querySelector('._form_error');
        if (old_error) old_error.parentNode.removeChild(old_error);
        err.innerHTML = message;
        err.className = '_error-inner _form_error _no_arrow';
        var wrapper = document.createElement('div');
        wrapper.className = '_form-inner';
        wrapper.appendChild(err);
        button.parentNode.insertBefore(wrapper, button);
        document.querySelector('[id^="_form"][id$="_submit"]').disabled = false;
        if (html) {
          var div = document.createElement('div');
          div.className = '_error-html';
          div.innerHTML = html;
          err.appendChild(div);
        }
      };
      window._load_script = function (url, callback) {
        var head = document.querySelector('head'), script = document.createElement('script'), r = false;
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = url;
        if (callback) {
          script.onload = script.onreadystatechange = function () {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
              r = true;
              callback();
            }
          };
        }
        head.appendChild(script);
      };
      (function () {
        if (window.location.search.search("excludeform") !== -1) return false;
        var getCookie = function (name) {
          var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
          return match ? match[2] : null;
        }
        var setCookie = function (name, value) {
          var now = new Date();
          var time = now.getTime();
          var expireTime = time + 1000 * 60 * 60 * 24 * 365;
          now.setTime(expireTime);
          document.cookie = name + '=' + value + '; expires=' + now + ';path=/';
        }
        var addEvent = function (element, event, func) {
          if (element.addEventListener) {
            element.addEventListener(event, func);
          } else {
            var oldFunc = element['on' + event];
            element['on' + event] = function () {
              oldFunc.apply(this, arguments);
              func.apply(this, arguments);
            };
          }
        }
        var _removed = false;
        var form_to_submit = document.getElementById('_form_1_');
        var allInputs = form_to_submit.querySelectorAll('input, select, textarea'), tooltips = [], submitted = false;

        var getUrlParam = function (name) {
          var regexStr = '[\?&]' + name + '=([^&#]*)';
          var results = new RegExp(regexStr, 'i').exec(window.location.href);
          return results != undefined ? decodeURIComponent(results[1]) : false;
        };

        for (var i = 0; i < allInputs.length; i++) {
          var regexStr = "field\\[(\\d+)\\]";
          var results = new RegExp(regexStr).exec(allInputs[i].name);
          if (results != undefined) {
            allInputs[i].dataset.name = window.cfields[results[1]];
          } else {
            allInputs[i].dataset.name = allInputs[i].name;
          }
          var fieldVal = getUrlParam(allInputs[i].dataset.name);

          if (fieldVal) {
            if (allInputs[i].dataset.autofill === "false") {
              continue;
            }
            if (allInputs[i].type == "radio" || allInputs[i].type == "checkbox") {
              if (allInputs[i].value == fieldVal) {
                allInputs[i].checked = true;
              }
            } else {
              allInputs[i].value = fieldVal;
            }
          }
        }

        var remove_tooltips = function () {
          for (var i = 0; i < tooltips.length; i++) {
            tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
          }
          tooltips = [];
        };
        var remove_tooltip = function (elem) {
          for (var i = 0; i < tooltips.length; i++) {
            if (tooltips[i].elem === elem) {
              tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
              tooltips.splice(i, 1);
              return;
            }
          }
        };
        var create_tooltip = function (elem, text) {
          var tooltip = document.createElement('div'), arrow = document.createElement('div'), inner = document.createElement('div'), new_tooltip = {};
          if (elem.type != 'radio' && elem.type != 'checkbox') {
            tooltip.className = '_error';
            arrow.className = '_error-arrow';
            arrow.innerHTML = '<svg class="icon icon-error" aria-hidden="true" role="presentation"><use xlink:href="#icon-error"/></svg>';
            inner.className = '_error-inner';
            inner.innerHTML = text;
            tooltip.appendChild(inner);
            tooltip.appendChild(arrow);
            elem.parentNode.appendChild(tooltip);
          } else {
            tooltip.className = '_error-inner _no_arrow';
            tooltip.innerHTML = text;
            elem.parentNode.insertBefore(tooltip, elem);
            new_tooltip.no_arrow = true;
          }
          new_tooltip.tip = tooltip;
          new_tooltip.elem = elem;
          tooltips.push(new_tooltip);
          return new_tooltip;
        };
        var resize_tooltip = function (tooltip) {
          var rect = tooltip.elem.getBoundingClientRect();
          var doc = document.documentElement, scrollPosition = rect.top - ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
          if (scrollPosition < 40) {
            tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _below';
          } else {
            tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _above';
          }
        };
        var resize_tooltips = function () {
          if (_removed) return;
          for (var i = 0; i < tooltips.length; i++) {
            if (!tooltips[i].no_arrow) resize_tooltip(tooltips[i]);
          }
        };
        var validate_field = function (elem, remove) {
          var tooltip = null, value = elem.value, no_error = true;
          remove ? remove_tooltip(elem) : false;
          if (elem.type != 'checkbox') {
            elem.parentElement.classList.remove('_has_error');
            elem.className = elem.className.replace(/ ?_has_error ?/g, '');
          }
          if (elem.getAttribute('required') !== null) {
            if (elem.type == 'radio' || (elem.type == 'checkbox' && /any/.test(elem.className))) {
              var elems = form_to_submit.elements[elem.name];
              if (!(elems instanceof NodeList || elems instanceof HTMLCollection) || elems.length <= 1) {
                no_error = elem.checked;
              }
              else {
                no_error = false;
                for (var i = 0; i < elems.length; i++) {
                  if (elems[i].checked) no_error = true;
                }
              }
              if (!no_error) {
                tooltip = create_tooltip(elem, "Please select an option.");
              }
            } else if (elem.type == 'checkbox') {
              var elems = form_to_submit.elements[elem.name], found = false, err = [];
              no_error = true;
              for (var i = 0; i < elems.length; i++) {
                if (elems[i].getAttribute('required') === null) continue;
                if (!found && elems[i] !== elem) return true;
                found = true;
                elems[i].className = elems[i].className.replace(/ ?_has_error ?/g, '');
                if (!elems[i].checked) {
                  no_error = false;
                  elems[i].className = elems[i].className + ' _has_error';
                  err.push("Checking %s is required".replace("%s", elems[i].value));
                }
              }
              if (!no_error) {
                tooltip = create_tooltip(elem, err.join('<br/>'));
              }
            } else if (elem.tagName == 'SELECT') {
              var selected = true;
              if (elem.multiple) {
                selected = false;
                for (var i = 0; i < elem.options.length; i++) {
                  if (elem.options[i].selected) {
                    selected = true;
                    break;
                  }
                }
              } else {
                for (var i = 0; i < elem.options.length; i++) {
                  if (elem.options[i].selected && !elem.options[i].value) {
                    selected = false;
                  }
                }
              }
              if (!selected) {
                elem.className = elem.className + ' _has_error';
                no_error = false;
                tooltip = create_tooltip(elem, "Please select an option.");
              }
            } else if (value === undefined || value === null || value === '') {
              elem.parentElement.classList.add('_has_error');
              elem.className = elem.className + ' _has_error';
              no_error = false;
              tooltip = create_tooltip(elem, "This field is required.");
            }
          }
          if (no_error && elem.name == 'email') {
            if (!value.match(/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)) {
              elem.parentElement.classList.add('_has_error');
              elem.className = elem.className + ' _has_error';
              no_error = false;
              tooltip = create_tooltip(elem, "Enter a valid email address.");
            }
          }
          if (no_error && /date_field/.test(elem.className)) {
            if (!value.match(/^\d\d\d\d-\d\d-\d\d$/)) {
              elem.className = elem.className + ' _has_error';
              no_error = false;
              tooltip = create_tooltip(elem, "Enter a valid date.");
            }
          }
          tooltip ? resize_tooltip(tooltip) : false;
          return no_error;
        };
        var needs_validate = function (el) {
          if (el.getAttribute('required') !== null) {
            return true
          }
          if (el.name === 'email' && el.value !== "") {
            return true
          }
          return false
        };
        var validate_form = function (e) {
          var err = form_to_submit.querySelector('._form_error'), no_error = true;
          if (!submitted) {
            submitted = true;
            for (var i = 0, len = allInputs.length; i < len; i++) {
              var input = allInputs[i];
              if (needs_validate(input)) {
                if (input.type == 'text') {
                  addEvent(input, 'blur', function () {
                    this.value = this.value.trim();
                    validate_field(this, true);
                  });
                  addEvent(input, 'input', function () {
                    validate_field(this, true);
                  });
                } else if (input.type == 'radio' || input.type == 'checkbox') {
                  (function (el) {
                    var radios = form_to_submit.elements[el.name];
                    for (var i = 0; i < radios.length; i++) {
                      addEvent(radios[i], 'click', function () {
                        validate_field(el, true);
                      });
                    }
                  })(input);
                } else if (input.tagName == 'SELECT') {
                  addEvent(input, 'change', function () {
                    validate_field(this, true);
                  });
                } else if (input.type == 'textarea') {
                  addEvent(input, 'input', function () {
                    validate_field(this, true);
                  });
                }
              }
            }
          }
          remove_tooltips();
          for (var i = 0, len = allInputs.length; i < len; i++) {
            var elem = allInputs[i];
            if (needs_validate(elem)) {
              if (elem.tagName.toLowerCase() !== "select") {
                elem.value = elem.value.trim();
              }
              validate_field(elem) ? true : no_error = false;
            }
          }
          if (!no_error && e) {
            e.preventDefault();
          }
          resize_tooltips();
          return no_error;
        };
        addEvent(window, 'resize', resize_tooltips);
        addEvent(window, 'scroll', resize_tooltips);
        window._old_serialize = null;
        if (typeof serialize !== 'undefined') window._old_serialize = window.serialize;
        _load_script("//d3rxaij56vjege.cloudfront.net/form-serialize/0.3/serialize.min.js", function () {
          window._form_serialize = window.serialize;
          if (window._old_serialize) window.serialize = window._old_serialize;
        });
        var form_submit = function (e) {
          e.preventDefault();
          if (validate_form()) {
            // use this trick to get the submit button & disable it using plain javascript
            form_to_submit.classList.add('_loading');
            document.querySelector('#_form_1_submit').disabled = true;
            var serialized = _form_serialize(document.getElementById('_form_1_'));
            var err = form_to_submit.querySelector('._form_error');
            err ? err.parentNode.removeChild(err) : false;
            _load_script('https://blacktelehealth.activehosted.com/proc.php?' + serialized + '&jsonp=true', function(e) {
              form_to_submit.classList.remove('_loading');
            });
          }
          return false;
        };
        addEvent(form_to_submit, 'submit', form_submit);
      })();
    }

    function _initSmoothScrolling() {
      // Detect if a link's href goes to the current page
      function getSamePageAnchor(link) {
        if (
          link.protocol !== window.location.protocol ||
          link.host !== window.location.host ||
          link.pathname !== window.location.pathname ||
          link.search !== window.location.search
        ) {
          return false;
        }

        return link.hash;
      }

      // Scroll to a given hash, preventing the event given if there is one
      function scrollToHash(hash, e) {
        const elem = hash ? document.querySelector(hash) : false;
        if (elem) {
          if (e) e.preventDefault();
          gsap.to(window, { duration: 0.5, scrollTo: { y: elem, autoKill: true } });
        }
      }

      // If a link's href is within the current page, scroll to it instead
      document.querySelectorAll('a[href]').forEach(a => {
        a.addEventListener('click', e => {
          scrollToHash(getSamePageAnchor(a), e);
        });
      });

      // Scroll to the element in the URL's hash on load
      scrollToHash(window.location.hash);
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
      if (introTimeline && introTimeline.isActive()) {
        introTimeline.pause();
        timelineProgress = introTimeline.progress();
      }

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
        _buildLogoGradient();

        // Resume intro animation
        if (!introComplete) {
          _initIntroAnimation(timelineProgress);
        }
      }, 250);
    }
    $(window).resize(_resize);

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
