// - document.createElement(tagName) rtns a new Element node
// - document.createTextNode(text) rtns a new Text node
// - parent.appendChild(node) appends node to end of parent.childNodes

// Note: the text nodes apparently aren't req'd
function arrayToNodes(arr) {
  // let depth = 0; // req'd for text nodes

  function creator(arr, parent = document.body) {
    // let text;
    // let textNode;
    let elemName = arr[0].toLowerCase();
    let elem;

    // console.log(elemName);
    if (elemName === 'body') elem = parent;
    else {
      elem = document.createElement(elemName);
      parent.appendChild(elem);
    }
    // console.log(elem);

    // if (arr[1].length) {
      // depth++;
      // text = '\n' + '  '.repeat(depth);
      // textNode = document.createTextNode(text);
      // elem.appendChild(textNode);
      arr[1].forEach(subArr => creator(subArr, elem)); // recursive
      // depth--;
    // }
  }

  creator(arr);
}

// // Empty body
// const nodes = ["BODY",[]];
// arrayToNodes(nodes);
// // <body></body>


// Nested array of nodes
const nodes = ["BODY",[["HEADER",[]],["MAIN",[]],["FOOTER",[]]]];
// OR
//
// ["BODY", [
//   ["HEADER", []],
//   ["MAIN", []],
//   ["FOOTER", []]]]
arrayToNodes(nodes);
// <body>
//   <header></header>
//   <main></main>
//   <footer></footer>
// </body>


// // Nested array of nodes
// const nodes = ["BODY",[["DIV",[["DIV",[]],["DIV",[["DIV",[]]]]]],["DIV",[]],["DIV",[["DIV",[]],["DIV",[]],["DIV",[]]]]]];
// // OR
// //
// // ["BODY", [
// //   ["DIV", [
// //     ["DIV", []],
// //     ["DIV", [
// //       ["DIV",[]]]]]],
// //   ["DIV", []],
// //   ["DIV", [
// //     ["DIV", []],
// //     ["DIV", []],
// //     ["DIV", []]]]]]
// arrayToNodes(nodes);
// // <body>
// //   <div>
// //     <div></div>
// //     <div>
// //       <div></div>
// //     </div>
// //   </div>
// //   <div></div>
// //   <div>
// //     <div></div>
// //     <div></div>
// //     <div></div>
// //   </div>
// // </body>
