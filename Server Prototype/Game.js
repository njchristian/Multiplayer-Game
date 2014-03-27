
function Game( g ){

	this.graphics = g;
	
	this.socket = io.connect('http://' + document.location.host);
	
	this.userName = 'tester';
	
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
