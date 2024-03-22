"use strict";

const START_TIME_BASICO = 20; //seconds
const START_TIME_INTERMEDIO = 60;
const START_TIME_AVANCADO = 180;
const PARES_BASICO = 3;
const PARES_INTERMEDIO = 6;
const PARES_AVANCADO = 10;
const POINT_LOSS = 5;
let timer;
let timerId;
let totalPoints = 0;
let topGamers = [
  { nickname: "Ze", points: 331 },
  { nickname: "Maria", points: 321 },
];

const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const message = document.querySelector("#message");
let cards = document.querySelectorAll(".card");
const labelGameTime = document.querySelector("#gameTime");
const labelPoints = document.querySelector("#points");
const messageGameOver = document.querySelector("#messageGameOver");
const nickname = document.querySelector("#nickname");
const infoTop = document.querySelector("#infoTop");
const pointsTop = document.querySelector("#pointsTop");

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

btTop.addEventListener("click", getTop10);

function reset() {
  createPanelGame();

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
  //hideCards();
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

  totalPoints = 0;

  getTimer();
  labelGameTime.textContent = timer + "s";
  timerId = setInterval(updateGameTime, 1000);

  getTopPoints();
}

function stopGame() {
  btPlay.textContent = "Iniciar Jogo";
  btLevel.disabled = false;
  modalGameOver.showModal();

  messageGameOver.textContent = "Pontuação: " + totalPoints;
  nickname.style.display = "none";

  clearInterval(timerId);
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
  let newCardLogos = cardsLogos.slice(0, cards.length / 2);
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

    updatePoints();
  } else {
    setTimeout(() => {
      card.classList.toggle("flipped");
      card2.classList.toggle("flipped");
      card.addEventListener("click", flipCard, { once: true });
      card2.addEventListener("click", flipCard, { once: true });
    }, 500);

    updatePoints(0);
  }
  flippedCards.pop();
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
    default:
      timer = START_TIME_BASICO;
      break;
    case "2":
      timer = START_TIME_INTERMEDIO;
      break;
    case "3":
      timer = START_TIME_AVANCADO;
      break;
  }
}

function updatePoints(operation = "+") {
  if (operation === "+") {
    switch (btLevel.value) {
      case "1":
      default:
        totalPoints += timer * PARES_BASICO;
        break;
      case "2":
        totalPoints += timer * PARES_INTERMEDIO;
        break;
      case "3":
        totalPoints += timer * PARES_AVANCADO;
        break;
    }
  } else totalPoints = Math.max(0, totalPoints - POINT_LOSS);

  labelPoints.textContent = totalPoints;
}

function createPanelGame() {
  panelGame.innerHTML = "";
  panelGame.className = "";

  let numCartas = 2;

  switch (btLevel.value) {
    case "0":
      return;
    case "2":
      numCartas *= PARES_INTERMEDIO;
      panelGame.setAttribute("class", "intermedio");
      break;
    case "3":
      numCartas *= PARES_AVANCADO;
      panelGame.setAttribute("class", "avancado");
      break;
    default:
      numCartas *= PARES_BASICO;
  }

  //creates a card
  let div = document.createElement("div");
  div.setAttribute("class", "card");

  let imgBack = document.createElement("img");
  imgBack.setAttribute("class", "card-back");
  imgBack.setAttribute("src", "images/ls.png");

  let imgFront = document.createElement("img");
  imgFront.setAttribute("class", "card-front");

  div.appendChild(imgBack);
  div.appendChild(imgFront);

  for (let i = 0; i < numCartas; i++)
    panelGame.appendChild(div.cloneNode(true));

  cards = panelGame.childNodes;
}

function getTop10() {
  let gamers = "";

  topGamers.forEach((gamer) => {
    gamers += `${gamer.nickname} - ${gamer.points} <br>`;
  });

  infoTop.textContent = "";
  let div = document.createElement("div");
  let paraNickName = document.createElement("p");
  let paraPontos = document.createElement("p");
  paraNickName.textContent = "Nick Name";
  paraPontos.textContent = "Pontuação";

  div.appendChild(paraNickName);
  div.appendChild(paraPontos);

  infoTop.appendChild(div);

  topGamers.forEach((gamer) => {
    let newDiv = div.cloneNode(true);
    newDiv.firstChild.textContent = gamer.nickname;
    newDiv.lastChild.textContent = gamer.points;
    infoTop.appendChild(newDiv);
  });
}

function getTopPoints() {
  pointsTop.textContent = `Pontuação TOP: ${topGamers[0].points}`;
}
