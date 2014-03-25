var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

function MenuManager( gameObject ){

	this.currentScreen = MAIN_MENU;
	this.parentGame = gameObject;
	
	//The main menu is an array of text objects
	this.mainMenu = new Array();

}

MenuManager.prototype.draw = function( graphics ){

	if( this.currentScreen == MAIN_MENU ){
		this.drawMainMenu(graphics);
	}else if( this.currentScreen == INSTRUCTIONS ){
		this.drawInstructions(graphics);
	}else if( this.currentScreen == HIGHSCORES ){
		this.drawHighscores(graphics);
	}

	//this.parentGame.goToGame();
}

MenuManager.prototype.drawMainMenu = function( graphics ){
	
	//Draw main menu
	graphics.fillStyle ="#000000";
	graphics.fillRect(0,0,sw, sh);
	
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = "140px Courier";
	
	graphics.strokeText("MAIN MENU",sw/2,75);
	
	graphics.font = "80px Courier";
	
	graphics.strokeText("SINGLE PLAYER", sw/2, 200);
	
	graphics.strokeText("MULTIPLAYER", sw/2, 425);
	
	graphics.font = "80px Courier";
	
	graphics.fillText("TIME TRIAL", sw/2, 275);
	
	graphics.fillText("CHALLENGE", sw/2, 345);
	
	//graphics.font = "100px 

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