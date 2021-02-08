// - starting from a spec'd elem
// - for each child elem
//   - create an arr w/ nodeName and [children] elems (#1)
//     - for each of the children
//       - map a new subarr to replace the child elem, as per #1 (recursively)

function nodesToArr() {
  function getter(elem) {
    let subArr = Array.from(elem.children).filter(elem => elem.nodeName !== 'SCRIPT').map(getter);
    return [elem.nodeName, subArr];
  }

  console.log(getter(document.body)); // start from the body
}
