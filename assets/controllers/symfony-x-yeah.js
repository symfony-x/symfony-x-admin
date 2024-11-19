import { Controller } from '@hotwired/stimulus';
import JSConfetti from 'js-confetti';
export default class extends Controller {
  poof() {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti();
  }
}
