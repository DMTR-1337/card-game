/************************************
Copyright (C) 2026 Santeri Salonen. 
https://github.com/dmtr-1337
Everyone is permitted to copy and distribute verbatim copies 
of this license document, but changing it is not allowed.

The GNU General Public License is a free, copyleft license for
software and other kinds of works.
************************************/

class Game {/*Game Class*/
    pWins = 0;
    cWins = 0;
    pack = [0];

    /*File path for media*/
    path = 'vendor/media/';

    /*CARD IMAGES FROM: https://github.com/Xadeck/xCards */
    cardImages = Object.freeze( /*Table of different card images*/
    {
        2:  ['2H.png', '2D.png', '2C.png', '2S.png'],
        3:  ['3H.png', '3D.png', '3C.png', '3S.png'],
        4:  ['4H.png', '4D.png', '4C.png', '4S.png'],
        5:  ['5H.png', '5D.png', '5C.png', '5S.png'],
        6:  ['6H.png', '6D.png', '6C.png', '6S.png'],
        7:  ['7H.png', '7D.png', '7C.png', '7S.png'],
        8:  ['8H.png', '8D.png', '8C.png', '8S.png'],
        9:  ['9H.png', '9D.png', '9C.png', '9S.png'],
        10: ['10H.png', '10D.png', '10C.png', '10S.png'],
        11: ['AH.png', 'AD.png', 'AC.png', 'AS.png'],
        "J": ['JH.png', 'JD.png', 'JC.png', 'JS.png'],
        "Q": ['QH.png', 'QD.png', 'QC.png', 'QS.png'],
        "K": ['KH.png', 'KD.png', 'KC.png', 'KS.png'],
        BACK: 'back.png'
    });
    createPack() /*Create a pack of cards*/
    {
        this.pack = [];

        /*Card numbers*/
        const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

        /*4 types of cards, H, D, C, S*/
        for (let i = 0; i < 4; i++) {
            cards.forEach(v => {
                const imgList = this.cardImages[v];
                const rImg = imgList[Math.floor(Math.random() * imgList.length)];
                this.pack.push({ value: v, img: rImg });
            });
        }
        this.shuffle();
    }
    shuffle() /*Shuffle card pack*/
    {
        for (let i = this.pack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pack[i], this.pack[j]] = [this.pack[j], this.pack[i]];
        }
    }
    getCard() /*Function to draw a random card*/
    {
        if (this.pack.length < 10) this.createPack();
        return this.pack.pop();
    }
    addWin(winner) /*Function to add wins*/
    {
        if(winner === 'computer') 
        {
            this.cWins++;
        } 
        else if(winner === 'player')
        {
            this.pWins++;
        }
        
        document.getElementById('pWins-display').innerText = this.pWins;/*Scoreboard player wins*/
        document.getElementById('cWins-display').innerText = this.cWins;/*Scoreboard computer wins*/
    }
    sumCard(hand) { /*Calculate the sum of a hand*/
        let total = 0; /*Total score*/
        let aces = 0; /*Amount of aces*/

        /*Iterate through cards in hand and total to card value*/
        for (let card of hand) {
            total += card.value;
        if (card.value === 11)
        {
            aces++; /*Add up to amount of aces*/
        }       
    }
        /*If total is over 21, adjust Aces to 1*/
        while (total > 21 && aces > 0) {
            total -= 10;/*Ace is 1*/
            aces--; /*Remove ace from counter*/
        }
        return total; /*Return total score*/
    }
}

const game = new Game();/*Initialize game instance*/

let hand = []; /*Player hand*/
let cHand = []; /*Computers hand*/
let handd; /*Whose hand to render*/
let elementId; /*element id (pCard or cCard)*/
let hide; /*Hide cards or no?*/

function renderCards(handd, elementId, hide = false) {
    const box = document.getElementById(elementId);
    box.innerHTML = '';

    /*Iterate through cards*/
    handd.forEach((card) => 
    {
        const img = document.createElement('img'); /*Create image element for card*/
        
       /*Get image path*/
        const fileName = hide ? game.cardImages.BACK : card.img; /*Show back of card if hide is true, otherwise show card*/
        img.src = `${game.path}${fileName}`;
        
        img.className = 'card'; /*Use the class "card"*/
        box.appendChild(img); /*Add card*/
    });
}

function main() /*Game logic*/
{
    game.createPack(); /*Create pack of cards*/
    hand = [game.getCard(), game.getCard()]; /*Get random hand*/
    cHand = [game.getCard(), game.getCard()];/*Get random hand*/
    
    document.getElementById('message').innerText = "Haluatko nostaa?";
    
    renderCards(hand, 'pCards', false); /*Render player cards visible*/
    renderCards(cHand, 'cCards', true); /*Hide computer cards*/
    showHand(false); /*Hide computer score*/
    controls(true); /*Enable controls on game start*/
}
function showHand(hide) /*Function whether cards are hidden or no */
{
    document.getElementById('pScore').innerText = game.sumCard(hand);
    document.getElementById('cScore').innerText = hide ? game.sumCard(cHand) : "?"; /*Hide score if hide is true, otherwise show score*/
}
function hit() /*Function to hit*/
{
    hand.push(game.getCard()); /*Push card to hand*/
    renderCards(hand, 'pCards', false); /*Render card, visible*/
    
    showHand(false); /*Keep score hidden*/

    if (game.sumCard(hand) > 21) { /*Player bust*/
        stand();
    }
}
function stand() /*Stand and end the round*/
{
    const pTotal = game.sumCard(hand); /*Total sum of player hand*/
    const cTotal = game.sumCard(cHand); /*Total sum of computers hand*/

    /*Render cards and score of computer*/
    renderCards(cHand, 'cCards', false); 
    showHand(true); /*Show score*/

    let text = ""; /*Message text*/

    if (pTotal > 21) /*Player bust*/
    {
        text = "Hävisit (Yli 21)";
        game.addWin('computer');
    } 
    else if (cTotal > 21) /*If computer busts*/
    {
        text = "Voitit!";
        game.addWin('player');
    } 
    else if (pTotal > cTotal) /*Player wins*/
    {
        text = "Voitit!";
        game.addWin('player');
    } 
    else if (pTotal < cTotal)  /*Computer wins*/
    {
        text = "Hävisit!";
        game.addWin('computer');
    } 
    else /*Tie*/
    {
        text = "Tasapeli!";
    }
    
    document.getElementById('message').innerText = text; /*Show message*/
    controls(false); /*Enable controls*/
}

function controls(disabled) /*Function to disable certain controls*/
{
    document.getElementById('hit').disabled = !disabled;
    document.getElementById('stand').disabled = !disabled;
    document.getElementById('start').disabled = disabled;
}

document.getElementById('hit').onclick = hit; /*Action to hit*/
document.getElementById('stand').onclick = stand; /*Action to stand*/
document.getElementById('start').onclick = main; /*Action to start game*/
