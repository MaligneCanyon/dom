function nodeSwap(id1, id2) {
  const node1 = document.getElementById(String(id1));
  const node2 = document.getElementById(String(id2));

  // if (node1 && node2 && !isChildOf(node1, node2) && !isChildOf(node2, node1)) { // this works ...
  // if (node1 && node2 && isSibling(node1, node2)) { // ... this works too
  if (node1 && node2 && !node1.contains(node2) && !node2.contains(node1)) { // ... this also works

    // 1. copy the 1st node
    // 2. replace node2 w/ the node1 copy
    // 3. replace node1 w/ node2
    const copy = node1.cloneNode(true);
    return !!(node2.parentNode.replaceChild(copy, node2) &&
      node1.parentNode.replaceChild(node2, node1)); // rtn T or F based on successful node replacement
  }

  return undefined;
}

// function isChildOf(nodeA, nodeB) {
//   return Array.from(nodeA.childNodes).includes(nodeB);
// }

// function isSibling(nodeA, nodeB) {
//   return Array.from(nodeA.parentNode.childNodes).includes(nodeB);
// }
