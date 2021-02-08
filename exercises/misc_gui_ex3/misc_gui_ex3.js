todo_items = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John' }
];

document.addEventListener('DOMContentLoaded', event => {
  const todos = document.getElementById('todos');
  let todosTemplate = Handlebars.compile(todos.innerHTML);
  const todo = document.getElementById('todo');
  let todoTemplate = Handlebars.compile(todo.innerHTML);
  Handlebars.registerPartial('todoTemplate', todo.innerHTML);
  // console.log(todos, todos.innerHTML);
  // console.log(todo, todo.innerHTML);

  const ul = document.querySelector('ul');
  // console.log('x1', ul);
  // console.log('x2', { todos: todo_items });
  // console.log('x3', todosTemplate({ todos: todo_items }));
  ul.innerHTML = todosTemplate({ todos: todo_items });

  const modal = document.getElementById('modal');
  const modalYesButton = modal.querySelector('button:nth-of-type(2)');
  const modalNoButton = modal.querySelector('button:nth-of-type(1)');
  const overlay = document.getElementById('overlay');

  // const todoLiAs = ul.getElementsByTagName('a');
  // Array.from(todoLiAs).forEach(liA => liA.addEventListener('click', showModal)); // instead ...
  ul.addEventListener('click', showModal); // ... delegate events to the parent <ul>

  modalYesButton.addEventListener('click', deleteTodo);
  modalNoButton.addEventListener('click', closeOverlays);
  overlay.addEventListener('click', closeOverlays);

  function showModal(event) {
    event.preventDefault();

    if (event.target.nodeName === 'A') { // the link was clicked
      event.stopPropagation();

      modal.style.display = 'block';
      overlay.style.display = 'block';

      // set an id attrib on the modal Yes button
      modalYesButton.dataset.id = event.target.getAttribute('data-id');
      // console.log('yes button id', modalYesButton.getAttribute('data-id'));
    }
  }

  function deleteTodo(event) {
    event.preventDefault();

    // console.log(this, this.getAttribute('data-id'));
    let ndx = todo_items.map(todo => String(todo.id)).indexOf(this.getAttribute('data-id'));
    // console.log({ndx});

    // if we have an EL on each <a>, we should remove it before deleting the corresponding <li>;
    //   if instead we have a single EL on the parent <ul>, then this step isn't req'd
    // todoLiAs[ndx].removeEventListener('click', showModal); // remove the event listener

    todo_items.splice(ndx, 1); // update the list of todo_items
    // ul.innerHTML = todosTemplate({ todos: todo_items }); // better to just remove the <li> directly
    ul.removeChild(ul.children[ndx]); // remove the <li> from the <ul>

    hideOverlays();
  }

  function closeOverlays(event) {
    event.preventDefault();
    hideOverlays();
  }

  function hideOverlays() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
});
