
const select = {
  containerOf: {
    pages: '#app', // kontener, w którym są wszystkie podstrony
    about: '#page-about',
    finder: '#finder'
  },
  nav: {
    links: '.nav-link' // linki nawigacyjne
  },
  finder: {
    grid: '#finder-grid',
    submitBtn: '#finder-submit-btn',
    title: '#finder-title'
  }
};

const classNames = {
  pages: {
    active: 'active'
  },
  nav: {
    active: 'active'
  },
  finder: {
    field: 'field',
    active: 'active',
    start: 'start',
    finish: 'finish'
  }
};

export { select, classNames };