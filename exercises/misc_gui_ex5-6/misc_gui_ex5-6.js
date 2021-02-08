const car_items = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

document.addEventListener('DOMContentLoaded', event => {
  // let eventListeners = 1;

  const cars = document.getElementById('cars');
  let carsTemplate = Handlebars.compile(cars.innerHTML);
  const car = document.getElementById('car');
  let carTemplate = Handlebars.compile(car.innerHTML);
  Handlebars.registerPartial('carTemplate', car.innerHTML);
  // console.log(cars, cars.innerHTML);
  // console.log(car, car.innerHTML);

  const mainUl = document.querySelector('main ul');
  // console.log('x1', mainUl);
  // console.log('x2', { cars: car_items });
  // console.log('x3', carsTemplate({ cars: car_items }));
  mainUl.innerHTML = carsTemplate({ cars: car_items });

  // create a droplist for vehicle make
  // const make = document.getElementById('make');
  // let carMakes = uniqueElems(car_items.map(car => car.make));
  // carMakes.forEach(carMake => {
  //   const option = document.createElement('option');
  //   option.append(carMake);
  //   make.appendChild(option);
  // });
  createDropList('make');
  createDropList('model');
  createDropList('price');
  createDropList('year');

  const filterButton = document.querySelector('header div button');
  filterButton.addEventListener('click', event => {
    event.preventDefault();

    mainUl.innerHTML = carsTemplate({ cars: filterCars(car_items) });
  });
  // eventListeners++;
  // console.log({eventListeners});

  // revise the 'model' droplist if the selected 'make' changes // ex6
  const make = document.getElementById('make');
  make.addEventListener('change', event => {
    event.preventDefault();

    const selectedMake = event.target.value;
    let selectableModels = [];

    car_items.forEach(car => {
      if (selectedMake === 'All' || selectedMake === car.make)
        selectableModels.push(car.model);
    });
    // console.log(selectableModels);

    createDropList('model', selectableModels);
  });
  // eventListeners++;
  // console.log({eventListeners});

  // function createDropList(criteria) {
  function createDropList(criteria, criteriaValues = car_items.map(car => car[criteria])) { // ex6
    const criteriaElem = document.getElementById(criteria);

    // get rid of any old list of possible choices // ex6
    const options = criteriaElem.querySelectorAll('option');
    for (let ndx = options.length - 1; ndx > 0; ndx--) {
      criteriaElem.removeChild(options[ndx]);
    }

    criteriaValues = uniqueElems(criteriaValues);
    criteriaValues.forEach(criteriaValue => {
      const option = document.createElement('option');
      option.append(criteriaValue);
      criteriaElem.appendChild(option);
    });
  }

  // rtn the unique elems of an arr
  function uniqueElems(arr) {
    let newArr = [];
    arr.forEach(elem => { if (!newArr.includes(elem)) newArr.push(elem); });
    return newArr;
  }

  function filterCars(cars) {
    // reqs:
    //   - given a list of car objs
    //   - filter the list, based on selected criteria, and rtn a new list
    //   - ex. criteria is "make"

    // console.log(cars);
    cars = cars.filter(car => {
      // console.log(make.value, car.make);
      if (make.value === 'All') return true;
      return make.value === car.make;
    }).filter(car => {
      if (model.value === 'All') return true;
      return model.value === car.model;
    }).filter(car => {
      if (price.value === 'Any') return true;
      return price.value === String(car.price);
    }).filter(car => {
      if (year.value === 'Any') return true;
      return year.value === String(car.year);
    });
    // console.log(cars);

    return cars;
  }
});
