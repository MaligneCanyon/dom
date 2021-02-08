document.addEventListener('DOMContentLoaded', event => {
  const templates = document.querySelectorAll('script[type="text/x-handlebars"]');
  let templatesObj = {};
  templates.forEach(template => { // compile each template and add the resulting template fn to an obj
    // [template['id']] is the <script> tag id attrib value
    templatesObj[template['id']] = Handlebars.compile(template.innerHTML);
  });
  // console.log(templatesObj);

  let partials = document.querySelectorAll('script[data-type="partial"]');
  // console.log(partials.length);
  // let partialsObj = {};
  partials.forEach(partial => {
    // partialsObj[partial['id']] = Handlebars.compile(partial.innerHTML); // already compiled as a template
    Handlebars.registerPartial(partial['id'], partial.innerHTML);
    // console.log(partial['id']);
    // console.log(partial.innerHTML);
  });

  // step1
  let req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:3000/photos');
  req.addEventListener('load', () => {
    let data;
    if (req.status === 200) {
      data = JSON.parse(req.response);
      // console.log(data);

      let photoNdx = 0; // for the initial photo
      const slides = document.getElementById('slides');
      // 'photos' is the arr name used in the template
      slides.innerHTML = templatesObj['photos']({ photos: data }); // step1a
      const sectionHeader = document.querySelector('section > header');
      sectionHeader.innerHTML = templatesObj['photo_information'](data[photoNdx]); // step1b
      // console.log(sectionHeader.innerHTML);

      // step2
      req = new XMLHttpRequest();
      req.open('GET', `http://localhost:3000/comments?photo_id=${data[photoNdx].id}`);
      req.addEventListener('load', () => {
        let data;
        if (req.status === 200) {
          data = JSON.parse(req.response);

          // console.log(data);
          // const photoComments = document.getElementById('photo_comments');
          const commentsUl = document.querySelector('#comments > ul');

          // 'comments' is the arr name used in the template
          commentsUl.innerHTML = templatesObj['photo_comments']({ comments: data });
          // console.log(commentsUl.innerHTML);
        } else console.log(`Something unexpected happened: ${req.status}`);
      });
      req.addEventListener('error', () => {
        alert('Some sort of comm error occurred');
      });
      req.send();
    } else console.log(`Something unexpected happened: ${req.status}`);
  });
  req.addEventListener('error', () => {
    alert('Some sort of comm error occurred');
  });
  req.send();
});
