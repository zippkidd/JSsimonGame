//Selecting Elements
const quarters = document.querySelectorAll('.quarter');
const start = document.querySelector('.wrapper button[name="start"]');
const audio = document.querySelectorAll('audio');
const status = document.querySelector('#status');
const mode = document.querySelector('#mode');
const steps = document.querySelector('#steps');

//Functions
let input = [];
let sequence = [];
let playing = false;
let delay = 0;
let retry = true;
let strictMode = false;

function startGame () {
  playing = true;
  sequence = [];
  input = [];
  addRandToSequence();
  playSequence();
  status.innerHTML = '';
}

function addRandToSequence() {
  sequence.push(Math.floor(Math.random() * (4) + 1));
  steps.innerHTML = sequence.length;
}

function playSequence() {
  // Iterate through sequence and play appropriate sounds
  input = [];
  for (let i = 0; i < sequence.length; i++) {
    playSound(sequence[i], i);
  }
}

function playSound(a,b) {
  delay = b * 900;
  const audio = document.querySelector(`audio[data-value="${a}"]`);
  const quarter = document.querySelector(`#q${a}`);
  setTimeout(function () {
    audio.play()
    quarter.classList.add('playing');
  }, delay);
}

function checkInput() {
  //check each input to see if matching sequence
  for (let i = 0; i < input.length; i++) {
    if (sequence[i] !== input[i]) {
      if (retry && !strictMode) {
        status.innerHTML = 'One more try!';
        retry = false;
        setTimeout(() => { // add 1200ms delay to replayed sequence to give user time to realize an error was registered
          status.innerHTML = '';
          playSequence();
        }, 1200)
        return;
      }
      playing = false;
      status.innerHTML = 'You Lose';
      return;
    }
  }
  if (input.length === sequence.length) {
    if (input.length === 5) {
      status.innerHTML = 'You Win!';
      playing = false;
      return;
    }
    addRandToSequence();
    retry = true;
    setTimeout(() => {playSequence()}, 900);
  }
}

function removeTransition(e) {
  e.target.classList.remove('playing');
}

function buttonPress(e) {
  if (!playing) {
    return;
  }
  let value = parseInt(e.target.dataset.value, 10);
  e.target.classList.add('playing');
  playSound(value, 0);
  input.push(value);
  checkInput();
}

//Event Listeners
quarters.forEach(quarter => quarter.addEventListener('click', buttonPress));
start.addEventListener('click', startGame);
quarters.forEach(quarter => quarter.addEventListener('transitionend', removeTransition));
mode.addEventListener('change', () => strictMode = !strictMode);
