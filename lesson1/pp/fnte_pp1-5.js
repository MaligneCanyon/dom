// pp1
let arr = Array.from(document.querySelectorAll('h2')).map(elem => {
  return elem.textContent.split(' ').length;
});
console.log(arr);


// pp2
let elems = document.querySelectorAll('div.toc');
console.log(elems.length); //=> 1
console.log(elems[0]);
elems = document.getElementsByClassName('toc');
console.log(elems.length); //=> 1
console.log(elems[0]);
const toc = document.getElementById('toc');
console.log(toc);


// pp3
// Array.from(document.querySelectorAll('.toc a')).forEach((elem, ndx) => {
toc.querySelectorAll('a').forEach((link, ndx) => {
  if (ndx % 2) link.style.color = 'green';
});


// pp4
elems = Array.from(document.querySelectorAll('div.thumbcaption')).map(elem => {
  return elem.textContent.trim();
});
console.log(elems);


// pp5
const keys = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
let obj = {};
document.querySelectorAll('td').forEach((elem, ndx, arr) => { // don't need ndx or arr for (2) or (3)
  let text = elem.textContent.trim().slice(0, -1);
  if (keys.includes(text)) {
    // obj[text] = arr[ndx + 1].textContent; // this works ... (1)
    // obj[text] = elem.nextElementSibling.firstElementChild.textContent; // this works too ... (2)

    // since textContent extracts text from all child nodes ...
    obj[text] = elem.nextElementSibling.textContent; // ... this also works (3)
  }
});
console.log(obj);
