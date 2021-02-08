document.addEventListener('DOMContentLoaded', () => {
  const ul = document.getElementById('grocery-list');
  const form = document.querySelector('form');
  const submitButton = document.querySelector('input[type="submit"]');
  submitButton.addEventListener('click', event => {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let quantity = document.getElementById('quantity').value;
    // console.log({name, quantity});
    if (!quantity || !(/[0-9]/).test(quantity)) quantity = '1'; // allow something like '2lbs'
    if (name) {
      const li = document.createElement('li');
      li.append(quantity + ' ' + name);
      ul.appendChild(li);
      form.reset();
    } else alert('No item name provided');
  });
});
