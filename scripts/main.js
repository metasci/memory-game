// Nick Beaudoin

$(function(){
    var game = new Game();
    game.play();
});



function Game(){
    this.matches = 0;
    this.board = new Board();
}

Game.prototype = {
    constructor: Game,
    handleCardClick: function(event){
        var card = $(this);
        var flipNoMatch = $(".flipped").not(".matched");
        var self = event.data.self;
        // if 1 or no card is flipped & not matched
        // allow another card to be flipped
        if(flipNoMatch.length < 2 && !card.hasClass("flipped")){ // may be unnecessary 
            self.board.flip(card);
            // if 2 new cards have been flipped
            if(flipNoMatch.length == 1 && !flipNoMatch.is(card)){
                // check for match
                self.checkForMatch(flipNoMatch, card);
            }
        }
    },
    /**
     * decide if 2 cards are matched, and take action accordingly
     */
    checkForMatch: function(card1, card2){
        if(this.board.getNumber(card1) == this.board.getNumber(card2)){
            // if matched, lock 2 new cards
            this.board.setMatch(card1, card2);
            this.matches++;
            // is game done?
            this.checkForGameOver();
        } else {
            // if unmatched, reset the 2 unmatched cards
            var _this = this;
            setTimeout(function(){
                _this.board.resetUnmatched();
            },2000);
        }
    },
    /**
     * decide if game is over, and take action accordingly
     */
    checkForGameOver: function(){
        if(this.matches == 8){
            // game over
            var _this = this;
            setTimeout(function(){
                _this.endGame();
            }, 3000);
        }
    },
    endGame: function(){
        var _this = this;
        // hide board
        $(".board").fadeOut(1000, function(){
            var ribbon = $(".end-menu");
            // show winner ribbon
            ribbon.fadeIn(1000).delay(2000).fadeOut(1000, function(){
                _this.restart(_this);
            });
        });
    },
    /**
     * display start menu
     */
    play: function(){
        var _this = this;
        menu = $(".start-menu");
        menu.fadeIn(1000);
        $(".start-btn").click(function(){
            menu.fadeOut(1000,function(){
                _this.showBoard();
            });
        });
    },
    showBoard: function(){
        var board = $(".board");
        $(".card").click({self: this}, this.handleCardClick);
        board.fadeIn(1000);
        board.css("display","table");
    },
    /**
     * reset board for a new game
     */
    restart: function(self){
        self.matches = 0;
        self.board = new Board();
        self.play();
    }
}


function Board(){
    this.initialize();
}

Board.prototype = {
    constructor: Board,
    resetAll(){
        $(".flipped").removeClass("flipped");
        $(".matched").removeClass("matched");
    },
    /**
     * flip only unmatched to front
     */
    resetUnmatched: function(){
        var unmatched = $(".flipped").not(".matched");
        unmatched.removeClass("flipped");
    },
    /**
     * flip clicked card to view back
     */
    flip: function(card){
        card.addClass("flipped");    
    },
    /**
     * return the number assigned to the given card
     */
    getNumber: function(card){
        return card.children(".back").children().attr("alt");
    },
    /**
     * declare 2 cards matched
     */
    setMatch: function(card1, card2){
        card1.addClass("matched");
        card2.addClass("matched");
    },
    /**
     * set number location randomly
     */
    initialize: function(){
        if($(".flipped").length > 0){
            this.resetAll();
        }
        var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
        numbers = this.shuffle(numbers);
        var cards = $(".back");
        for(let i = 0; i < cards.length; i++){
            cards[i].innerHTML = `<img class="number" src="./images/${numbers[i]}.png" alt="${numbers[i]}">`;
        }
    },
    /**
     * scramble cards
     */
    shuffle: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            // ES6 allows me to swap without a temp 
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    }
}















