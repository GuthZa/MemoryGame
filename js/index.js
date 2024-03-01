"use strict";

const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const message = document.querySelector("#message");
const cards = document.querySelectorAll(".card");
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

  showCards();
  shuffleArray(cardsLogos);
  changePictures();
  let newCardLogos = [];
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

function changePictures() {
  let indice = 0;
  for (const card of cards) {
    let cardFront = card.querySelector(".card-front");
    cardFront.src = `images/${cardsLogos[indice]}.png`;
    card.dataset.logo = cardsLogos[indice];

    indice++;
  }
}
