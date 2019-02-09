var view = {
    displayMessage: function(message){
        document.getElementById("messageBoard").style.padding = "0.4em 0.8em";
        var messageArea = document.getElementById('messageBoard');
        messageArea.innerHTML = message;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");

    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}


var gameModel = {
    boardSize: 7,
    numberShips: 3,
    shipLength: 3,
    shipSunk: 0,

    ships: [],

    fire: function(guess){

        for(var i = 0; i < this.ships.length; i++){
            var index = this.ships[i].locations.indexOf(guess);
            if(index >= 0){
                var ship = this.ships[i];
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("TRAFIONY!!!");
                if(this.isSunk(ship)){
                    view.displayMessage("Okręt zatopiony!");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("PUDŁO!!!");
        return false;
    },

    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    possible: [],

    generateShips: function() {
        
        for(var i = 0; i <= (this.boardSize - this.shipLength); i++){
            for(var j = 0; j <= (this.boardSize - this.shipLength); j++){
                this.possible.push(String(i)+String(j));
            }
        }
        for(var i = 0; i < this.numberShips; i++){
            var direction = Math.floor(Math.random()*2);
            var x = Math.floor(Math.random()*(this.possible.length));
            var position = this.possible[x];
            this.createShip(position.charAt(0),position.charAt(1),direction);
            this.possible.splice(x, 1);
        }
        
    },
    createShip: function(x,y,direction){
        if(direction === 0){
            var first = String(x) + String(y);
            var second = String(x) + String(+y+ +1);
            var third = String(x) + String(+y + +2);
            this.ships.push({locations: [first, second, third], hits: ["","",""]})
            this.removeFromPossible(second);
            this.removeFromPossible(third);
        }
        if(direction === 1){
            var first = String(x) + String(y);
            var second = String(+x+ +1) + String(y);
            var third = String(+x+ +2) + String(y);
            this.ships.push({locations: [first, second, third], hits: ["","",""]})
            this.removeFromPossible(second);
            this.removeFromPossible(third);
        }
    },
    removeFromPossible: function(toRemove){
        var i = this.possible.indexOf(toRemove);
        this.possible.splice(i, 1);
    }
}

var gameController = {
    guesses: 0,

    parseGuess: function(guess) {

        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

        if(guess === null || guess.length !== 2){
            alert("Niepoprawny format pola :--(");
        }
        else{
            var firstChar = guess.charAt(0).toUpperCase();
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
            
            if(isNaN(row) || isNaN(column)){
                alert("To nie są poprawne współrzędne :--(");
            }
            else if(row < 0 || column < 0 || row >= gameModel.boardSize || column >= gameModel.boardSize){
                alert("Wybrałeś pole poza plnaszą :--(");
            }
            else{
                return row + column;
            }
        }
        return null;
    },

    processGuess: function(guess){
        var location = this.parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = gameModel.fire(location);

            if(hit && gameModel.shipSunk === gameModel.numberShips){
                view.displayMessage("Zatopiłeś wszystkie okręty w "+this.guesses+" próbach.");
            }
        }
    }
}

function init() {
    gameModel.generateShips();
    console.log(gameModel.ships);
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
}

function handleKeyPress(e){
    var fireButton = document.getElementById('fireButton');
    if(e.keyCode === 13){
        fireButton.click();
        guessInput = "";
        return false;
    }
}
function handleFireButton(){
    var guessInput = document.getElementById('guessInput').value;
    gameController.processGuess(guessInput);

    guessInput = "";
}

window.onload = init;