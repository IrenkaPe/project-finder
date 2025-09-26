/* global AOS */

class AboutPage {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    console.log('AboutPage init — uruchamiam AOS...');

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      offset: 120,
    });
  }
}

export default AboutPage;
