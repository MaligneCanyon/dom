(function startCounting() {
  let counter = 1;
  let id = setInterval(() => {
    console.log(counter++);
    if (counter > 8) stopCounting(id);
  }, 1000);
})();

function stopCounting(id) {
  clearInterval(id);
}
