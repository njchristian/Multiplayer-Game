var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

function MenuManager(sw, sh){

	this.currentScreen = MAIN_MENU;
	this.sw = sw;
	this.sh = sh;

}

MenuManager.prototype.draw = function(){

	if( currentScreen == MAIN_MENU ){
		drawMainMenu();
	}else if( currentScreen == INSTRUCTIONS ){
		drawInstructions();
	}else if( currentScreen == HIGHSCORES ){
		drawHighscores();
	}

}

MenuManager.prototype.drawMainMenu = function(){

	//Draw main menu

}

MenuManager.prototype.drawInstructions = function(){

	//Draw instructions

}

MenuManager.prototype.drawHighscores = function(){

	//Draw highscores

}