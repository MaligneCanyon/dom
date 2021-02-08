import debounce from './debounce.js'; // part5a

// const Autocomplete = {
class Autocomplete { // part5b
  // wrapInput: function() {
  wrapInput() { // part5b
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  // },
  }

  // createUI: function() {
  createUI() { // part5b
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;

    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  // },
  }

  // bindEvents: function() {
  bindEvents() { // part5b
    // this.input.addEventListener('input', this.valueChanged.bind(this));
    // this.input.addEventListener('input', this.valueChanged); // part5a
    // it's makes more sense to call debounce() here, rather than in init() ...
    this.input.addEventListener('input', debounce(this.valueChanged.bind(this), 300)); // part5a
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.listUI.addEventListener('mousedown', this.handleMousedown.bind(this)); // part4
  // },
  }

  // handleMousedown: function(event) { // part4
  handleMousedown(event) { // part5b
    console.log(`mousedown; event.target: ${event.target.tagName} ${event.target.textContent}`);
    this.input.value = event.target.textContent;
    this.reset();
  // },
  }

  // handleKeydown: function(event) {
  handleKeydown(event) { // part5b
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === this.matches.length - 1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1;
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.selectedIndex === null || this.selectedIndex === 0) {
          this.selectedIndex = this.matches.length - 1;
        } else {
          this.selectedIndex -= 1;
        }
        this.bestMatchIndex = null;
        this.draw();
        break;
      case 'Tab':
        if (this.bestMatchIndex !== null && this.matches.length !== 0) {
          this.input.value = this.matches[this.bestMatchIndex].name;
          event.preventDefault();
        }
        this.reset();
        break;
      case 'Enter':
        this.reset();
        break;
      case 'Escape': // escaped
        this.input.value = this.previousValue;

        // part4; use a partial (instead of a full) reset,
        //   so that the list of matching countries is still present
        // this.reset();
        this.bestMatchIndex = null;
        this.selectedIndex = null;
        this.draw();

        break;
    }
  // },
  }

  // valueChanged: function() {
  valueChanged() { // part5b
    let value = this.input.value;
    this.previousValue = value;

    if (value.length > 0) {
      this.fetchMatches(value, matches => {
        this.visible = true;
        this.matches = matches;
        this.bestMatchIndex = 0;
        this.selectedIndex = null;
        this.draw();
      });
    } else {
      this.reset();
    }
  // },
  }

  // fetchMatches: function(query, callback) {
  fetchMatches(query, callback) { // part5b
    let request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      callback(request.response);
    });

    request.open('GET', `${this.url}${encodeURIComponent(query)}`);
    request.responseType = 'json';
    request.send();
  // },
  }

  // draw: function() {
  draw() { // part5b
    while (this.listUI.lastChild) { // remove all list items obtained from the previous query
      this.listUI.removeChild(this.listUI.lastChild);
    }

    if (!this.visible) {
      this.overlay.textContent = '';
      return;
    }

    // render the appropriate country name inside the input overlay
    if (this.bestMatchIndex !== null && this.matches.length !== 0) {
      let selected = this.matches[this.bestMatchIndex];
      this.overlay.textContent = this.generateOverlayContent(this.input.value, selected);
    } else {
      this.overlay.textContent = '';
    }

    // repopulate listUI with the current set of matched countries that we received from the server
    this.matches.forEach((match, index) => {
      let li = document.createElement('li');
      li.classList.add('autocomplete-ui-choice');

      // part4
      // this works, but it's better to bind the event listener to the listUI elem in bindEvents()
      // li.addEventListener('mousedown', this.handleMousedown.bind(this));

      if (index === this.selectedIndex) {
        li.classList.add('selected');
        this.input.value = match.name;
      }

      li.textContent = match.name;
      this.listUI.appendChild(li);
    });
  // },
  }

  // generateOverlayContent: function(value, match) {
  generateOverlayContent(value, match) { // part5b
    let end = match.name.substr(value.length);
    return value + end;
  // },
  }

  // init/reset obj props and the UI output; set the initial state of our app
  // reset: function() {
  reset() { // part5b
    this.visible = false;
    this.matches = [];
    this.bestMatchIndex = null;
    this.selectedIndex = null;
    this.previousValue = null;

    this.draw();
  // },
  }

  // init: function() {
  constructor(url, input) { // part5b
    this.input = input;
    this.url = url;

    this.listUI = null;
    this.overlay = null;

    this.wrapInput();
    this.createUI();
    // this.valueChanged = debounce(this.valueChanged.bind(this), 300); // part5a; moved to bindEvents()
    this.bindEvents();

    this.reset();
  // },
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Autocomplete.init();
  new Autocomplete('/countries?matching=', document.querySelector('input')); // part5b
});
