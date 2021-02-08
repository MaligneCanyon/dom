function callback1() {
  console.log('callback1');
}

function callback2() {
  console.log('callback2');
}

function callback3() {
  console.log('callback3');
}

function randomizer(...callbacks) {
  if (!callbacks.length) return;

  const maxTime = 2 * callbacks.length;
  callbacks.forEach(cb => {
    setTimeout(cb, Math.floor(Math.random() * maxTime * 1000));
  });

  let time = 0;
  const id = setInterval(() => {
    time++; // imprecise due to processing time
    console.log(time);
    if (time === maxTime) clearInterval(id);
  }, 1000);
}

randomizer(callback1, callback2, callback3);

// Output:
// 1
// 2
// "callback2"
// 3
// "callback3"
// 4
// 5
// "callback1"
// 6
