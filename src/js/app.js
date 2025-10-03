// app.js


import { select, classNames } from '../js/settings.js';
import AboutPage from './modules/AboutPage.js';
import Finder from './modules/Finder.js';

const app = {
  pages: {},
  finder: null,

  initPages: function() {
    const thisApp = this;

  
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault(); 

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activePage(id);
        
      });
    }
  },

  activePage: function(pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
  
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') === '#' + pageId
      );
    }
    window.location.hash = '#/' + pageId;
  },


  initAbout: function() {
    const thisApp = this;

    const aboutElement = document.querySelector(select.containerOf.about);
    if (aboutElement) {
      thisApp.pages.about = new AboutPage(aboutElement);
    }
  },

  initFinder: function() {
    const thisApp = this;
    const finderContainer = document.querySelector(select.containerOf.finder);
    if (finderContainer) {
      thisApp.pages.finder = new Finder(finderContainer);
    }
  },

  init: function() {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initAbout();
    thisApp.initFinder();
  },
};

export default app; 
