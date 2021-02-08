// pp1
// document.querySelector('main h1').classList.add('heading'); // if avail, should use an id to select a specific elem
// document.querySelector('#primary_heading').classList.add('heading'); // not exactly correct ...
// document.querySelector('#primary_heading').setAttribute('class', 'heading'); // ok ...
document.querySelector('#primary_heading').className = 'heading'; // better ...
// document.getElementById('primary_heading').className = 'heading'; // this works too ...

// pp2
document.getElementById('list').className = 'bulleted';

// pp3
const notice = document.querySelector('#notice'); // do this here, so that it can be re-used in pp4
document.querySelector('#toggle').onclick = (e) => {
  e.preventDefault();
  // if (notice.getAttribute('class') === 'hidden') // won't work if >1 className is present
  //   notice.setAttribute('class', 'visible');
  // else notice.setAttribute('class', 'hidden');
  notice.classList.toggle('hidden');
  notice.classList.toggle('visible');
};

// pp4
notice.onclick = (e) => {
  e.preventDefault();
  // notice.classList.toggle('hidden');
  // notice.classList.toggle('visible');
  notice.className = 'hidden';
};

// pp5
const mult = document.querySelector('#multiplication');
let values = mult.textContent.split(' ').map(word => parseInt(word, 10)).filter(num => !isNaN(num));
mult.textContent += ' ' + String(values.reduce((accum, value) => accum * value, 1));

// pp6
// document.getElementsByTagName('body')[0].setAttribute('id', 'styled'); // this works ...
document.body.id = 'styled'; // this works too; 'body' is a 'document' property
