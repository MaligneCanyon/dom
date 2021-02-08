// randomWord():
// inputs:
// - arr of strs (externally defined)
// outputs:
// - str or undefined
// reqs:
// - select a random word from an arr
// - remove the word from the arr and rtn it
// rules:
// - rtn undefined if the arr is empty
// struct:
// - arr
// algo:
// - if the arr is empty
//   - rtn undefined
// - else
//   - gen a random ndx
//   - select the word from the arr at the random ndx
//   - remove the word from the arr and rtn it

// let arr = ['apple', 'banana', 'orange', 'pear'];
// function randomWord() {
//   let ndx;
//   if (arr.length) {
//     ndx = Math.floor(Math.random() * arr.length) // 0<=int<arr.length
//     // console.log({ndx, arr});
//     return arr.splice(ndx, 1)[0];
//   }
//   return undefined;
// }

// console.log(randomWord());     // banana
// console.log(randomWord());     // pear
// console.log(randomWord());     // apple
// console.log(randomWord());     // orange
// console.log(randomWord());     // undefined


class Game {
  constructor() {
    // remove any displayed spaces
    for (let ndx = Game.spaces.childNodes.length - 1; ndx > 1; ndx--)
      Game.spaces.removeChild(Game.spaces.childNodes[ndx]);

    // remove any displayed guesses
    for (let ndx = Game.guesses.childNodes.length - 1; ndx > 1; ndx--)
      Game.guesses.removeChild(Game.guesses.childNodes[ndx]);

    // remove any previous win/lose class attached to the body
    document.body.classList.remove('win', 'lose');

    // set the initial game states
    this.incorrectGuesses = 0;
    this.correctLetters = 0;
    this.guessedLetters = [];
    Game.apples.classList = '';
    Game.message.innerHTML = "&nbsp;"; // otherwise, a non-empty msg injects a new line into the display
    Game.replay.style.visibility = 'hidden';

    // select a word and generate blanks for it on the display
    this.word = randomWord();
    if (this.word) this.createBlanks(); // if there are any words left
  }

  // set global states/vars
  static maxIncorrectGuesses = 6;
  static apples = document.getElementById('apples');
  static message = document.getElementById('message');
  static replay = document.getElementById('replay');
  static spaces = document.getElementById('spaces');
  static guesses = document.getElementById('guesses');

  createBlanks() {
    let numBlanks = this.word.length;
    for (let ndx = 0; ndx < numBlanks; ndx++) {
      const span = document.createElement('span');
      span.append(' ');
      Game.spaces.appendChild(span);
    }
  }
}

let randomWord = function () {
  let words = ['nutbar', 'cuckoo', 'insanity', 'madness'];

  return function () {
    let ndx;
    let arr = words;
    if (arr.length) {
      ndx = Math.floor(Math.random() * arr.length) // 0<=int<arr.length
      return arr.splice(ndx, 1)[0]; // mutates arr
    }
    alert("Sorry, I've run out of words!");
    return undefined;
  };
}();

document.addEventListener('DOMContentLoaded', event => {
  let game;
  beginGame();

  replay.addEventListener('click', event => {
    event.preventDefault();
    beginGame();
  });

  function keyupEventHandler(event) {
    if (event.key.length === 1 && /[a-z]/.test(event.key)) { // only consider lowercase letters
      // console.log(event.key);
      if (!game.guessedLetters.includes(event.key)) { // ignore letters that have already been guessed
        game.guessedLetters.push(event.key);
        // console.log(game.guessedLetters);

        const span = document.createElement('span');
        span.append(event.key);
        Game.guesses.appendChild(span);

        // console.log(Game.spaces.children.length); // the <h2> heading plus each letter of the hidden word
        let letters = game.word.split('');
        if (letters.includes(event.key)) {
          letters.forEach((letter, ndx) => {
            // console.log({letter});
            if (letter === event.key) {
              Game.spaces.children[ndx + 1].textContent = letter;
              game.correctLetters++;
            }
          });

          // console.log(game.correctLetters, game.word.length);
          if (game.correctLetters === game.word.length) { // won; all letters guessed
            document.body.classList.add('win');
            Game.message.textContent = "You win !";
            endGame();
          }
        } else {
          Game.apples.classList.remove(`guess_${game.incorrectGuesses}`);
          game.incorrectGuesses++;
          // console.log(game.incorrectGuesses);
          Game.apples.classList.add(`guess_${game.incorrectGuesses}`);

          if (game.incorrectGuesses === Game.maxIncorrectGuesses) { // lost; max incorrect guesses reached
            document.body.classList.add('lose');
            Game.message.textContent = "Sorry! You're out of guesses ...";
            endGame();
          }
        }
      }
    }
  }

  function beginGame() {
    game = new Game();
    // console.log(
    //   game.incorrectGuesses,
    //   game.correctLetters,
    //   game.guessedLetters,
    //   game.word,
    //   Game.maxIncorrectGuesses
    // );
    if (game.word) document.addEventListener('keyup', keyupEventHandler);
  }

  function endGame() {
    Game.replay.style.visibility = 'visible';
    document.removeEventListener('keyup', keyupEventHandler);
  }
});
