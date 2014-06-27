<script>
	
	function Deck() {
		var cardsUsed, queue;
		cardsUsed = 0;
		this.cards = [];
		queue = new Queue();

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
				// display the cards after beeing shuffled
				// this.cards[i].show();
			}
		}

		this.dealCard = function() {
			if(cardsUsed == this.cards.length) {
				alert("There are no more cards left in the deck." +
					"\nPlease start a new game.");
			}
			cardsUsed++;
			queue.enqueue(this.cards[cardsUsed - 1]);
			return this.cards[cardsUsed - 1];
		}

		this.showQueue = function() {
			return queue.showQueue();
		}
	}


	function Card(rank, suit) {
		var suits;
		this.rank = rank;
		this.suit = suit;
		suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
		this.show = function() {
			console.log(this.rank + " of " + this.suit);
			return (rank + " of " + suits[suit - 1]);
		}
	}


	// A queue to store all the cards used in a game
	function Queue() {
		var front, rear, size;

		front = null;
		rear = null;
		size = 0;

		// adds a new element at the end (rear) of the Queue
		this.enqueue = function(card) {
			newLink = new Link(card, null);
			if(size == 0) {
				front = rear = newLink;
			} else {
				rear.next = newLink;
				rear = rear.next;
			}
			size++;
		}

		// returns and removes the element that is at the top of the Queue
		this.dequeue = function(card) {
			var temp;
			if(size == 0) {
				alert("There are no more elements in the Queue.");
			} else {
				temp = front.item;
				front = front.next;
				size--;
			}
			return temp;
		}

		// returns a copy of the element that is at the front of the Queue without 
		// removing the element
		this.peek = function() {
			if(size == 0) {
				return "There are no more elements in the Queue !"
			}else {
				return front.item;
			}
		}

		// returns a string containing all the cards in the queue
		this.showQueue = function() {
			var temp, message;
			temp = front;
			message = "\n";
			for(var i = size; i > 0; i--){
				message += temp.item.show() + "\n";
				if(i != 1) {
					temp = temp.next;
				}
			}
			return message;
		}

		// returns the number of elements in the queue
		this.getSize = function() {
			return size;
		}
	}

	// constructs a new link
	function Link(item, next) {
		this.item = item;
		this.next = next;
	}


	function Player(deck) {
		var flag, hand, card;
		flag = true;
		this.deck = deck;
		hand = new Hand();

		hand.addCard(deck.dealCard());

		this.go = function() {
			hand.addCard(deck.dealCard());
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
		var hand;
		this.deck = deck;
		hand = new Hand();
		hand.addCard(deck.dealCard());

		this.go = function(){
			do{
				hand.addCard(deck.dealCard());
			} while(hand.getTotal() < 17);
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
		this.hand = [];
		this.total = 0;
		
		this.getHand = function() {
			return this.hand;
		}

		this.getTotal = function() {
			return this.total;
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
			this.hand.push(card);
			if(card.rank > 11) {
				this.total += 10;
			} else {
				this.total += card.rank;
			}
		}
	}

	function BlackJack() {
		var player, dealer, deck;

		deck = new Deck();
		deck.init();
		deck.shuffle();

		player = new Player(deck);
		dealer = new Dealer(deck);

		dealAgain = function(p) {
			var answer = prompt("\nHere are your results:\n " +
					p.showHand() + "\nYour total is:  " + p.getTotal() + "\n" +
					"\nWould you like to get another card ?" +
					"\n(y for YES, anything else for NO)");
			if(answer == "y" || answer == "Y") {
				return true;
			} else {
				return false;
			}
		}

		this.play = function() {
			var flag;
			flag = true;
			do {
				player.go();
				if(player.getCardsInHand() == 2 && player.getTotal() > 20) {
					alert("You have BlackJack.\n" + player.showHand() + 		
						"\nMoving on to next player.");
					flag = false;
				} else {
					if(player.getTotal() > 21) {
						flag = false;
					} else {
						flag = dealAgain(player);
					}
				}
			} while (flag);

			if(player.getTotal() > 21) {
				alert("You loose! \nHere are the results: \n" + player.showHand() +
					"\nGame Over !");
			} else {
				dealer.go();
				if(dealer.getTotal() > 21 || player.getTotal() > dealer.getTotal()) {
					alert("You win !\nHere are the results: \n"
						+ "\nPLAYER \n" + player.showHand()
						+ "\nDEALER \n" + dealer.showHand());
				} else {
					// player.getTotal() <= dealer.getTotal()) {
					alert("You loose! \nHere are the results: \n" + 
						"\nPLAYER \n" + player.showHand() +
						"\n " + "\nDEALER \n" + dealer.showHand());
				}
			}
			alert("Here are all the cards that were used from the deck " +
			"in the order they were used: \n" + deck.showQueue());	
		}
	}

	b = new BlackJack();
	b.play();
	
</script>