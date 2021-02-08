todo_items = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John' }
];

document.addEventListener('DOMContentLoaded', event => {
  // let eventListeners = 1;

  const todos = document.getElementById('todos');
  let todosTemplate = Handlebars.compile(todos.innerHTML);
  const todo = document.getElementById('todo');
  let todoTemplate = Handlebars.compile(todo.innerHTML);
  Handlebars.registerPartial('todoTemplate', todo.innerHTML);
  // console.log(todos, todos.innerHTML);
  // console.log(todo, todo.innerHTML);

  const mainUl = document.querySelector('main ul');
  // console.log('x1', mainUl);
  // console.log('x2', { todos: todo_items });
  // console.log('x3', todosTemplate({ todos: todo_items }));
  mainUl.innerHTML = todosTemplate({ todos: todo_items });

  mainUl.addEventListener('contextmenu', event => event.preventDefault()); // prevent the std context menu from appearing
  mainUl.addEventListener('auxclick', showContext); // upon a right-click, display a custom context menu
  // eventListeners += 2;
  // console.log({eventListeners});

  const contextMenu = document.getElementById('contextMenu');
  const contextMenuLinks = contextMenu.querySelectorAll('a');
  const deleteLink = contextMenuLinks[2];
  deleteLink.addEventListener('click', showModal);
  // eventListeners++;
  // console.log({eventListeners});

  const modal = document.getElementById('modal');
  const modalYesButton = modal.querySelector('button:nth-of-type(2)');
  const modalNoButton = modal.querySelector('button:nth-of-type(1)');
  const overlay = document.getElementById('overlay');

  modalYesButton.addEventListener('click', deleteTodo);
  modalNoButton.addEventListener('click', closeOverlays);
  overlay.addEventListener('click', closeOverlays);
  // eventListeners += 3;
  // console.log({eventListeners});

  function showContext(event) {
    event.preventDefault();

    if (event.target.nodeName === 'LI') { // the <li> was right-clicked
      event.stopPropagation();

      // display the context menu at the pt where the user clicked the <li>
      // console.log('clientX:', event.clientX, 'clientY:', event.clientY);
      contextMenu.style.left = String(event.clientX) + 'px';
      contextMenu.style.top = String(event.clientY) + 'px';

      contextMenu.style.display = 'block';
      // although it's transparent, the overlay is present to allow closing of the contextMenu
      overlay.style.opacity = 0;
      overlay.style.display = 'block';

      deleteLink.dataset.id = event.target.getAttribute('data-id'); // set an id attrib
      // console.log('deleteLink', deleteLink);
    }
  }

  function showModal(event) {
    event.preventDefault();

    contextMenu.style.display = 'none';
    modal.style.display = 'block';
    overlay.style.opacity = 0.5; // as per the CSS file
    overlay.style.display = 'block';

    modalYesButton.dataset.id = event.target.getAttribute('data-id'); // set an id attrib
    // console.log('modalYesButton', modalYesButton);
  }

  function deleteTodo(event) {
    event.preventDefault();

    // console.log(this, this.getAttribute('data-id'));
    let ndx = todo_items.map(todo => String(todo.id)).indexOf(this.getAttribute('data-id'));
    // console.log({ndx});

    todo_items.splice(ndx, 1); // update the list of todo_items
    mainUl.removeChild(mainUl.children[ndx]); // remove the <li> from the <main> <ul>

    hideOverlays();
  }

  function closeOverlays(event) {
    event.preventDefault();
    hideOverlays();
  }

  function hideOverlays() {
    contextMenu.style.display = 'none';
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }
});
