document.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementsByTagName('form')[0];
  const formError = form.firstElementChild;

  // could use a Class structure ...
  let first_name = {
    elem: document.getElementById('first_name'),
    errorElem: document.querySelector('#first_name + span.error'),
    default: '',
  }
  let last_name = {
    elem: document.getElementById('last_name'),
    errorElem: document.querySelector('#last_name + span.error'),
    default: '',
  }
  let email = {
    elem: document.getElementById('email'),
    errorElem: document.querySelector('#email + span.error'),
    default: "someone@example.com",
  }
  let pswd = {
    elem: document.getElementById('pswd'),
    errorElem: document.querySelector('#pswd + span.error'),
    default: '',
  }
  let phone = {
    elem: document.getElementById('phone'),
    errorElem: document.querySelector('#phone + span.error'),
    default: "111-222-3333",
  }

  let cc0 = { // ex2b
    elem: document.getElementById('cc0'),
    errorElem: document.querySelector('#cc0 ~ span.error'), // all cc elems use a common sibling errorElem
    default: '',
  }
  let cc1 = {
    elem: document.getElementById('cc1'),
    errorElem: document.querySelector('#cc0 ~ span.error'),
    default: '',
  }
  let cc2 = {
    elem: document.getElementById('cc2'),
    errorElem: document.querySelector('#cc0 ~ span.error'),
    default: '',
  }
  let cc3 = {
    elem: document.getElementById('cc3'),
    errorElem: document.querySelector('#cc0 ~ span.error'),
    default: '',
  }

  // const inputFields = [first_name, last_name, email, pswd, phone];
  const inputFields = [ // list all elems to be validated
    first_name,
    last_name,
    email,
    pswd,
    phone,
    cc0, cc1, cc2, cc3 // ex2b
  ];

  // prevent the default behaviour of the Tab key;
  // it adversely affects the border colour for tabbed inputs (despite CSS settings ?)
  const inputElems = inputFields.map(inputField => inputField.elem);
  document.addEventListener('keydown', event => {
    if (/(Tab)/.test(event.key)) {
      event.preventDefault();

      let focusNdx = inputElems.indexOf(document.activeElement);
      // console.log({focusNdx});
      focusNdx++; // this also works if focusNdx was previously -1
      if (focusNdx === inputElems.length) focusNdx = 0;
      inputElems[focusNdx].focus(); // set focus to the next input field
    }
  });

  // reset the form and load default values
  form.reset();
  email.elem.value = email.default;
  phone.elem.value = phone.default;

  // add an event listener for the form submit button
  form.addEventListener('submit', event => {
    // // if all fields are valid, let the form submit
    // // (in case it's showing) hide the overall form readiness msg if all input fields are valid
    // if (allFieldsValid()) formError.style.visibility = 'hidden';
    // else {
    //   event.preventDefault(); // prevent the form from being submitted
    //   formError.style.visibility = 'visible';
    //   // If an input field is invalid, display an appropriate error message
    //   inputFields.forEach(inputField => showError(inputField));
    // }

    // ex4
    event.preventDefault(); // prevent the form from being submitted
    // if all fields are valid, serialize the form data and store it in a query str
    // console.log('allFieldsValid:', allFieldsValid());
    if (allFieldsValid()) {
      const footerP = document.querySelector('footer p');
      const target = event.target;
      const data = new FormData();

      // set the queryStr param values; use '' instead of any default value
      inputFields.slice(0, 5).forEach(inputField => { // the first 4 input fields
        let queryStrValue =
          (inputField.elem.value === inputField.default) ? '' : inputField.elem.value;
        data.set(inputField.elem.id, queryStrValue); // 'id' is the <input> id attrib value
      });

      // build the Credit Card #
      // let ccNum = inputElems.slice(-4).reduce((accum, elem) => accum + elem.value, ''); // cryptic !
      let ccNum = '';
      inputElems.slice(-4).forEach(elem => ccNum += elem.value);
      // console.log({ccNum});
      data.set('credit_card', ccNum);

      // send the XHR data
      // target.action and target.method as per the form attrib values in the .html file
      let reqBody = new URLSearchParams([...data]);
      // console.log(reqBody); // a URLSearchParams obj
      fetch(target.action, {
        method: target.method,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: reqBody,
      })
      // .then(resp => resp.json()) // n/r
      // .then(data => console.log('success:', data)) // n/r
      .catch(error => console.log('error:', error))

      formError.style.visibility = 'hidden'; // hide the overall form readiness msg
      // in reality should reset the form (and not display the serialized data)
      footerP.textContent = reqBody.toString();
    } else {
      formError.style.visibility = 'visible'; // display the overall form readiness msg
      // If an input field is invalid, display an appropriate error message for that field
      inputFields.forEach(inputField => showError(inputField));
    }
  });

  // add event listeners for each of the input fields // could use event delegation ***
  inputFields.forEach(inputField => {
    addFocusInListener(inputField);
    addFocusOutListener(inputField);

    let fieldName = inputField.elem.name;
    if (fieldName.endsWith('st Name')) // ex2a
      addKeyPressListener(inputField, /[a-zA-Z'\s]/); // Note: whitespace chars incl Backspace
    else if (fieldName === "Credit Card") { // ex2b
      addKeyPressListener(inputField, /[0-9]|(Backspace)/); // check for digit or Backspace keys
      if (/[0-2]/.test(inputField.elem.id.slice(-1))) // ex3b; the first 3 cc fields
        addInputListener(inputField);
    } else if (fieldName === 'Phone Number') {
      addKeyPressListener(inputField, /[0-9-]|(Backspace)/); // check for digit, hyphen or Backspace keys
    } else addKeyPressListener(inputField);
  });

  function allFieldsValid() {
    return validCreditCardNum() && inputFields.every(inputField => inputField.elem.checkValidity());
  }

  function addInputListener(inputField) { // ex3b
    inputField.elem.addEventListener('input', event => {
      event.preventDefault(); // req'd ?
      const target = event.target;
      if (target.value.length === 4) // 4 digit have been entered
        target.nextElementSibling.focus(); // set the focus to the next sibling elem
    });
  }

  function addKeyPressListener(inputField, pattern = null) { // ex2
    // console.log('keypress for ', inputField.elem.name);
    inputField.elem.addEventListener('keydown', event => { // 'keypress' is deprecated
      // if a pattern is provided, disallow unwanted keys;
      // otherwise, clear the default value (if one was present);
      // 'pattern' here refers to the fn arg (i.e. not the .html file 'pattern' attrib)
      if (pattern && !pattern.test(event.key)) event.preventDefault();
      else if (event.target.value === inputField.default) event.target.value = '';
    });
  }

  function addFocusInListener(inputField) {
    inputField.elem.addEventListener('focusin', event => {
      // console.log('focusin');
      event.preventDefault();

      hideError(inputField); // hide the err msg while the user edits the input field

      const target = event.target;
      if (target.value === inputField.default) {
        // shouldn't clear the default text until the user starts typing (see
        // addKeyPressListener());
        // move the cursor to the start of the default text
        target.setSelectionRange(0, 0); // Note: raises an exception w/ "email" type inputs
        target.style.fontWeight = 'normal';
      }
    });
  }

  function addFocusOutListener(inputField) {
    inputField.elem.addEventListener('focusout', event => {
      // console.log('focusout');
      event.preventDefault();

      const target = event.target;
      // console.log(target, target.name, target.validity.valid);
      if (target.validity.valid) {
        // If an error message is visible, if the field is valid, remove the error message
        hideError(inputField);
      } else {
        // If there is still an error, show the correct error
        showError(inputField);
      }

      // if one exists, (re-)add the default value to an empty field
      if (inputField.default && !target.value) {
        target.value = inputField.default;
        target.style.fontWeight = 'lighter';
      }

      // (in case it's showing) hide the overall form readiness msg if all input fields are now valid
      if (allFieldsValid()) formError.style.visibility = 'hidden';
    });
  }

  function validCreditCardNum() { // ex2b
    // Ensure that all credit card inputs are valid.
    // The credit card num is an all-or-none proposition:
    //   to be valid, either all segments contain 4 digits or none of them do;
    //   checkValidity() tests the validity of individual segments (done in
    //   allFieldsValid() instead of here)
    const ccFields = inputFields.slice(-4); // the last 4 input fields
    let valid = /*ccFields.every(inputField => inputField.elem.checkValidity()) &&*/
      (ccFields.every(inputField => inputField.elem.value.length === 0) ||
       ccFields.every(inputField => inputField.elem.value.length === 4));
    // console.log('validCreditCardNum:', valid);

    // side-effects:
    ccFields.forEach(inputField => {
      if (valid) hideError(inputField);
      else {
        inputField.errorElem.className = 'error active';
        inputField.errorElem.textContent = 'All Credit Card segments must have 4 digits.';
        inputField.elem.className = inputField.elem.value.length === 4 ? '' : 'active';
      }
    });

    return valid;
  }

  function hideError(inputField) {
    inputField.errorElem.textContent = ''; // Reset the content of the message
    inputField.errorElem.className = 'error'; // Reset the visual state of the message
    inputField.elem.className = ''; // Reset the visual state of the input field
  }

  function showError(inputField) {
    // Set the styling appropriately
    inputField.errorElem.className = 'error active';
    inputField.elem.className = 'active';

    if (inputField.elem.required && (inputField.elem.validity.valueMissing ||
      inputField.elem.value === inputField.default)) {
      // console.log('required field');
      inputField.errorElem.textContent = `${inputField.elem.name} is a required field.`;
    } else if (inputField.elem.validity.patternMismatch) {
      // console.log('patternMismatch');
      inputField.errorElem.textContent = (inputField.elem.name === 'Password') ?
        'Password must be at least 10 characters long.' :
        `Please enter a valid ${inputField.elem.name}.`;
    } else {
      inputField.elem.className = '';
    }
  }
});
