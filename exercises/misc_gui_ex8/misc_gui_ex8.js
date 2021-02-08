document.addEventListener('DOMContentLoaded', event => {
  const exprElem = document.querySelector('p.expr');
  const entryElem = document.querySelector('p.entry');
  const keypad = document.getElementById('keypad');
  const operators = document.querySelectorAll('button.operators');
  // console.log(operators);
  const ops = Array.from(operators).map(op => op.textContent);
  // console.log(ops);

  let result;
  let lastKey;
  let entry;
  let expr;

  reset();

  keypad.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    let target = event.target;
    // console.log(target.nodeName);
    let classList = target.classList;

    if (target.nodeName === 'BUTTON') {
      // console.log(classList[0]);

      if (classList.contains('resets')) {
        if (target.textContent === 'CE') resetEntry();
        else /*if (target.textContent === 'C')*/ reset();
      }

      else if (classList.contains('moderators')) {
        if (target.textContent === '.') {
          if (!entry.includes('.')) entry += '.';
        } else /*if (target.textContent === '+/-')*/ { // aka the 'NEG' button
          if (entry !== '0')
            entry = entry.startsWith('-') ? entry.slice(1) : '-' + entry;
        }
        // console.log({entry});
        entryElem.textContent = entry;
      }

      else if (classList.contains('numbers')) {
        let digit = target.textContent;
        // console.log({digit});

        if (entry === '0' || ops.some(op => op === lastKey)) entry = digit;
        else entry += digit;
        // console.log({entry});
        entryElem.textContent = entry;
      }

      else if (classList.contains('operators')) {
        let op = target.textContent;
        // console.log({op});

        if (expr.some(elem => ops.includes(elem))) {
          // console.log('old op found');
          expr.push(entry);
          expr.push(op);
          result = String(Calculate[expr[expr.length - 3]](Number(result), Number(expr[expr.length - 2])));
          entry = result;
          if (op === '=') expr = [];
          exprElem.textContent = expr.join(' ');
          entryElem.textContent = entry;
        } else if (op !== '=') {
          // console.log('no old op found');
          result = entry;
          expr.push(entry);
          expr.push(op);
          exprElem.textContent = expr.join(' ');
        }
        // console.log({entry});
      }

      lastKey = target.textContent;
    }
  });

  function reset() {
    resetEntry();
    resetExpr();
  }

  function resetEntry() {
    lastKey = '';
    entry = '0';
    entryElem.textContent = entry;
  }

  function resetExpr() {
    expr = [];
    exprElem.textContent = '';
  }
});

const Calculate = {
  '+': (num1, num2) => num1 + num2,
  '-': (num1, num2) => num1 - num2,
  '*': (num1, num2) => num1 * num2,
  '/': (num1, num2) => num1 / num2,
  '%': (num1, num2) => num1 % num2,
}; // invocation syntax: Calculate[op](num1, num2);
