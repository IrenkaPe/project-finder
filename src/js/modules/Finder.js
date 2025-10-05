import { templates,classNames, select } from '../settings.js';

class Finder {
  constructor(element) {
    const thisFinder = this;

    thisFinder.element = element;
    thisFinder.step = 1;
    thisFinder.grid = {};
    for(let row = 1; row <= 10; row++) {
      thisFinder.grid[row] = {};
      for(let col = 1; col <= 10; col++) {
        thisFinder.grid[row][col] = false;
      }
    }
    thisFinder.start = null;
    thisFinder.finish = null;
    thisFinder.bestRoute = null; 
    thisFinder.render();
  }

  render() {
    const thisFinder = this;

    let pageData = null;
    switch(thisFinder.step) {
    case 1:
      pageData = { title: 'Draw routes', buttonText: 'Finish drawing' };
      break;
    case 2:
      pageData = { title: 'Pick start and finish', buttonText: 'Compute' };
      break;
    case 3:
      pageData = { title: 'The best route is', buttonText: 'Start again' };
      break;
    default:
      pageData = { title: 'Draw routes', buttonText: 'Finish drawing' };
    }

    const generatedHTML = templates.finderPage(pageData);
    
    thisFinder.element.innerHTML = generatedHTML;
    
    let html = '';
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 10; col++) {
        let classes = 'field';

        if(thisFinder.grid[row][col]){
          classes += ' ' + classNames.finder.active;
        }
        if(thisFinder.start && thisFinder.start.row === row && thisFinder.start.col === col){
          classes += ' ' + classNames.finder.start;
        }
        if(thisFinder.finish && thisFinder.finish.row === row && thisFinder.finish.col === col){
          classes += ' ' + classNames.finder.finish;
        }
        if (thisFinder.bestRoute) {
          for (let i = 0; i < thisFinder.bestRoute.length; i++) {
            const point = thisFinder.bestRoute[i];
            if (point.row === row && point.col === col) {
              classes += ' ' + classNames.finder.best;
              break; // nie trzeba sprawdzać dalej
            }
          }
        }        
        html += '<div class="'+ classes+'"data-row="' + row +'"data-col="' + col +'"></div>';
      }
    }
    // Wstawiamy siatkę do kontenera #finder-grid
    thisFinder.element.querySelector(select.finder.grid).innerHTML = html;
    console.log('Grid selector:', select.finder.grid);

    thisFinder.initActions();
  }

  changeStep(newStep) {
    const thisFinder = this;
    thisFinder.step = newStep;
    thisFinder.render();
  }

  toggleField(fieldElem) {
    const thisFinder = this;

    // pobranie współżednych
    const field = {
      row: parseInt(fieldElem.getAttribute('data-row')),
      col: parseInt(fieldElem.getAttribute('data-col'))
    };
    console.log('--- CLICKED FIELD ---');
    console.log('Row:', field.row, 'Col:', field.col);
    console.log('Current state in grid:', thisFinder.grid[field.row][field.col]);
    // if field with this row and col is true -> unselect it
    if(thisFinder.grid[field.row][field.col]) {
      thisFinder.grid[field.row][field.col] = false;
      fieldElem.classList.remove(classNames.finder.active);
    }

    else {
    // flatten object to array of values e.g. [false, false, false]
      const gridValues = Object.values(thisFinder.grid)
        .map(col => Object.values(col))
        .flat();

      // if grid isn't empty...
      if(gridValues.includes(true)) {
        console.log('Grid is NOT empty → checking neighbors...');

        // determine edge fields
        const edgeFields = [];
        if(field.col > 1) edgeFields.push(thisFinder.grid[field.row][field.col-1]); //get field on the left value
        if(field.col < 10) edgeFields.push(thisFinder.grid[field.row][field.col+1]); //get field on the right value
        if(field.row > 1) edgeFields.push(thisFinder.grid[field.row-1][field.col]); //get field on the top value
        if(field.row < 10) edgeFields.push(thisFinder.grid[field.row+1][field.col]); //get field on the bottom value

        // if clicked field doesn't touch at least one that is already selected -> show alert and finish function
        if(!edgeFields.includes(true)) {
          alert('A new field should touch at least one that is already selected!');
          return;
        }
      }

      // select clicked field
      thisFinder.grid[field.row][field.col] = true;
      fieldElem.classList.add(classNames.finder.active);
      console.log('✅ Field marked as selected in grid and DOM');
      console.log('New state of this field:', thisFinder.grid[field.row][field.col]);
    }
  }

  initActions() {
    const thisFinder = this;

    if (thisFinder.step === 1) {
  
      const submitBtn = thisFinder.element.querySelector(select.finder.submitBtn);
      if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
          e.preventDefault();
          thisFinder.changeStep(2);
        });
      }

      const grid = thisFinder.element.querySelector(select.finder.grid);
      if (grid) {
        grid.addEventListener('click', function(e) {
          if (e.target.classList.contains(classNames.finder.field)) {
            thisFinder.toggleField(e.target);
          }
        });
      }
    }

    else if (thisFinder.step === 2) {
      const submitBtn = thisFinder.element.querySelector(select.finder.submitBtn);
      if (submitBtn) {
        submitBtn.addEventListener('click',function(e){
          e.preventDefault();
          thisFinder.bestRoute = thisFinder.computeBestRoute();
          thisFinder.changeStep(3);
        });
      }
      const grid = thisFinder.element.querySelector(select.finder.grid);
      if(grid) {
        grid.addEventListener ('click', function(e){
          if (e.target.classList.contains(classNames.finder.field)){
            thisFinder.pickStartOrFinish(e.target);
          }
        });
      }
    }

    else if (thisFinder.step === 3) {
      const submitBtn = thisFinder.element.querySelector(select.finder.submitBtn);
      if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
          e.preventDefault();
          // Resetuj wszystko
          thisFinder.step = 1;
          thisFinder.start = null;
          thisFinder.finish = null;
          thisFinder.bestRoute = null;
        
          // Wyczyść grid (wszystkie pola na false)
          for (let row = 1; row <= 10; row++) {
            for (let col = 1; col <= 10; col++) {
              thisFinder.grid[row][col] = false;
            }
          }
        
          thisFinder.render();
        });
      }
    }
  }



  pickStartOrFinish(fieldElem){
    const thisFinder = this;

    const field = {
      row: parseInt(fieldElem.getAttribute('data-row'), 10),
      col: parseInt(fieldElem.getAttribute('data-col'), 10)
    };

    // Pole musi być częścią ścieżki!
    if (!thisFinder.grid[field.row][field.col]) {
      alert('You can only pick start/finish on the drawn route!');
      return;
    }

    // Jeśli jeszcze nie wybrano startu
    if (!thisFinder.start) {
      thisFinder.start = { row: field.row, col: field.col };
      thisFinder.render(); // odśwież widok, by dodać klasę .start
      return;
    }

    // Jeśli start jest wybrany, ale finish nie — i nie klikasz startu ponownie
    if (!thisFinder.finish && !(thisFinder.start.row === field.row && thisFinder.start.col === field.col)) {
      thisFinder.finish = { row: field.row, col: field.col };
      thisFinder.render(); // odśwież, by dodać .finish
      return;
    }

    // Jeśli klikniesz start ponownie — możesz go zmienić
    if (thisFinder.start.row === field.row && thisFinder.start.col === field.col) {
    // Opcjonalnie: pozwól na zmianę startu
    // Na razie nie obsługujemy resetu — ale możesz dodać później
      return;
    }

  // Jeśli finish już jest wybrany — nie rób nic (lub pozwól na zmianę)
  // Dla uproszczenia: nie pozwalamy na zmianę po wybraniu obu
  }

  computeBestRoute() {
    const thisFinder = this;

    if (!thisFinder.start||!thisFinder.finish){
      alert ('Please select both start and finish!');
      return[];
    }

    const visited = [];
    visited.push(thisFinder.start.row +','+thisFinder.start.col);

    const queue = [{
      row: thisFinder.start.row, 
      col: thisFinder.start.col,
      path: [] 
    }];

    const directions = [
      {dr: -1, dc: 0 }, // up
      {dr: 1, dc: 0},// down
      {dr: 0, dc: -1},
      {dr: 0, dc: 1},
    ];

    while (queue.length > 0){
      const current = queue.shift();
      if (current.row === thisFinder.finish.row && current.col === thisFinder.finish.col){
        return current.path.concat({ row: thisFinder.finish.row, col: thisFinder.finish.col});
      }
      for ( let i = 0; i <directions.length; i++) {
        const dir = directions[i];
        const newRow = current.row + dir.dr;
        const newCol = current.col + dir.dc;

        // Czy nowe pole jest poza planszą?
        if (newRow < 1 || newRow > 10 || newCol < 1 || newCol > 10) {
          continue;
        }

        // Czy pole nie jest częścią narysowanej ścieżki?
        if (!thisFinder.grid[newRow][newCol]) {
          continue;
        }

        // Stwórz klucz dla tego pola (zamiast template stringa)
        const key = newRow + ',' + newCol;

        // Czy już odwiedziliśmy to pole?
        if (visited.indexOf(key) !== -1) {
          continue;
        }

        // Zapamiętaj, że tu byliśmy
        visited.push(key);

        // Dodaj nowe pole do kolejki (bez spread operatora)
        const newPath = current.path.slice(); // kopia tablicy
        newPath.push({ row: current.row, col: current.col });

        queue.push({
          row: newRow,
          col: newCol,
          path: newPath
        });
      }
    } 

    // Jeśli pętla się skończyła, a nie znaleźliśmy mety
    alert('No path found between start and finish!');
    return [];
  }
}

export default Finder; 