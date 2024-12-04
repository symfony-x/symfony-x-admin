import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */

import './styles/app.css'; // i hate this line
import 'flowbite';
import { initFlowbite } from 'flowbite';
// import * as Turbo from '@hotwired/turbo'; // optionally disable turbo
// Turbo.session.drive = false; // optionally disable turbo


document.addEventListener('turbo:render', () => {
  initFlowbite();
});
document.addEventListener('turbo:frame-render', () => {
  initFlowbite();
});

let skipNextRenderTransition = false;
document.addEventListener('turbo:before-render', (event) => {
  if (shouldPerformTransition() && !skipNextRenderTransition) {
    event.preventDefault();
    performTransition(document.body, event.detail.newBody, async () => {
      await event.detail.resume();
    });
  }
});
document.addEventListener('turbo:load', () => {
  // View Transitions don't play nicely with Turbo cache
  if (shouldPerformTransition()) Turbo.cache.exemptPageFromCache();
});
document.addEventListener('turbo:before-frame-render', (event) => {
  if (shouldPerformTransition() && !event.target.hasAttribute('data-skip-transition')) {
    event.preventDefault();
    // workaround for data-turbo-action="advance", which triggers
    // turbo:before-render (and we want THAT to not try to transition)
    skipNextRenderTransition = true;
    setTimeout(() => {
      skipNextRenderTransition = false;
    }, 100);
    performTransition(event.target, event.detail.newFrame, async () => {
      await event.detail.resume();
    });
  }
});

console.log('assets/app.js - check 🎉');
