
function(fps, sw, sh) Game{

	this.isOnMenu = true;
	
	this.menuManager = new MenuManager( this );
	this.gameManager = new GameManager( this );
}

Game.prototype.start = function(){

	this.isOnMenu = true;
	setInterval( gameLoop, 1000/fps );
	
}

Game.prototype.end = function(){

	clearInterval( gameLoop );

}

Game.prototype.returnToMenu = function(){

	menuManager.toMainMenu();
	isOnMenu = true;

}

Game.prototype.goToGame = function(){

	isOnMenu = false;
	gameManager.newGame();

}

Game.prototype.run = function(){

	Game.update();
	Game.draw();

}

Game.prototype.update = function(){

	if( !isOnMenu ){
		gameManager.update();
	}

}

Game.prototype.draw = function(){

	if( isOnMenu() ){
		menuManager.draw();
	}else{
		gameManager.update();
	}

}

