"use strict";

const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const message = document.querySelector("#message");
const cards = document.querySelectorAll(".card");
let flippedCards = [];
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

  for (let item of document.querySelectorAll(".list-item"))
    item.classList.remove("gameStarted");
}

function startGame() {
  btLevel.disabled = true;
  btPlay.textContent = "Terminar Jogo";
  message.classList.add("hide");

  for (let item of document.querySelectorAll(".list-item"))
    item.classList.add("gameStarted");

  // showCards();
  shuffleArray(cardsLogos);
  //changePictures(cardsLogos);
  let newCardLogos = makeDoubles();
  changePictures(newCardLogos);

  flippedCards = [];
}

function stopGame() {
  btPlay.textContent = "Iniciar Jogo";
  btLevel.disabled = false;
  reset();
  hideCards();
}

function showCards() {
  for (let card of cards) {
    card.classList.add("flipped");
  }
}

function hideCards() {
  for (let card of cards) {
    card.classList.remove("flipped");
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
    card.addEventListener("click", flipCard);
  }
}

//This function will take x ammount of names
//where x is 1/2 of the max cards for the game
//doubles them in a new array
//and shuffles
function makeDoubles() {
  let newCardLogos = cardsLogos.slice(0, 3);
  newCardLogos = [...newCardLogos, ...newCardLogos];
  shuffleArray(newCardLogos);
  return newCardLogos;
}

function flipCard() {
  this.classList.toggle("flipped");
  if (flippedCards.length === 0) {
    flippedCards.push(this);
  } else {
    checkPair(this);
    flippedCards.pop();
  }
}

function checkPair(card) {
  if (card.dataset.logo === flippedCards[0].dataset.logo) {
    //in order to tell the user the cards are checked and correct
    card.querySelector(".card-front").classList.add("grayscale");
    flippedCards[0].querySelector(".card-front").classList.add("grayscale");

    console.log("iguais");
  } else {
    console.log("não são iguais");
  }
}
