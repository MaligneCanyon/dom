// find the <body> <header> and move it before <main>
const bodyHeader = document.querySelector('body > header');
const main = document.querySelector('main');
document.body.insertBefore(bodyHeader, main);

// find the <h1> missing from the start of the <body> <header>,
// and move it to the correct location
// const h1 = document.body.getElementsByTagName('h1')[0];
const h1 = document.querySelector("main > h1");
bodyHeader.insertAdjacentElement('afterbegin', h1);

// find the <figure> elems and move them to the end of the <article>,
// reversing the order in which they appear, but leaving the
// <figcaption> elems in the current (correct) order
const figures = document.querySelectorAll('figure');
const figcaptions = document.querySelectorAll('figure figcaption');
const article = document.querySelector('article');
Array.from(figures).reverse().forEach((figure, ndx) => { // reverse the <figure> order
  article.appendChild(figure);
  figure.appendChild(figcaptions[ndx]);
});
