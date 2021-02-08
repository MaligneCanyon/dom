document.addEventListener('DOMContentLoaded', () => { // step1
  let answer; // step2
  const form = document.querySelector('form'); // step3
  const guessElem = document.querySelector('#guess'); // step3
  let message; // step4
  const msgElem = document.querySelector('main p'); // step7
  let count; // step10
  const submitButton = document.querySelector('input[type="submit"]'); // step11b

  function initGame() { // step9
    answer = Math.floor(Math.random() * 100) + 1; // 1..100 // step2
    msgElem.textContent = 'Guess an integer from 1 to 100'; // step8
    count = 0; // step10
    if (form.classList.contains('disabled')) { // step11b
      form.classList.remove('disabled');
      submitButton.disabled = false;
    }
    form.reset(); // from the Solution // clears the text entry field
  }

  initGame(); // step9; runs on startup

  // step3
  // submitButton.addEventListener('click', event => { // preferable to use the form 'submit' event
  form.addEventListener('submit', event => {
    event.preventDefault();
    let guess = parseInt(guessElem.value, 10);
    if (String(guess) !== guessElem.value) message = 'Hey, that\'s not an integer; try again'; // step11a
    else {
      count++; // step10

      if (guess > answer) message = `The answer is lower than ${guess}`; // step5
      else if (guess < answer) message = `The answer is higher than ${guess}`; // step6
      // else message = `The answer is ${guess} !`; // step6

      else { // step11b
        message = `The answer is ${guess} !  It took you ${count} guesses !`; // step10
        form.classList.add('disabled'); // use CSS to style disabled form components
        submitButton.disabled = true;
      }
    }

    msgElem.textContent = message; // step7
  });

  // step8
  const newGameLink = document.querySelector('a');
  newGameLink.addEventListener('click', event => {
    // step10
    // in the Solution, the msgElem is def'd w/i the form event handler, so it
    // wouldn't be avail w/i this cb; instead, msgElem can be def'd in the
    // DOMContentLoaded handler
    initGame(); // step9
  });
});
