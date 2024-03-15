"use strict";

const START_TIME_BASICO = 20; //seconds
const START_TIME_INTERMEDIO = 60;
const START_TIME_AVANCADO = 180;
let timer;
let timerId;
let pontos = 0;

const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const message = document.querySelector("#message");
const cards = document.querySelectorAll(".card");
const labelGameTime = document.querySelector("#gameTime");
const labelPontos = document.querySelector("#points");

let flippedCards = [];
let totalFlippedCards = 0;
const cardsLogos = [
  "angular",
  "bootstrap",
  "html",
  "javascript",
  "vue",
  "svelte",
  "react",
  "css",
  "backbone",
  "ember",
];

//UseCapture - para propragacao de eventos
//por Default o event e propragado
//pode se escolher a ordem em que os eventos sao propragados
//se houver divs dentro de outros divs, os events sao todos ativados

//Event Listener
// function - apenas o function name, sem ()
// para chamar funcoes com paramentros criamos uma funcao anonima (inline)

btLevel.addEventListener("change", reset);

btPlay.addEventListener("click", () => {
  btPlay.textContent === "Terminar Jogo" ? stopGame() : startGame();
});
panelGame.addEventListener("click", () => {
  message.textContent =
    message.textContent === "" ? "Clique em Iniciar o Jogo" : "";
});

function reset() {
  message.textContent = "";
  message.classList.remove("hide");

  if (btLevel.value === "0") {
    btPlay.disabled = true;
    panelGame.style.display = "none";
  } else {
    btPlay.disabled = false;
    panelGame.style.display = "grid";
  }

  labelGameTime.removeAttribute("style");

  for (let item of document.querySelectorAll(".list-item"))
    item.classList.remove("gameStarted");
  cards.forEach((card) => card.removeEventListener("click", flipCard));
  hideCards();
}

function startGame() {
  btLevel.disabled = true;
  btPlay.textContent = "Terminar Jogo";
  message.classList.add("hide");

  for (let item of document.querySelectorAll(".list-item"))
    item.classList.add("gameStarted");

  shuffleArray(cardsLogos);

  let newCardLogos = makeDoubles();
  changePictures(newCardLogos);

  flippedCards = [];
  totalFlippedCards = 0;

  getTimer();
  labelGameTime.textContent = timer + "s";
  timerId = setInterval(updateGameTime, 1000);
}

function stopGame() {
  btPlay.textContent = "Iniciar Jogo";
  btLevel.disabled = false;
  modalGameOver.showModal();

  clearInterval(timerId);

  reset();
}

function showCards() {
  for (let card of cards) {
    card.classList.add("flipped");
  }
}

function hideCards() {
  for (let card of cards) {
    card.classList.remove("flipped");
    card.classList.remove("inative");
    card.querySelector(".card-front").classList.remove("grayscale");
  }
}

//Algoritmo Fisher-Yates -> baralhar um array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

//This function changes the src and data- in the html
function changePictures(cardLogos) {
  let indice = 0;
  for (let card of cards) {
    let cardFront = card.querySelector(".card-front");
    cardFront.src = `images/${cardLogos[indice]}.png`;
    card.dataset.logo = cardLogos[indice];
    indice++;
    card.addEventListener("click", flipCard, { once: true });
  }
}

//This will make sure theres always pairs for the cards
function makeDoubles() {
  let newCardLogos = cardsLogos.slice(0, 3);
  newCardLogos = [...newCardLogos, ...newCardLogos];
  shuffleArray(newCardLogos);
  return newCardLogos;
}

function flipCard() {
  this.classList.toggle("flipped");
  flippedCards.length === 0 ? flippedCards.push(this) : checkPair(this);
}

function checkPair(card) {
  let card2 = flippedCards[0];
  if (card.dataset.logo === card2.dataset.logo) {
    removeCard(card);
    removeCard(card2);
    totalFlippedCards += 2;
    //basico 3
    //intermediario 6
    //avancado 10
    pontos = timer * (+btLevel.value * 3);
  } else {
    setTimeout(() => {
      card.classList.toggle("flipped");
      card2.classList.toggle("flipped");
      card.addEventListener("click", flipCard, { once: true });
      card2.addEventListener("click", flipCard, { once: true });
    }, 500);
  }
  flippedCards.pop();
  labelPontos.textContent = pontos;
}

function removeCard(card) {
  setTimeout(() => {
    card.querySelector(".card-front").classList.add("grayscale");
    card.classList.add("inative");
  }, 400);
  //Serves to tell the user the cards are checked and correct
}

function gameOver() {
  return totalFlippedCards === cards.length;
}

function updateGameTime() {
  timer--;
  labelGameTime.textContent = timer + "s";
  console.log(timer);
  if (timer <= 10) labelGameTime.style.backgroundColor = "red";

  if (timer === 0) stopGame();
}

function getTimer() {
  switch (btLevel.value) {
    case "1":
      timer = START_TIME_BASICO;
      break;
    case "2":
      timer = START_TIME_INTERMEDIO;
      break;
    case "3":
      timer = START_TIME_AVANCADO;
      break;
    default:
      timer = START_TIME_BASICO;
  }
}
