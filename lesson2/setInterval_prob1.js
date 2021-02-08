(function startCounting() {
  let counter = 1;
  setInterval(() => {
    console.log(counter++);
  }, 1000);
})();
