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


// console.log('assets/app.js - check 🎉');
