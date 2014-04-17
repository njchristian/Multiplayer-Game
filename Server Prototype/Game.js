

function Game( g, s, n ){

	this.graphics = g;
	
	this.socket = s;
	
	this.name = n;
	
	//<!-- this.socket = io.connect("http://localhost:10001"); -->
	//this.socket = io.connect("http://localhost:8000");

	/*this.userName = 'tester';

	this.socket.on('welcome', function(data)
		{
			console.log('got welcome message', data );
		}
	);
	this.socket.on('test', function(data)
		{
			console.log('got test');
			console.log(data);
		}
	);
	this.socket.on('notification', function(data)
		{
			console.log('notification');
			console.log(data);
		}
	);

	var message = { user_name : this.userName };
	this.socket.emit( 'login', message );
	*/
	
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



function goToGame( gm ){
	
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
					console.log('waiting for opponent');
				}
		});
		
		socket.on(
			'opponentForChallenge',
			function(message) {
				//if (message) {
					myGame.isOnMenu = false;
					myGame.gameManager.newGame( gm );
				//}
		});
	}
	// single player
	else if (gm == TIME_TRIAL) {
		socket.emit('sp_tt', { user_name: myGame.name });
		myGame.isOnMenu = false;
		myGame.gameManager.newGame( gm );
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