// const questions = [
const question_items = [
  {
    id: 1,
    description: "Who is the author of <cite>The Hitchhiker's Guide to the Galaxy</cite>?",
    options: ['Dan Simmons', 'Douglas Adams', 'Stephen Fry', 'Robert A. Heinlein'],
  },
  {
    id: 2,
    // description: 'Which of the following numbers is the answer to Life, the \
    //               Universe and Everything?',
    description: 'Which of the following numbers is the answer to Life, the ' +
                 'Universe and Everything?',
    options: ['66', '13', '111', '42'],
  },
  {
    id: 3,
    description: 'What is a Pan Galactic Gargle Blaster?',
    options: ['A drink', 'A machine', 'A creature', 'None of the above'],
  },
  {
    id: 4,
    description: 'Which star system does Ford Prefect belong to?',
    options: ['Aldebaran', 'Algol', 'Betelgeuse', 'Alpha Centauri'],
  },
];
const answerKey = { '1': 'Douglas Adams', '2': '42', '3': 'A drink', '4': 'Betelgeuse' };

document.addEventListener('DOMContentLoaded', event => {
  const questions = document.getElementById('questions');
  let questionsTemplate = Handlebars.compile(questions.innerHTML);
  const question = document.getElementById('question');
  let questionTemplate = Handlebars.compile( question.innerHTML);
  Handlebars.registerPartial('questionTemplate', question.innerHTML);

  const form = document.querySelector('main form');
  const fieldsets = form.getElementsByTagName('fieldset');
  const submitButton = document.querySelector('button[type="submit"]');
  const resetButton = document.querySelector('button[type="reset"]');
  console.log('x1', form);
  console.log('x2', { questions: question_items });
  console.log('x3', questionsTemplate({ questions: question_items }));

  // render the template
  form.innerHTML = questionsTemplate({ questions: question_items });
  console.log('x4', form.innerHTML);

  // move the buttons into the form
  form.append(submitButton);
  form.append(resetButton);

  // handle form submission
  form.addEventListener('submit', event => {
    event.preventDefault();

    // change the button styling
    submitButton.className = '';
    resetButton.className = 'active';

    // evaluate the user selections
    Array.from(fieldsets).forEach(fieldset => {
      let id = fieldset.getAttribute("data-id");
      const checkedInput = fieldset.querySelector('input:checked');
      const p = fieldset.querySelector('p');
      p.style.visibility = 'visible';
      if (checkedInput && checkedInput.value === answerKey[id]) {
          p.textContent = "Correct Answer.";
          p.className = 'correct';
      } else {
        p.textContent = (checkedInput ? "Wrong Answer" : "You didn't answer this question") +
          `. The correct answer is: "${answerKey[id]}".`;
        p.className = 'wrong';
      }
    });
  });

  // handle form reset
  resetButton.addEventListener('click', event => {
    event.preventDefault();

    // change the button styling
    submitButton.className = 'active';
    resetButton.className = '';

    // reset the paragraph content and styling
    Array.from(fieldsets).forEach(fieldset => {
      const p = fieldset.querySelector('p');
      p.textContent = '';
      p.style.visibility = 'hidden';
    });

    // reset the form
    form.reset();
  });
});
