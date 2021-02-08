document.addEventListener('DOMContentLoaded', event => {
  const baseURL = 'http://localhost:3000/';

  const templates = document.querySelectorAll('script[type="text/x-handlebars"]');
  let templatesObj = {};
  templates.forEach(template => { // compile each template and add the resulting template fn to an obj
    // [template['id']] is the <script> tag id attrib value
    templatesObj[template['id']] = Handlebars.compile(template.innerHTML);
  });
  // console.log(templatesObj);

  let partials = document.querySelectorAll('script[data-type="partial"]');
  // console.log(partials.length);
  partials.forEach(partial => {
    Handlebars.registerPartial(partial['id'], partial.innerHTML);
    // console.log(partial['id']);
    // console.log(partial.innerHTML);
  });

  const slides = document.getElementById('slides');
  const sectionHeader = document.querySelector('section > header');
  const commentsUl = document.querySelector('#comments > ul');

  // step1
  fetch(baseURL + 'photos')
  .then(resp => resp.json())
  .then(data => {
    // console.log(data);

    let photoNdx = 0; // for the initial photo
    // 'photos' is the arr name used in the template
    slides.innerHTML = templatesObj['photos']({ photos: data }); // step1a
    sectionHeader.innerHTML = templatesObj['photo_information'](data[photoNdx]); // step1b
    // console.log(sectionHeader.innerHTML);

    // // step2 // step3; moved to a separate fn 'getComments'; also invoked in loadData()
    // fetch(baseURL + `comments?photo_id=${data[photoNdx].id}`)
    // .then(resp => resp.json())
    // .then(data => {
    //   console.log(data);
    //   // const photoComments = document.getElementById('photo_comments');
    //   const commentsUl = document.querySelector('#comments > ul');

    //   // 'comments' is the arr name used in the template
    //   commentsUl.innerHTML = templatesObj['photo_comments']({ comments: data });
    //   // console.log(commentsUl.innerHTML);
    // })
    // .catch(error => alert('Some sort of comm error occurred'));
    getComments(photoNdx); // get the initial set of comments

    // step3
    // if the next photo is selected ... move to the next photo
    const next = document.querySelector('#slideshow a.next');
    next.addEventListener('click', event => loadData('next', event));
    // if the prev photo is selected ... move to the prev photo
    const prev = document.querySelector('#slideshow a.prev');
    prev.addEventListener('click', event => loadData('prev', event));

    // step3
    const maxPhotoNdx = data.length - 1;

    // step3
    // move to another photo and retrieve the info and comments for it
    function loadData(mode, event) {
      event.preventDefault(); // prevent the browser from navigating to the link's href
      // console.log(mode + ' button clicked');

      // set the className to 'hide' for the old first figure (i.e. the old photo)
      let firstFigure = slides.querySelector('figure');
      firstFigure.classList.remove('show');
      firstFigure.classList.add('hide');

      if (mode === 'next') { // move the firstFigure to the end
        slides.appendChild(firstFigure);
        if (++photoNdx > maxPhotoNdx) photoNdx = 0;
      } else /*if (mode === 'prev')*/ { // move the lastFigure to the beginning
        const lastFigure = slides.querySelector('figure:last-of-type');
        slides.insertBefore(lastFigure, firstFigure);
        if (--photoNdx < 0) photoNdx = maxPhotoNdx;
      }

      // set the className to 'show' for the new first figure (i.e. the new photo)
      firstFigure = slides.querySelector('figure');
      firstFigure.classList.remove('hide');
      firstFigure.classList.add('show');

      getComments(photoNdx);
      updateSectionHeader(photoNdx); // step4
    }

    // step3
    // retrieve the comments for a specific photo
    function getComments(photoNdx) {
      fetch(baseURL + `comments?photo_id=${data[photoNdx].id}`)
      .then(resp => resp.json())
      .then(data => {
        // console.log(data);

        // 'comments' is the arr name used in the template
        commentsUl.innerHTML = templatesObj['photo_comments']({ comments: data });
        // console.log(commentsUl.innerHTML);
      })
      .catch(error => alert('Some sort of comm error occurred'));
    }

    // step4
    // if the 'likes' or 'favorites' button is selected ... update the 'likes' or 'favorites' count;
    // each photo has its own 'likes' and 'favorites' button, so every time a new photo is selected
    //   or a new sectionHeader template is rendered, need to remove the current 'likes' event
    //   listener, and add one for the new photo/template; ditto for 'favorites'
    setListeners(photoNdx, 'add'); // initially add listeners

    // step4
    function setListeners(photoNdx, mode) {
      setListener(photoNdx, mode, 'likes');
      setListener(photoNdx, mode, 'favorites');
    }

    // step4
    function setListener(photoNdx, mode, prop) {
      let target = document.querySelector(`.actions a[data-property=${prop}]`);
      // console.log({photoNdx, mode, prop, target});
      let func = event => userPreferences(prop, photoNdx, event);
      // console.log(`${mode} event listener for:`, target);
      if (mode === 'add') target.addEventListener('click', func);
      else /*if (mode === 'remove')*/ target.removeEventListener('click', func);
    }

    // step4
    function userPreferences(mode, photoNdx, event) {
      event.preventDefault(); // prevent nav
      // console.log(`"${mode}" click event fired`);
      // console.log({mode, photoNdx});
      let reqData = { photo_id: `${data[photoNdx].id}` };
      // console.log({reqData});
      let url = baseURL + 'photos/' + mode.slice(0, -1);
      // console.log({url});
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(reqData),
      })
      .then(resp => resp.json())
      .then(respData => {
        // console.log(respData);
        data[photoNdx][mode] = respData.total;
        // console.log(data[photoNdx]);

        // if you exec the next line, the click event listener for 'likes' is no
        //   longer bound to the link, since a brand new link has been created
        // sectionHeader.innerHTML = templatesObj['photo_information'](data[photoNdx]);
        updateSectionHeader(photoNdx);
      })
      .catch(error => alert('Some sort of comm error occurred'));
    }

    // step4
    // update the section header for a specific photo
    // Note: the Solution just updates the button text for the appropriate button,
    //   w/o having to remove and re-add the event listeners (a much simpler approach)
    //   i.e. button.textContent = text.replace(/\d+/, json.total);
    function updateSectionHeader(photoNdx) {
      // remove the existing 'likes' and 'favorites' button event listeners
      setListeners(photoNdx, 'remove');

      // console.log({photoNdx});
      sectionHeader.innerHTML = templatesObj['photo_information'](data[photoNdx]);
      // console.log(sectionHeader.innerHTML);

      // add new 'likes' and 'favorites' button event listeners
      setListeners(photoNdx, 'add');
    }

    // step5
    // add a new comment
    const form = document.querySelector('form');
    form.addEventListener('submit', event => addComment(photoNdx, event));

    // step5
    // add a new comment via the form and update the list of comments
    function addComment(photoNdx, event) {
      event.preventDefault(); // prevent browser form submit
      // console.log('submit event fired');

      const reqData = new FormData(form); // utilizes form elems w/ a 'name' attrib
      // console.log(form);
      // console.log({reqData});
      const url = baseURL + 'comments/new'; // could use value from the <form> "action" attrib
      // let url = baseURL + form.getAttribute('action').slice(1);
      // console.log({url});

      reqData.set('photo_id', `${data[photoNdx].id}`); // could use the value from the photo's "data-id" attrib

      fetch(url, {
        method: 'POST', // could use the value from the <form> "method" attrib
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: new URLSearchParams([...reqData]), // query str format, but sent in the req body
      })
      .then(resp => resp.json())
      .then(respData => {
        // console.log(respData);

        // could either just read in the comments again ...
        // getComments(photoNdx); // get the new set of comments

        // ... or just append the new comment to the existing ones
        // console.log(templatesObj['photo_comment'](respData));
        commentsUl.insertAdjacentHTML('beforeend', templatesObj['photo_comment'](respData));

        form.reset();
      })
      .catch(error => alert('Some sort of comm error occurred'));
    }
  })
  .catch(error => alert('Some sort of comm error occurred'));
});
