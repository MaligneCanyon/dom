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
  partials.forEach(partial => {
    Handlebars.registerPartial(partial['id'], partial.innerHTML);
    // console.log(partial['id']);
    // console.log(partial.innerHTML);
  });

  // step1
  fetch('http://localhost:3000/photos')
  .then(resp => resp.json())
  .then(data => {
    // console.log(data);

    let photoNdx = 0; // for the initial photo
    const slides = document.getElementById('slides');
    // 'photos' is the arr name used in the template
    slides.innerHTML = templatesObj['photos']({ photos: data }); // step1a
    const sectionHeader = document.querySelector('section > header');
    sectionHeader.innerHTML = templatesObj['photo_information'](data[photoNdx]); // step1b
    // console.log(sectionHeader.innerHTML);

    // step2
    fetch(`http://localhost:3000/comments?photo_id=${data[photoNdx].id}`)
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      // const photoComments = document.getElementById('photo_comments');
      const commentsUl = document.querySelector('#comments > ul');

      // 'comments' is the arr name used in the template
      commentsUl.innerHTML = templatesObj['photo_comments']({ comments: data });
      // console.log(commentsUl.innerHTML);
    })
    .catch(error => alert('Some sort of comm error occurred'));
  })
  .catch(error => alert('Some sort of comm error occurred'));
});
