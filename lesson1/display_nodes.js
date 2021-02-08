// print the DOM node tree for the document
(function () {
  const indentation = '  ';
  const newline = '&'; // replace newlines with ampersands
  const space = '*'; // replace spaces with asterisks
  let depth = 0;
  let arr = [];

  function getNodeContent(node) {
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
      if (node.nodeType === Node.TEXT_NODE && node.parentNode.nodeName === 'SCRIPT') // script
        return ': _HIDDEN_';
      return ': ' + node.nodeValue.split('').map(char => {
        if (char === '\n') return newline;
        else if (char === ' ') return space;
        else return char;
      }).join('');
    }
    return '';
  }

  function getChildNodes(node) {
    let str = indentation.repeat(depth) + node.nodeName + `${getNodeContent(node)}`;
    arr.push(str);
    if (node.childNodes.length) {
      depth++;
      node.childNodes.forEach(child => arr.concat(getChildNodes(child))); // recursive
      if (depth > 0) depth--;
    }
    return arr;
  }

  // let baseNode = document.getElementsByTagName('html')[0];
  let baseNode = document.querySelector('html');
  arr = getChildNodes(baseNode);
  arr.forEach(elem => console.log(elem));
})();
