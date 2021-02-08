// let func;

// pp5
// let imgs = 0;
// let pngs = 0;
// func = function (node) {
//   if (node.nodeName === 'IMG') {
//     imgs++;
//     if (node.getAttribute('src').slice(-3) === 'png') pngs++;
//   }
// };
// walk(document, func);
const imgElems = document.getElementsByTagName('img');
let imgs = imgElems.length;
let pngs = Array.from(imgElems).filter(img => img.getAttribute('src').endsWith('png')).length;
console.log(`imgs: ${imgs}, pngs: ${pngs}`);

// pp6
// func = function (node) {
//   if (node.nodeName === 'A') node.style.color = 'red';
// }
// walk(document, func);
const linkElems = document.getElementsByTagName('a');
Array.from(linkElems).forEach(link => link.style.color = 'red');
