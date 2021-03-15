// Accordions from details elements
//
// Animates native details element in accordion style
// credit to https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
import gsap from 'gsap/gsap-core';
import Velocity from 'velocity-animate';

export default class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector('summary');
    // Store the <div class="content"> element
    this.content = el.querySelector('.accordion-content');
    // Store the <button class="close-accordion"> element
    this.closeButton = el.querySelector('.close-accordion');

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e));
    // Detect user clicks on the close button element
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => this.shrink());
    }
    // Check if user prefers reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();

    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden';
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.hasAttribute('open')) {
      this.open();
    // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.hasAttribute('open')) {
      this.shrink();
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    this.el.classList.add('-is-closing');
    // Remove active class
    this.el.classList.remove('-is-open');
    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    if (!this.prefersReducedMotion.matches) {
      const thisRef = this;

      if (this.el.classList.contains('long-accordion')) {
        gsap.to(window, { duration: 0.5, scrollTo: { y: this.el, autoKill: true, offsetY: 60 } });
      }

      // Start the animation
      this.animation = true;
      gsap.to(this.el, {
        height: endHeight,
        duration: .35,
        ease: 'ease-in',
        onComplete: function() {
          thisRef.onAnimationFinish(false);
          this.animation = false;
        }
      });
    } else {
      this.onAnimationFinish(false);
    }
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    // this.el.open = true;
    this.el.setAttribute('open', 'open');
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // set an open class
    this.el.classList.add('-is-open');
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (!this.prefersReducedMotion.matches) {
      const thisRef = this;

      // Start the animation
      this.animation = true;
      gsap.to(this.el, {
        height: endHeight,
        duration: .25,
        ease: 'ease',
        onComplete: function () {
          thisRef.onAnimationFinish(true);
          this.animation = false;
        }
      });
    } else {
      this.onAnimationFinish(true);
    }
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    // this.el.open = open;
    if (open === true) {
      this.el.setAttribute('open', 'open');
    } else {
      this.el.removeAttribute('open');
      this.el.classList.remove('-is-closing');
    }
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = '';
  }
}
