// algo:
// x- display an initial list of contacts
// x- if the "Add contact" button is clicked
//   x- replace the list of contacts w/ the "contact" form
//   x- chg the form title to "Create contact"
//   x- if a form field is selected
//     x- chg the border colour for the field to blue-grey
//     x- add a blue-grey shadow to the field
//   x- if a form field is de-selected
//     x- chg the border colour for the field to grey
//     x- remove the blue-grey shadow from the field
//   x- if the "cancel" button is clicked
//     x- reset the form
//     x- replace the "contact" form w/ the list of contacts
//   x- if the "submit" button is clicked
//     x- validate all fields (note: ph# is not validated other than non-empty)
//     x- if all fields are valid
//       x- submit the form via xhr
//       n- clear any err msg for each field ?
//       n- chg the font colour for the field label to black ?
//       n- chg the border colour for the field to black ?
//       x- replace the "contact" form w/ the list of contacts
//       x- clear the searchStr
//     x- else
//       x- display an err msg for each invalid field
//       x- chg the font colour for the field label to red
//       x- chg the border colour for the field to red
//       x- add a red shadow to the field
// x- if the "Search" input is selected
//   x- chg the border colour for the field to blue-grey
//   x- add a blue-grey shadow to the field
//   x- add a blue shadow to the input field
//   x- move the cursor to the start of the input
//   x- if a char is entered
//     x- add it to a searchStr
//     x- filter the displayed list of contacts based on the searchStr
//       x- if there are no matching contacts
//         x- display a msg
// x- if the "Search" input is de-selected
//   x- chg the border colour for the field to grey
//   x- remove the blue-grey shadow from the field
// x- if a contact "Delete" button is clicked
//   x- display a confirmation prompt
//   x- if "Ok" is selected
//     x- Delete the contact via xhr
//     x- if there are no remaining contacts
//       x- display a msg
// x- if a contact "Edit" button is clicked
//   x- replace the list of contacts w/ the "contact" form
//   x- chg the form title to "Edit contact"
//   x- pop the form fields w/ the existing contact data
//   x- ... remaining functionality as per "Create contact" ...
// x- if a new tag is selected from the dropdown list of tags
//   x- if the form is hidden
//     x- filter the list of contacts based on the selected tag
//   x- else if the form is visible
//     x- add the selected tag to the tags input field

class Input {
  constructor(id, defaultValue = '') {
    this.elem = document.getElementById(id);
    this.errorElem = document.querySelector(`#${id} ~ span.error`);
    this.default = defaultValue;
  }
}

const fontWeightLight = 'lighter';
const fontWeightHeavy = 'bolder';

document.addEventListener('DOMContentLoaded', event => {
  const url = "http://localhost:3000/api/contacts";
  let contact_items = [];

  // should use a Class structure ...
  // let fullName = {
  //   elem: document.getElementById('full_name'),
  //   errorElem: document.querySelector('#full_name ~ span.error'),
  //   default: '',
  // };
  // let email = {
  //   elem: document.getElementById('email'),
  //   errorElem: document.querySelector('#email ~ span.error'),
  //   default: '',
  // };
  // let phoneNumber = {
  //   elem: document.getElementById('phone_number'),
  //   errorElem: document.querySelector('#phone_number ~ span.error'),
  //   default: '',
  // };
  // let tags = {
  //   elem: document.getElementById('tags'),
  //   errorElem: document.querySelector('#tags ~ span.error'),
  //   default: '',
  // };
  let fullName = new Input('full_name');
  let email = new Input('email');
  let phoneNumber = new Input('phone_number');
  let tags = new Input('tags');


  const inputFields = [ // list all form elems to be evaluated
    fullName,
    email,
    phoneNumber,
    tags
  ];


  // // send some dummy data ... there's already sample data in the db
  // fetch(url, {
  //   method: 'POST'
  //   headers: { 'Content-Type': 'application/json', },
  //   body: JSON.stringify({
  //     full_name: "Test One",
  //     email: "test@one.com",
  //     phone_number: "1234567",
  //     tags: "tag1,tag2",
  //   }),
  // })
  // .then(resp => {
  //   if (resp.status === 201) console.log('success');
  // })
  // .catch(err => {
  //   console.error('error:', error);
  // })


  // set up the HB templates // unused ! ***
  const contacts = document.getElementById('contacts');
  let contactsTemplate = Handlebars.compile(contacts.innerHTML);
  const contact = document.getElementById('contact');
  let contactTemplate = Handlebars.compile(contact.innerHTML);
  Handlebars.registerPartial('contactTemplate', contact.innerHTML);


  const ul = document.querySelector('ul');
  const mainDiv = document.querySelector('main div');
  const form = document.querySelector('form');
  const formH2 = form.querySelector('h2');
  const tagList1 = document.getElementById('tagList1');
  const tagList2 = document.getElementById('tagList2');


  // handle droplist tag selection w/i the form
  tagList2.addEventListener('change', event => {
    event.preventDefault();
    // log(event);

    let selectedTag = event.target.value;
    // console.log(selectedTag);
    if (selectedTag !== 'None') {
      // if (form.classList.contains('visible')) { // always true when tagList2 is available
        if (tags.elem.value) tags.elem.value += ', ';
        tags.elem.value += selectedTag;
        // console.log(tags.elem, tags.elem.value);
      // }
    }
  });


  // display an initial list of contacts
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    contact_items = data;
    // console.log(data);

    // render the template
    ul.innerHTML = contactsTemplate({ contacts: contact_items });
    // console.log('x1', ul);
    // console.log('x2', { contacts: contact_items });
    // console.log('x3', contactsTemplate({ contacts: contact_items }));
    // console.log('x4', ul.innerHTML);

    createDropList(tagList1);
    section3.className = contact_items.length ? 'hidden' : 'visible';
  });


  // handle droplist "Tag" selection w/i section1
  let selectedTag = 'None';
  tagList1.addEventListener('change', event => {
    event.preventDefault();
    // log(event);

    selectedTag = event.target.value;
    // if (form.classList.contains('hidden')) // always true when tagList1 is available
      updateDisplayedContacts();
  });


  // handle li button clicks
  ul.addEventListener('click', event => {
    event.preventDefault();
    // log(event);

    const target = event.target;
    if (target.nodeName === "BUTTON") {
      event.stopPropagation();
      if (target.textContent === "Delete") {
        // handle contact deletion
        let answer = confirm('Do you want to delete the contact ?');
        if (answer) deleteContact(target.parentNode);
      } else if (target.textContent === "Edit") {
        // handle display of the editContact form
        updateContact(target.parentNode);
      }
    }
  });


  // handle display of the addContact form
  const addContactButton = document.querySelector('#section1 button');
  addContactButton.addEventListener('click', event => {
    event.preventDefault();
    // log(event);

    inputFields.forEach(inputField => hideError(inputField)); // clear any err indicators
    formH2.textContent = 'Create Contact';
    showForm();
  });


  // handle form cancellation
  const formCancelButton = form.querySelector('button[type="reset"]');
  formCancelButton.addEventListener('click', event => {
    event.preventDefault();
    // log(event);

    hideForm();
  });


  // handle form submission
  form.addEventListener('submit', event => {
    event.preventDefault(); // prevent the form from being submitted
    // log(event);

    // if all fields are valid, serialize the form data
    // console.log('allFieldsValid:', allFieldsValid());
    if (allFieldsValid()) {
      inputFields.forEach(inputField => hideError(inputField)); // reset any error msgs

      // const data = new FormData(); // doesn't work; the server reqs json-formatted data
      const data = {
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        tags: document.getElementById('tags').value,
      };

      const mode = formH2.textContent.startsWith('Create');

      // send the XHR data
      if (mode) {
        const configObj = {
          successCode: 201,
          successFn:   showNewContact,
          // successMsg: 'The contact was added',
          failureMsg: 'The contact could not be added',
        };
        sendData('POST', url, 'json', data, configObj);
      } else {
        data.id = form.dataset.id;
        const configObj = {
          successCode: 201,
          successFn:   showUpdatedContact,
          // successMsg: 'The contact was updated',
          failureMsg: 'The contact could not be updated',
        };
        sendData('PUT', url  + `/${data.id}`, 'json', data, configObj);
      }
    } else {
      // if an input field is invalid, display an appropriate error message for that field
      inputFields.forEach(inputField => showError(inputField));
    }
  });


  // handle search field selection
  // const searchInputField = {
  //   elem: document.querySelector('#section1 input'),
  //   errorElem: null,
  //   default: 'Search',
  // };
  const searchInputField = new Input('search', 'Search');
  searchInputField.elem.value = searchInputField.default;
  addFocusInListener(searchInputField);
  addFocusOutListener(searchInputField);


  // handle search field data entry
  let searchStr = '';
  searchInputField.elem.addEventListener('keydown', event => {
    event.stopPropagation();

    const target = event.target;
    // disallow unwanted keys; otherwise, clear the default value (if one was
    // present) and build a searchStr
    if (/[a-zA-Z0-9' -]/.test(event.key) && event.key.length === 1) {
      if (target.value === searchInputField.default) {
        target.value = '';
        target.style.fontWeight = fontWeightHeavy;
      }
      // console.log(target.style.fontWeight);
      searchStr += event.key;
    } else if (event.key === 'Backspace') searchStr = searchStr.slice(0, -1);
    else event.preventDefault();
    // console.log(searchStr);

    updateDisplayedContacts();
  });


  function updateDisplayedContacts() {
    // update the displayed list of contacts
    let filtered_contacts = contact_items.filter(contact => {
      let searchStrCriteriaMet =
        !searchStr || contact.full_name.toLowerCase().includes(searchStr.toLowerCase());
      let tagCriteriaMet =
        selectedTag === 'None' || contact.tags.includes(selectedTag);
      // console.log(searchStrCriteriaMet, tagCriteriaMet);
      return searchStrCriteriaMet && tagCriteriaMet;
    });
    // console.log(filtered_contacts);

    ul.innerHTML = contactsTemplate({ contacts: filtered_contacts });

    // update misc messaging
    const section3 = document.getElementById('section3');
    if (filtered_contacts.length) {
      section3.className = 'hidden';
    } else {
      const span = section3.querySelector('span');
      span.textContent = searchStr ? ' containing ' : '';
      const bold = section3.querySelector('b');
      bold.textContent = searchStr;
      section3.className = 'visible';
    }
  }


  // handle form field selection
  inputFields.forEach(inputField => {
    addFocusInListener(inputField);
    addFocusOutListener(inputField);
  });


  // prevent the default behaviour of the Tab key (only while using the form);
  // it adversely affects the border colour for tabbed inputs (despite CSS settings ?)
  const formSubmitButton = form.querySelector('button[type="submit"]');
  const inputElems = inputFields.map(inputField => inputField.elem);
  inputElems.push(tagList2, formSubmitButton, formCancelButton);
  document.addEventListener('keydown', event => {
    if (/(Tab)/.test(event.key) && form.classList.contains('visible')) {
      event.preventDefault();
      event.stopPropagation();

      let focusNdx = inputElems.indexOf(document.activeElement);
      // console.log({focusNdx});
      focusNdx++; // this also works if focusNdx was previously -1
      if (focusNdx === inputElems.length) focusNdx = 0;
      inputElems[focusNdx].focus(); // set focus to the next input field
    }
  });


  const $sliders = $('.sliders'); // use jQ to show/hide the form

  function showForm(contact = null) {
    // mainDiv.classList.replace('visible', 'hidden');
    // form.classList.replace('hidden', 'visible');
    $sliders.slideToggle(600, function () {
      mainDiv.classList.replace('visible', 'hidden');
      form.classList.replace('hidden', 'visible');
    });

    createDropList(tagList2); // update the form's "tag" droplist

    if (contact) {
      inputFields[0].elem.value = contact.full_name;
      inputFields[1].elem.value = contact.email;
      inputFields[2].elem.value = contact.phone_number;
      inputFields[3].elem.value = contact.tags;
    } else form.reset(); // clear the form
  }

  function hideForm() {
    form.reset();

    // form.classList.replace('visible', 'hidden');
    // mainDiv.classList.replace('hidden', 'visible');
    $sliders.slideToggle(600, function () {
      form.classList.replace('visible', 'hidden');
      mainDiv.classList.replace('hidden', 'visible');
    });

    // reset the searchInputField and searchStr
    searchInputField.elem.value = searchInputField.default;
    searchInputField.elem.style.fontWeight = fontWeightLight;
    searchStr = '';

    // reset the list of displayed contacts to the full list
    ul.innerHTML = contactsTemplate({ contacts: contact_items }); // render the template
    section3.className = 'hidden'; // hide section3
    createDropList(tagList1); // update section1's tag droplist
  }

  function allFieldsValid() {
    return inputFields.every(inputField => inputField.elem.checkValidity());
  }

  function showNewContact(newData) {
    let data = JSON.parse(newData);
    contact_items.push(data);
    // console.log(contactTemplate(data));

    // the following line is n/r; the ul will be rebuilt in hideForm()
    // ul.insertAdjacentHTML('beforeend', contactTemplate(data));
    hideForm();
  }

  function deleteContact(li) {
    let id = Number(li.dataset.id);
    // find the ndx of the elem in the contact_items arr
    let ndx = findNdx(contact_items, id);
    // console.log({ndx});
    if (ndx < 0) console.log('could not find the elem');
    else {
      // remove the contact from 1. the server db, 2. the browser html, 3. the arr

      // submit the data
      let configObj = {
        successCode: 204,
        // successMsg: 'The contact was deleted',
        failureMsg: 'The contact could not be deleted',
      };

      sendData("DELETE", url + `/${id}`, 'json', { id }, configObj);
      li.remove();
      contact_items.splice(ndx, 1);
      section3.className = contact_items.length ? 'hidden' : 'visible';
    }
  }

  function updateContact(li) {
    let id = Number(li.dataset.id);
    // find the ndx of the elem in the contact_items arr
    let ndx = findNdx(contact_items, id);
    // console.log({ndx});
    if (ndx < 0) console.log('could not find the elem');
    else {
      form.dataset.id = String(id);
      formH2.textContent = 'Edit Contact';
      let contact = contact_items[ndx];
      showForm(contact);
    }
  }

  function showUpdatedContact(newData) {
    let newContact = JSON.parse(newData);
    let id = Number(form.dataset.id);
    // find the ndx of the elem in the contact_items arr
    let ndx = findNdx(contact_items, id);
    // console.log({ndx});
    if (ndx < 0) console.log('could not find the elem');
    else {
      // update the contact in 1. the server db (already done), 2. the browser
      // html (done in hideForm(), 3. the arr

      // the following is n/r; the ul is rebuild in hideForm()
      // const li = ul.children[ndx]; // bug: ndx is incorrect if the contact list is filtered
      // console.log(li);
      // const newLi = document.createElement('li');
      // newLi.insertAdjacentHTML('afterbegin', contactTemplate(newContact));
      // ul.replaceChild(newLi, li);

      contact_items.splice(ndx, 1, newContact);
      // console.log(contact_items);
      hideForm();
    }
  }

  // build a dropdown list of unique tags:
  // - init a unique_tags arr to []
  // - for each contact
  //   - split the value of the "tags" property into a list of tags
  //   - for each tag
  //     - if the unique_tags arr doesnt contain the tag
  //       - add the tag to the unique_tags arr
  // - sort the unique_tags list alphabetically
  // - build a list of options for the select tags
  function createDropList(tagList) {
    let unique_tags = [];
    contact_items.forEach(contact => {
      // console.log(contact.tags);
      contact.tags.split(',').forEach(tag => {
        tag = tag.trim();
        if (tag && !unique_tags.includes(tag)) unique_tags.push(tag);
      });
    });
    unique_tags.sort();
    // console.log(unique_tags);

    // get rid of any old list of possible choices
    let options = tagList.querySelectorAll('option');
    for (let ndx = options.length - 1; ndx > 0; ndx--) {
      tagList.removeChild(options[ndx]);
    }

    unique_tags.forEach(tag => {
      const option = document.createElement('option');
      option.append(tag);
      tagList.appendChild(option);
    });
  }
});


function log(e) {
  console.log(`${e.type} event fired on ${e.target}`);
}


function addFocusInListener(inputField) {
  inputField.elem.addEventListener('focusin', event => {
    event.preventDefault();
    // log(event);

    const target = event.target;
    target.classList.add('selected');
    // console.log(target.className);

    if (target.value && target.value === inputField.default) {
      // don't clear the default text until the user starts typing
      // (see the searchInputField 'keydown' event);
      // move the cursor to the start of the default text
      target.setSelectionRange(0, 0); // Note: raises an exception w/ "email" type inputs
      target.style.fontWeight = fontWeightLight;
    } else
      target.style.fontWeight = fontWeightHeavy;
  });
}


function addFocusOutListener(inputField) {
  inputField.elem.addEventListener('focusout', event => {
    event.preventDefault();
    // log(event);

    const target = event.target;
    target.classList.remove('selected');

    // (re-)add the default value to an empty field
    if (!target.value) target.value = inputField.default;
    target.style.fontWeight = fontWeightLight;
  });
}


function hideError(inputField) {
  inputField.errorElem.textContent = ''; // Reset the content of the message
  inputField.errorElem.className = 'error'; // Reset the visual state of the message
  inputField.elem.className = ''; // Reset the visual state of the input field ...
  inputField.elem.previousElementSibling.className = ''; // ... and the label
  // inputField.elem.parentNode.firstElementChild.className = ''; // better perhaps ?
}


function showError(inputField) {
  // Set the styling appropriately
  // console.log(inputField.elem.id);
  inputField.errorElem.className = 'error active';
  inputField.elem.className = 'active';
  inputField.elem.previousElementSibling.className = 'active'; // the label

  if (inputField.elem.required && (inputField.elem.validity.valueMissing ||
    inputField.elem.value === inputField.default)) {
    // console.log('required field');
    inputField.errorElem.textContent = `Please enter a valid ${inputField.elem.name}.`;
  } else if (inputField.elem.validity.patternMismatch) {
    // console.log('patternMismatch');
    inputField.errorElem.textContent = `Please enter a valid ${inputField.elem.name}.`;
  } else { // no error
    // console.log('no error');
    hideError(inputField);
  }
}


// get data from the spec'd url and do something w/ it (invoke the cb func)
function getData(url, successCode, func, asynch = true) {
  let req = new XMLHttpRequest();

  req.open('GET', url, asynch); // Note: synchronous mode is deprecated

  req.addEventListener('load', () => {
    let data;
    if (req.status === successCode) {
      data = JSON.parse(req.response);
      func(data);
    } else console.log(`Something unexpected happened: ${req.status}`);
  });

  req.addEventListener('error', () => {
    alert('Some sort of comm error occurred');
  });

  req.send();
}


// submit data to the spec'd URL
function sendData(method, url, format, data, configObj) {
  // could move all of the args into the configObj ...
  let { successCode, successFn, successMsg, failureCode, failureFn, failureMsg } = configObj;

  let req = new XMLHttpRequest();

  req.open(method, url);

  // format the data
  if (format === 'json') {
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    data = JSON.stringify(data);
  } else if (format === 'form') {
    data = new FormData(form); // only utilizes form elems w/ a 'name' attrib
  } // add other modes here

  req.addEventListener('load', () => {
    if (req.status === successCode) {
      if (successMsg) alert(successMsg);
      if (successFn) successFn(req.responseText);
    } else {
      alert(`${failureMsg ? failureMsg + ': ' : ''}${req.status}\n${req.responseText}`);
      if (failureFn) failureFn();
    }
  });

  req.addEventListener('error', () => {
    alert('Some sort of comm error occurred');
  });

  req.send(data);
}


// find the ndx of an Element in an arr of Elements, based on the elem's id
function findNdx(arr, id) {
  for (let ndx = 0; ndx < arr.length; ndx++) {
    // console.log(arr[ndx], arr[ndx].id, id);
    if (arr[ndx].id === id) return ndx;
  }

  return -1;
}
