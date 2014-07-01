function Deck() {
	var cardsUsed, queue;
	cardsUsed = 0;
	this.cards = [];

	this.count = function() {
		return this.cards.length;
	}

	this.init = function() {
		// start loop of suits, s
		for(s = 1; s <= 4; s++) {
			// start loop of ranks, r
			for(r = 1; r <= 13; r++) {
				this.cards.push(new Card(r, s));
			}
		}
	}

	this.shuffle = function() {
		for (var i = this.cards.length - 1; i >= 0; i--) {
			var random = Math.floor(Math.random() * (i + 1));
			var temp = this.cards[i];
			this.cards[i] = this.cards[random];
			this.cards[random] = temp;
		}
	}

	this.dealCard = function() {
		if(cardsUsed == this.cards.length) {
			alert("There are no more cards left in the deck." +
				"\nPlease start a new game.");
		}
		cardsUsed++;
		return this.cards[cardsUsed - 1];
	}
}


function Card(rank, suit) {
	var suits, ranks;
	this.rank = rank;
	this.suit = suit;
	ranks = ["Ace", '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
	suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
	this.show = function() {
		console.log(this.rank + " of " + this.suit);
		return (ranks[rank - 1] + " of " + suits[suit - 1]);
	}
}


function Player(deck) {
	var flag, hand, card;
	flag = true;
	this.deck = deck;
	hand = new Hand();

	this.go = function() {
		card = deck.dealCard();
		hand.addCard(card);
		// display the cards dealt
		$("#player").append("<li>Card:  " + card.show() + "</li>");
		var $total = "<p>Player total is: " + this.getTotal() + "</p>";
		$("#p-total").html($total); // display total for player
		$("#p-total").css("background-color","lightGreen");
		$("#p-total").width("250px");
	}

	this.getTotal = function() {
		return hand.getTotal();
	}

	this.getHand = function() {
		return hand;
	}

	this.getCardsInHand = function() {
		return hand.getCardsInHand();
	}

	this.showHand = function() {
		return hand.showHand();
	}
}

function Dealer(deck) {
	var hand, card;
	this.deck = deck;
	hand = new Hand();
	
	this.go = function() {
		card = deck.dealCard();
		hand.addCard(card);
		// display the cards dealt
		$("#dealer").append("<li>Card:  " + card.show() + "</li>")
		var $total = "<p>Dealer total is: " + this.getTotal() + "</p>";
		$("#d-total").html($total);  // display total for dealer
		$("#d-total").css("background-color","lightGreen");
		$("#d-total").width("250px");
	}

	this.getTotal = function() {
		return hand.getTotal();
	}

	this.getHand = function() {
		return hand;
	}

	this.getCardsInHand = function() {
		return hand.getCardsInHand();
	}

	this.showHand = function() {
		return hand.showHand();
	}
}


function Hand() {
	var total, hasAce;
	this.hand = [];
	total = 0;
	hasAce = false;
	
	this.getHand = function() {
		return this.hand;
	}

	this.getTotal = function() {
		return total;
	}

	this.getCardsInHand = function() {
		return this.hand.length;
	}

	this.showHand = function() {
		var message = "";
		for(var i = 0; i < this.hand.length; i++) {
			message += "\nCard number " + (i + 1) + " :  " + this.hand[i].show();
		}
		message += "\nTotal points:   " + this.getTotal() + "\n";
		return message;
	}

	this.addCard = function(card) {
		var isAce, val, hasAce;
		isAce = false;
		val = card.rank;
		this.hand.push(card);

		if(val == 1) {
			val = 11;
			hasAce = true;
			isAce = true;	
		}
		if(val > 10) {
			val = 10;
		}
		// update the total points value (ace (1) can count as 1 or 11 points)
		if(this.hand.length == 2 && total + val > 21) {
			total = 21;
		} else if(isAce) {
			if(total + 11 > 21) {
				total += 1;
				hasAce = false;
			} else {
				total += 11;
			}
		} else if(hasAce && total + val > 21) {
			total += val - 10;
			hasAce = false;
		} else {
			total += val;
		}
	}
}


function BlackJack() {
	var player, dealer, deck, bust;
	bust = false;
	deck = new Deck();
	deck.init();
	deck.shuffle();

	player = new Player(deck);
	dealer = new Dealer(deck);

	this.hit = function() {
		player.go();
		checkTotal();
	}

	this.stand = function() {
		finishGame();
	}

	var checkTotal = function() {
		if(player.getTotal() == 21) {
			finishGame();
		} else if(player.getTotal() > 21) {
			bust = true;
			finishGame();
		}
	}

	this.play = function() {
		$("button#hit").on("click", b.hit);
		$("button#stand").on("click", b.stand);
		player.go();
		dealer.go();
		player.go();
		checkTotal();
	}

	var finishGame = function() {
		$("button#hit").fadeOut('slow');
		$("button#stand").fadeOut('slow');
		var $result;
		dealer.go();
		if(bust) {  // player bust
			$result = "YOU LOST!";
		} else {
			while(dealer.getTotal() < 17 || dealer.getTotal() < player.getTotal()) {
				dealer.go();
			}
			if(dealer.getTotal() > 21) { // dealer bust
				$result = "YOU WIN!";
			} else if(dealer.getTotal() >= player.getTotal()) {
				$result = "YOU LOST!";
			}
		}
		// Display the winner
		$('#display').html($result);
	}
}


$(document).ready(function() {
	$('button#start').on('click', function() { // starts a new game
		b = new BlackJack();
		b.play();
		
		$("button#game").fadeIn('slow');
		$(this).fadeOut('slow');
	});
	
	$("button#game").on("click", function() { // starts a new game
		location.reload();
	});
});