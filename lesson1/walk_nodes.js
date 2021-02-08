// walk() calls the function "callback" once for each node

// function walk(node, callback) {
//   callback(node);                                                   // do something with node
//   for (let index = 0; index < node.childNodes.length; index += 1) { // for each child node
//     walk(node.childNodes[index], callback);                         // recursively call walk()
//   }
// }

function walk(node, callback) {
  callback(node); // do something with the node
  node.childNodes.forEach(child => walk(child, callback)); // for each child node recursively call walk()
}

// walk(document, node => console.log(node.nodeName)); // log nodeName of every node
// walk(document.body, node => console.log(node.nodeName)); // log nodeName of every node w/i the <body>
