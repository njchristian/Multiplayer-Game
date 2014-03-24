var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

function MenuManager( gameObject ){

	this.currentScreen = MAIN_MENU;
	this.parentGame = gameObject;

}

MenuManager.prototype.draw = function( graphics ){

	if( this.currentScreen == MAIN_MENU ){
		this.drawMainMenu(graphics);
	}else if( this.currentScreen == INSTRUCTIONS ){
		this.drawInstructions(graphics);
	}else if( this.currentScreen == HIGHSCORES ){
		this.drawHighscores(graphics);
	}

}

MenuManager.prototype.drawMainMenu = function( graphics ){

	//Draw main menu
	graphics.fillRect(0,0,sw, sh);

}

MenuManager.prototype.drawInstructions = function( graphics ){

	//Draw instructions

}

MenuManager.prototype.drawHighscores = function( graphics ){

	//Draw highscores

}

MenuManager.prototype.toMainMenu = function(){

	this.currentScreen = MAIN_MENU;

}

MenuManager.prototype.toInstructions = function(){

	this.currentScreen = INSTRUCTIONS;

}

MenuManager.prototype.toHighscores = function(){

	this.currentScreen = HIGHSCORES;

}