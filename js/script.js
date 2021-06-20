if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

function ready() {
  let cards = Array.from(document.querySelectorAll('.card'));
  let overlayText = Array.from(document.querySelectorAll('.overlay-text'));
  let overlay = document.querySelector('.overlay');
  let buttons = Array.from(document.querySelectorAll('.btn'));
  let game = new Game(45, cards);

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

class Game {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.timer = document.querySelector('.timer');
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
  }

  startGame() {
    this.busy = true;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.timeRemaining = this.totalTime;
    this.timer.textContent = '00:' + this.timeRemaining;
    this.hideCards();
    setTimeout(() => {
      this.shaffleCards(this.cardsArray);
      this.countdown = this.startCountdown();
      this.busy = false;
    }, 500);

  }

  startCountdown() {
    return setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining < 10) {
        this.timer.textContent = '00:0' + this.timeRemaining;
      } else {
        this.timer.textContent = '00:' + this.timeRemaining;
      }
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countdown);
    document.querySelector('.overlay').classList.add('visible');
    document.querySelector('.game-over').classList.add('visible');
  }

  victory() {
    clearInterval(this.countdown);
    document.querySelector('.overlay').classList.add('visible');
    document.querySelector('.win').classList.add('visible');

  }

  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  shaffleCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      cardsArray[randIndex].style.order = i;
      cardsArray[i].style.order = randIndex;
    }
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      card.classList.add('visible');

      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  canFlipCard(card) {
    return !this.busy && card !== this.cardToCheck && !this.matchedCards.includes(card)
  }

  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardMismatch(card, this.cardToCheck);
    }

    this.cardToCheck = null;

  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
    }, 800)
    if (this.matchedCards.length === this.cardsArray.length) {
      setTimeout(() => {
        this.victory();
      }, 2000)
    }
  }

  cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  getCardType(card) {
    return card.textContent;
  }
}
