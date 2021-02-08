document.addEventListener('DOMContentLoaded', event => {
  const submitButton = document.querySelector('input[type="submit"]');
  submitButton.addEventListener('click', event => {
    event.preventDefault();

    let num1 = parseFloat(document.getElementById('first-number').value, 10);
    let num2 = parseFloat(document.getElementById('second-number').value, 10);
    let operator = document.getElementById('operator').value;
    const result = document.getElementById('result');
    let calculated = Calculate[operator](num1, num2);
    // console.log({calculated}); // Note: fp roundoff errs occur; could use parseInt instead
    result.innerHTML = String(calculated);
  });
});

let Calculate = {
  '+': (num1, num2) => num1 + num2,
  '-': (num1, num2) => num1 - num2,
  '*': (num1, num2) => num1 * num2,
  '/': (num1, num2) => num1 / num2,
}
