document.addEventListener('DOMContentLoaded', event => {
  // const p = document.getElementById('p1');
  // console.log(p, p.textContent, p.style.color, p.getAttribute('color'), p1.color, p.getAttribute('id'));
  //   //=> logs: <p id="p1">, "Test", <empty string>, null, undefined, "p1"
  // console.log(p.style.color); //=> <empty string>, even though it's actually 'lightblue'
  // console.log(window.getComputedStyle(p, null).color); //=> 'rgb(173, 216, 230)'; aka 'lightblue'
  // p.style.color = 'orange'; // changes the text color to orange
  // console.log(p.style.color); //=> 'orange';

  const main = document.querySelector('main');
  main.addEventListener('pointerover', event => { // could use the 'mouseover' event
    const target = event.target;
    // console.log(target);
    if (target.nodeName === 'IMG') {
      event.stopPropagation();
      const imgHeight = window.getComputedStyle(target, null).height;
      const figcaption = target.nextElementSibling;
      figcaption.style.top = String(parseInt(imgHeight, 10) + 20) + 'px';
      // console.log(figcaption.style.top);

      figcaption.classList.remove('hide');
      figcaption.classList.add('show');
    }
  });

  main.addEventListener('pointerout', event => { // could use the 'mouseout' event
    const target = event.target;
    // console.log(target);
    if (target.nodeName === 'IMG') {
      event.stopPropagation();
      const figcaption = target.nextElementSibling;

      figcaption.classList.remove('show');
      figcaption.classList.add('hide');
    }
  });
});
