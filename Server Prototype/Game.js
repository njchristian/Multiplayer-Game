/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file houses the game class which is the overall controller
	of game and menu stuff.
	
	Requires Node.js and socket.io
*/

//Game constructor. Its takes a graphics object, a socket object, and the username
function Game( g, s, n ){

	this.graphics = g;
	
	this.socket = s;
	
	this.name = n;
	
	//game starts at the main menu
	this.isOnMenu = true;
	
	//create a gameManager object and a menuManager object
	this.gameManager = new GameManager( this, g, this.socket, this.name );
	this.menuManager = new MenuManager( this, g, this.socket, this.name );
	timer.update();
	
}

//start the game object. call the run function until the game is over
Game.prototype.start = function(){

	this.isOnMenu = true;
	toMainMenu();
	setInterval( run, 1000/fps );
	
}

//end the game object
Game.prototype.end = function(){

	clearInterval( this.run );

}

//return the game object to the main menu
Game.prototype.returnToMenu = function(){

	this.isOnMenu = true;
	toMainMenu();
	

}

//function for choose what game type is chosen. It take the game mode and the difficulty which is a integer value
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
	
	//wait until a opponent is ready to play
		socket.on(
		'opponentForRace',
		function(message) {	
				myGame.menuManager.isWaiting = false;
				myGame.isOnMenu = false;
				myGame.gameManager.newGame( gm );
		});
	}
	
	//handle multiplayer challenge wait message
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
		
		//wait until a opponent is ready to play
		socket.on(
			'opponentForChallenge',
			function(message) {
					myGame.menuManager.isWaiting = false;
					myGame.isOnMenu = false;
					myGame.gameManager.newGame( gm );
		});
	}
	// single player
	else if (gm == TIME_TRIAL) {
		//tell server who is playing the game
		socket.emit('sp_tt', { user_name: myGame.name });
		myGame.isOnMenu = false;
		myGame.menuManager.selectingTTD = false;
		console.log("Game: " + difficulty);
		//create game
		myGame.gameManager.newGame( gm, difficulty );
	}
	//single player challenge mode
	else if (gm == SINGLE_CHALLENGE) {
	//tell server who is playing the game
		socket.emit('sp_ch', { user_name: myGame.name });
		myGame.isOnMenu = false;
		//create game
		myGame.gameManager.newGame( gm );
	
	//tutorial mode
	}else if( gm == TUTORIAL ){
	
		myGame.isOnMenu = false;
		//create game
		myGame.gameManager.newGame( gm );
	
	}
	
	//flag saying the player in not on the single or multiplayer mode
	myGame.menuManager.onSPMenu = false;
	myGame.menuManager.onMPMenu = false;
}

//update function. call update on the gameManager and menuManager
Game.prototype.update = function(){

	if( !this.isOnMenu ){
		this.gameManager.update();
	}else{
		this.menuManager.update();
	}
}

//run is the function that will update everything and continue gameplay
var run = function( ){

	myGame.update();
	myGame.draw();

}

//draw the graphics of the menuManager and gameManager
Game.prototype.draw = function(){

	if( this.isOnMenu ){
		this.menuManager.draw( this.graphics );
	}else{
		this.gameManager.draw( this.graphics );
	}

}