function myCB (delay) {
  console.log(`we waited for ${delay} seconds`);
}

function afterNSeconds(cb, duration) {
  // w/o using setTimeout ...
  // let initialTime = Date.now();
  // while (true) {
  //   if ((Date.now() - initialTime) / 1000 >= duration) {
  //     cb(duration);
  //     break;
  //   }
  // }

  // using setTimeout ...
  setTimeout(cb, duration * 1000, duration);
}

afterNSeconds(myCB, 5);
