// Atributos inicias do jogo
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        winBox: document.getElementById("score_points_win"),
        loseBox: document.getElementById("score_points_lose")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        frontCard: document.getElementById("card-front"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides:{  
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    action: {
        button: document.getElementById("next-duel")
    }
};

const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
];

// Gera um id aleatório para selecionar uma carta
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

// Cria a imagem das cartas na mesa viradas para baixo, recebendo o Id e o lado do campo
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);

    // Apenas do lado do player a carta pode ser clicada
    if(fieldSide === state.playerSides.player1) {

        cardImage.classList.add("player_card");

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        })

        cardImage.addEventListener("mouseleave", () => {
            throwSelectedCard(idCard);
        })
    }
    if(fieldSide === state.playerSides.computer) {
        cardImage.classList.add("computer_card");
    }



    return cardImage;
}

async function setCardsField(cardId) {

    // Remove as cartas do campo
    await removeAllCards();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

// Mostra o botão com o resultado
async function drawButton(text) {
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
}

// Atualiza o score
async function updateScore() {
    state.score.winBox.innerText = `Win : ${state.score.playerScore}`;
    state.score.loseBox.innerText = `Lose : ${state.score.computerScore}`;

    return;
}

// Verifica o resultado da partida
async function checkDuelResult(playerId, computerId) {
    let duelResult = "Draw";
    let playerCard = cardData[playerId];
    
    if(playerCard.WinOf.includes(computerId)) {
        duelResult = "Win";
        await playAudio("win");
        state.fieldCards.computer.style.filter = "grayscale(100%)";
        state.score.playerScore++;
    }
    
    if(playerCard.LoseOf.includes(computerId)) {
        duelResult = "Lose";
        await playAudio("lose");
        state.cardSprites.avatar.style.filter = "grayscale(100%)";
        state.fieldCards.player.style.filter = "grayscale(100%)";
        state.score.computerScore++;
    }

    return duelResult;
}

async function resetStyles() {
    state.cardSprites.avatar.style.filter = "";
    state.fieldCards.player.style.filter = "";
    state.fieldCards.computer.style.filter = "";
}

async function removeAllCards() {
    let { computerBox, player1Box } = state.playerSides;
    let imageElements = computerBox.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());

    imageElements = player1Box.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());
}

// Mostra a carta selecionada
async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
    state.cardSprites.frontCard.style.display = 'none';
}
// Esconde a carta selecionada
async function throwSelectedCard() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma Carta!";
    state.cardSprites.frontCard.style.display = '';
}

// 
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        console.log(fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.action.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    await throwSelectedCard();
    await resetStyles();
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();