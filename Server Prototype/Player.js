

function Player(name) {
	this.userName = name;
	this.gameMode = -1;
	this.highScores = [];
}

Player.prototype.setName = function(name) {
	this.userName = name;
}

Player.prototype.setGameMode = function(mode) {
	this.gameMode = mode;
}

Player.prototype.addHighScore = function(score) { // probably want to change this to store the scores in order
	// Stores the top 5 scores
	
	// So if there are less than 5 scores, just store it
	if (this.highScores.length < 5) {
		this.highScores[this.highScores.length] = score;
	}
	// else there are already 5 scores, so we need to remove the lowest
	else {
		var indexOfLowest = 0;
		for ( var i = 1; i < this.highScores.length; ++i ) {
			if ( this.highScores[i] < this.highScores[indexOfLowest] ) {
				indexOfLowest = i;
			}
		}
		this.highScores[indexOfLowest] = score;
	}
}