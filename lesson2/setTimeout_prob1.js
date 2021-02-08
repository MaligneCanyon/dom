// function delayLog() {
//   for (var i = 1; i <= 10; i++) {
//     setTimeout(() => {
//       console.log(i); // logs 11, once per second, ten times
//     }, i * 1000);
//   }
// }

// function delayLog() {
//   for (let i = 1; i <= 10; i++) {
//     setTimeout(() => {
//       console.log(i); // logs 1..10
//     }, i * 1000);
//   }
// }

// adapted from the Discussions ...
// this version uses a closure (an IIFE) to encapsulate the current value of i
// function delayLog() {
//   for (var i = 1; i <= 10; i++) {      // this works
//   // for (let i = 1; i <= 10; i++) {   // this works too
//     setTimeout(((j) => {               // closure created to ecapsulate i
//       return () => { console.log(j) }; // returns the function you'd like to call
//     })(i), i * 1000);                  // IIFE, passes current value of i to function
//   }
// }

// this version passes i as an additional arg, which is passed to console.log
function delayLog() {
  for (var i = 1; i <= 10; i++) {
    setTimeout(console.log, i * 1000, i);
  }
}

delayLog();
// 1  // 1 second later
// 2  // 2 seconds later
// 3  // 3 seconds later
// 4  // etc...
// 5
// 6
// 7
// 8
// 9
// 10
