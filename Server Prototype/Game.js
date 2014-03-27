
function Game( g ){

	this.graphics = g;
	
	this.socket = io.connect("http://localhost:10001");

	this.userName = 'tester';

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
	
	this.isOnMenu = true;
	
	this.gameManager = new GameManager( this );
	this.menuManager = new MenuManager( this, g );
	
	
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

	this.menuManager.toMainMenu();
	this.isOnMenu = true;

}

function goToGame( gm ){

	myGame.isOnMenu = false;
	myGame.gameManager.newGame( gm );

}

Game.prototype.update = function(){

	if( !this.isOnMenu ){
		this.gameManager.update();
	}
	//the menu does not need to be updated
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

