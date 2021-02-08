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
function sendData(url, successCode, data, mode, form) {
  let req = new XMLHttpRequest();

  req.open('POST', url);

  // format the data
  if (mode === 'json') {
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    data = JSON.stringify(data);
  } else if (mode === 'form') {
    data = new FormData(form); // only utilizes form elems w/ a 'name' attrib
  } // add other modes here

  req.addEventListener('load', () => {
    if (req.status === successCode) {
      alert(req.responseText ? req.responseText : `The data was added`);
      if (form) form.reset();
    } else alert(`The data could not be added: ${req.status}\n${req.responseText}`);
  });

  req.addEventListener('error', () => {
    alert('Some sort of comm error occurred');
  });

  req.send(data);
}


// // submit data to the spec'd URL
// function sendData(method, url, format, data, configObj) {
//   // could move all of the args into the configObj ...
//   let { successCode, successFn, successMsg, failureCode, failureFn, failureMsg } = configObj;

//   let req = new XMLHttpRequest();

//   req.open(method, url);

//   // format the data
//   if (format === 'json') {
//     req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
//     data = JSON.stringify(data);
//   } else if (format === 'form') {
//     data = new FormData(form); // only utilizes form elems w/ a 'name' attrib
//   } // add other modes here

//   req.addEventListener('load', () => {
//     if (req.status === successCode) {
//       alert(req.responseText ? req.responseText : successMsg);
//       if (successFn) successFn();
//     } else {
//       alert(`${failureMsg}: ${req.status}\n${req.responseText}`);
//       if (failureFn) failureFn();
//     }
//   });

//   req.addEventListener('error', () => {
//     alert('Some sort of comm error occurred');
//   });

//   req.send(data);
// }
