
function Game( g ){

	this.graphics = g;
	
	this.isOnMenu = true;
	
	this.menuManager = new MenuManager( this );
	this.gameManager = new GameManager( this );
}

Game.prototype.start = function(){

	this.isOnMenu = true;
	this.menuManager.toMainMenu();
	setInterval( this.run, 1000/fps );
	
}

Game.prototype.end = function(){

	clearInterval( this.run );

}

Game.prototype.returnToMenu = function(){

	this.menuManager.toMainMenu();
	this.isOnMenu = true;

}

Game.prototype.goToGame = function(){

	this.isOnMenu = false;
	this.gameManager.newGame();

}

Game.prototype.update = function(){

	if( !this.isOnMenu ){
		this.gameManager.update();
	}
	//the menu does not need to be updated
}

Game.prototype.run = function(){

	this.update();
	this.draw();

}

Game.prototype.draw = function(){

	if( this.isOnMenu() ){
		this.menuManager.draw( graphics );
	}else{
		this.gameManager.draw( graphics );
	}

}

