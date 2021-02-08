const languages = [
  {
    name: 'Ruby',
    description: 'Ruby is a dynamic, reflective, object-oriented, ' +
    'general-purpose programming language. It was designed and developed in the mid-1990s ' +
    'by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, ' +
    'Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, ' +
    'including functional, object-oriented, and imperative. It also has a dynamic type ' +
    'system and automatic memory management.'
  },

  {
    name: 'JavaScript',
    description: 'JavaScript is a high-level, dynamic, untyped, and interpreted ' +
    'programming language. It has been standardized in the ECMAScript language ' +
    'specification. Alongside HTML and CSS, JavaScript is one of the three core ' +
    'technologies of World Wide Web content production; the majority of websites employ ' +
    'it, and all modern Web browsers support it without the need for plug-ins. JavaScript ' +
    'is prototype-based with first-class functions, making it a multi-paradigm language, ' +
    'supporting object-oriented, imperative, and functional programming styles.'
  },

  {
    name: 'Ruff',
    description: 'Ruff is a programming language for dogs, primarily used to develop apps ' +
    'for tracking cats and squirrels.'
  },

  {
    name: 'Lisp',
    description: 'Lisp (historically, LISP) is a family of computer programming languages ' +
    'with a long history and a distinctive, fully parenthesized prefix notation. ' +
    'Originally specified in 1958, Lisp is the second-oldest high-level programming ' +
    'language in widespread use today. Only Fortran is older, by one year. Lisp has changed ' +
    'since its early days, and many dialects have existed over its history. Today, the best '+
    'known general-purpose Lisp dialects are Common Lisp and Scheme.'
  }
];
const shortStrLength = 120;

document.addEventListener('DOMContentLoaded', event => {
  const langs = document.getElementById('langs');
  let langsTemplate = Handlebars.compile(langs.innerHTML);
  const lang = document.getElementById('lang');
  let langTemplate = Handlebars.compile(lang.innerHTML);
  Handlebars.registerPartial('langTemplate', lang.innerHTML);
  // console.log(langs, langs.innerHTML);
  // console.log(lang, lang.innerHTML);

  const main = document.querySelector('main');
  // console.log('x1', main);
  // console.log('x2', { langs: languages });
  // console.log('x3', langsTemplate({ langs: languages }));
  let arr = languages.map(language => {
    return { name: language.name, description: shortStr(language.description) };
  });
  // console.log('arr:', arr);
  main.innerHTML = langsTemplate({ langs: arr });

  // when a button is clicked, adjust the button text and paragraph length
  //   based on the state of the button
  const sections = main.querySelectorAll('section');
  let buttonStates = Array.from(sections).map(() => false); // a buttonState for each section
  // console.log(buttonStates);
  sections.forEach((section, ndx) => {
    const p = section.querySelector('p');
    const button = section.querySelector('button');
    if (languages[ndx].description.length > shortStrLength) { // provide a clickable button
      button.addEventListener('click', event => {
        event.preventDefault();
        buttonState = buttonStates[ndx];
        // console.log(`buttonStates[${ndx}]:`, buttonState);
        if (buttonState) {
          button.innerHTML = 'Show More';
          p.innerHTML = shortStr(languages[ndx].description);
        } else {
          button.innerHTML = 'Show Less';
          p.innerHTML = languages[ndx].description;
        }
        buttonStates[ndx] = !buttonStates[ndx];
      });
    } else { // no button req'd
      button.style.display = 'none';
      p.innerHTML = languages[ndx].description;
      p.style.paddingBottom = 0; // remove the padding btwn the <p> and the non-existant button
    }
  });
});

function shortStr(str) {
  return str.slice(0, shortStrLength) + ' ...';
}
