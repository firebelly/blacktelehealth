// Homepage js
import appState from '../util/appState';

let resizeTimer,
  viewportW,
  viewportHalfW;

const home = {
  init() {
    // Init Parallax
    home.initParallax();
    // Get Sizes
    home.updateSizes();
  },

  initParallax() {
    let containers = document.querySelectorAll('.parallax-container');
    let items = document.querySelectorAll('.parallax');

    let onMouseMoveHandler = function (event) {
      let transform = 0;
      let offset = Math.floor(event.clientX - viewportHalfW);

      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].classList.contains('-reverse')) {
          transform = 'translate3d(' + -offset * 0.01 + 'px, 0, 0)';
        } else {
          transform = 'translate3d(' + offset * 0.01 + 'px, 0, 0)';
        }

        items[i].style.transform = transform;
        items[i].style.webkitTransform = transform;
        items[i].style.mozTransform = transform;
        items[i].style.msTransform = transform;
        items[i].style.oTransform = transform;
      }
    };

    for (let i = containers.length - 1; i >= 0; i--) {
      containers[i].onmousemove = onMouseMoveHandler;
    }
  },

  // Update Sizes
  updateSizes() {
    viewportW = window.innerWidth;
    viewportHalfW = viewportW / 2;
  },

  finalize() {

  },
}

export default home;
