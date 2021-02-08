// let func;

// pp1
// func = function (node) {
//   if (node.nodeName === 'H1' && node.firstChild.nodeValue === 'On the River') {
//     node.style.color = 'lightblue';
//     node.style.fontSize = '48px';
//   }
// };
// walk(document, func);
const h1 = document.body.firstElementChild;
h1.style.color = 'red';
h1.style.fontSize = '48px';

// pp2
// let count = 0;
// func = function (node) {
//   if (node.nodeName === 'P') count++;
// };
// walk(document, func);
// console.log(count);
const ps = document.getElementsByTagName('p');
console.log(ps.length);

// pp3
// let arr = [];
// func = function (node) {
//   if (node.nodeName === 'P') {
//     // arr.push(node.firstChild.nodeValue.split(' ').filter(elem => /\w/.test(elem))[0]); // this works ...
//     // arr.push(node.firstChild.nodeValue.trim().split(' ')[0]); // this works too ...
//     arr.push(node.firstChild.data.trim().split(' ')[0]); // this also works ...
//   }
// };
// walk(document, func);
let arr = Array.from(ps).map(elem => elem.textContent.trim().split(' ')[0]);
console.log(arr);

// pp4
// let first = true;
// func = function (node) {
//   if (node.nodeName === 'P') {
//     if (first) first = false;
//     else {
//       node.classList.add('georgeCostanza'); // close enough ...
//       console.log(node);
//     }
//   }
// };
// walk(document, func);
Array.from(ps).forEach((parag, ndx) => {
  if (ndx) parag.classList.add('stanza');
});
