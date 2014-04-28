/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file houses the game class which is the overall controller
	of game and menu stuff.
	
	Requires Node.js and socket.io
*/


function Game( g, s, n ){

	this.graphics = g;
	
	this.socket = s;
	
	this.name = n;
	
	this.isOnMenu = true;
	
	this.gameManager = new GameManager( this, g, this.socket, this.name );
	this.menuManager = new MenuManager( this, g, this.socket, this.name );
	timer.update();
	
}

Game.prototype.start = function(){

	this.isOnMenu = true;
	toMainMenu();
	setInterval( run, 1000/fps );
	
}

Game.prototype.end = function(){

	clearInterval( this.run );

}

Game.prototype.returnToMenu = function(){

	this.isOnMenu = true;
	toMainMenu();
	

}



function goToGame( gm, difficulty ){
	
	var socket = myGame.socket;
	
	// race
	if (gm == MULTI_RACE) {
		socket.emit('mp_race', { user_name: myGame.name });
		
		// handle multiplayer race wait message
	socket.on(
		'waitForRace',
		function(message) {
			if (message) {
				myGame.menuManager.isWaiting = true;
				console.log('waiting for opponent');
				//myGame.gameManager.drawWait( myGame.gameManager.g );
			}
		});
		
		socket.on(
		'opponentForRace',
		function(message) {
			//if (message) {
				myGame.menuManager.isWaiting = false;
				myGame.isOnMenu = false;
				myGame.gameManager.newGame( gm );
			//}
		});
	}
	// challenge --------------------------needs finishing TODO
	else if (gm == MULTI_CHALLENGE) {
		socket.emit('mp_ch', { user_name: myGame.name });
		
		// handle multiplayer race wait message
		socket.on(
			'waitForChallenge',
			function(message) {
				if (message) {
					myGame.menuManager.isWaiting = true;
					myGame.gameManager.host = true;
					console.log('waiting for opponent');
				}
		});
		
		socket.on(
			'opponentForChallenge',
			function(message) {
				//if (message) {
					myGame.menuManager.isWaiting = false;
					myGame.isOnMenu = false;
					myGame.gameManager.newGame( gm );
				//}
		});
	}
	// single player
	else if (gm == TIME_TRIAL) {
		socket.emit('sp_tt', { user_name: myGame.name });
		myGame.isOnMenu = false;
		myGame.menuManager.selectingTTD = false;
		console.log("Game: " + difficulty);
		myGame.gameManager.newGame( gm, difficulty );
	}
	else if (gm == SINGLE_CHALLENGE) {
		socket.emit('sp_ch', { user_name: myGame.name });
		myGame.isOnMenu = false;
		myGame.gameManager.newGame( gm );
	
	}else if( gm == TUTORIAL ){
	
		myGame.isOnMenu = false;
		myGame.gameManager.newGame( gm );
	
	}
	
	myGame.menuManager.onSPMenu = false;
	myGame.menuManager.onMPMenu = false;
}

Game.prototype.update = function(){

	if( !this.isOnMenu ){
		this.gameManager.update();
	}else{
		this.menuManager.update();
	}
}

var run = function( ){

	myGame.update();
	myGame.draw();

}

Game.prototype.draw = function(){

	if( this.isOnMenu ){
		this.menuManager.draw( this.graphics );
	}else{
		this.gameManager.draw( this.graphics );
	}

}