document.addEventListener('DOMContentLoaded', event => {
  // let eventListeners = 1;

  // const spans = document.querySelectorAll('main p span'); // not a live collection
  const mainP = document.querySelector('main p');
  const spans = mainP.getElementsByTagName('span');
  // console.log(spans);
  const spansArr = Array.from(spans);

  const buttons = document.querySelectorAll('button');
  const startStopButton = buttons[0];
  const resetButton = buttons[1];

  let running;
  let oldElapsedTime;
  let elapsedTime;
  let timerId;

  // algo:
  // - init running to false
  // - init oldElapsedTime to 0
  // - init elapsedTime to 0
  // - if the startStop button is clicked
  //   - if running is true
  //     - set running to false
  //     - reset the interval timer
  //     - chg the startStop button text to 'start'
  //     - save the elapsedTime
  //       - oldElapsedTime = elapsedTime
  //   - else
  //     - set running to true
  //     - chg the startStop button text to 'stop'
  //     - set the initialTime to now
  //     - run an interval timer
  //       - calc the elapsedTime
  //         - elapsedTime = oldElapsedTime + currentTime - initialTime
  //       - display the elapsedTime
  // - if the reset button is clicked
  //   - set running to false
  //   - reset the interval timer
  //   - chg the startStop button text to 'start'
  //   - set the oldElapsedTime to 0
  //   - set elapsedTime to 0

  reset();

  startStopButton.addEventListener('click', event => {
    event.preventDefault();

    if (running) {
      running = false;
      // console.log({timerId});
      clearInterval(timerId);
      event.target.textContent = 'Start';
      oldElapsedTime = elapsedTime;
    } else {
      running = true;
      event.target.textContent = 'Stop';
      let initialTime = new Date().getTime();

      // run an interval timer and update the displayed time every 1 centisecond
      timerId = setInterval(() => {
        let currentTime = new Date().getTime(); // get the current time
        elapsedTime = oldElapsedTime + currentTime - initialTime; // calc the elapsed time

        const MILLISECONDS_PER_CENTISECOND = 10;
        const MILLISECONDS_PER_SECOND = 1000;
        const MILLISECONDS_PER_MINUTE = 60000;
        const MILLISECONDS_PER_HOUR = 3600000;

        let hours = Math.floor(elapsedTime / MILLISECONDS_PER_HOUR);
        let minutes = Math.floor((elapsedTime % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE);
        let seconds = Math.floor((elapsedTime % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND);
        let centiseconds = Math.floor((elapsedTime % MILLISECONDS_PER_SECOND) / MILLISECONDS_PER_CENTISECOND);

        let timeArr = [hours, minutes, seconds, centiseconds];
        // console.log(time);

        spansArr.forEach((span, ndx) => span.textContent = padWithZeros(timeArr[ndx]));
      }, 10);
      // console.log({timerId});
    }
    // console.log({running});
  });
  // eventListeners++;
  // console.log({eventListeners});

  resetButton.addEventListener('click', event => {
    event.preventDefault();

    // console.log({timerId});
    clearInterval(timerId);
    reset();
  });
  // eventListeners++;
  // console.log({eventListeners});

  // (re-)initialize the displayed values and the timer counters
  function reset() {
    spansArr.forEach((span, ndx) => span.textContent = '00');
    startStopButton.textContent = 'Start';
    running = false;
    oldElapsedTime = 0;
    elapsedTime = 0;
  }
});

// pad the input value w/ zeros and rtn the padded str
function padWithZeros(value) {
  const CHARS = 2;
  let str = String(value); // in case the arg was a num

  while (str.length < CHARS) str = '0' + str;
  return str;
}
