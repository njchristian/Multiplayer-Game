var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

//Pass the parent game object, and a graphics object to measure text with
function MenuManager( gameObject, g ){

	this.currentScreen = MAIN_MENU;
	this.parentGame = gameObject;
	
	//The main menu is an array of text objects
	this.mainMenu = new Array();
	
	this.createMainMenu( g );

}

MenuManager.prototype.createMainMenu = function( g ){

	var width;

	g.font = "60px Courier";
	this.mainMenu[0] = new CanvasText( "TIME TRIAL", sw/2, 235, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, TIME_TRIAL );
	this.mainMenu[1] = new CanvasText( "CHALLENGE", sw/2, 305, g.measureText( "CHALLENGE" ).width, 60, true, goToGame, SINGLE_CHALLENGE );
	
	this.mainMenu[2] = new CanvasText( "TIME TRIAL", sw/2, 460, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, MULTI_RACE );
	this.mainMenu[3] = new CanvasText( "TIME TRIAL", sw/2, 530, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, MULTI_CHALLENGE);
	
	g.font = "65px Courier";
	this.mainMenu[4] = new CanvasText( "INSTRUCTIONS", sw/4, 600, g.measureText( "INSTRUCTIONS" ).width, 65, true, toInstructions );
	this.mainMenu[5] = new CanvasText( "HIGHSCORES", 3*sw/4, 600, g.measureText( "HIGHSCORES" ).width, 65, true, toHighscores );

}

MenuManager.prototype.draw = function( graphics ){

	graphics.fillStyle ="#000000";
	graphics.fillRect(0,0,sw, sh);

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
	
	
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = "140px Courier";
	
	graphics.strokeText("MAIN MENU",sw/2,75);
	
	graphics.font = "80px Courier";
	
	graphics.strokeText("SINGLE PLAYER", sw/2, 160);
	
	graphics.strokeText("MULTIPLAYER", sw/2, 385);
	
	graphics.font = "60px Courier";
	
	graphics.fillText("TIME TRIAL", sw/2, 235);
	
	graphics.fillText("CHALLENGE", sw/2, 305);
	
	graphics.fillText("ONLINE RACE", sw/2, 460);
	
	graphics.fillText("ONLINE CHALLENGE", sw/2, 530);
	
	graphics.font = "65px Courier";
	
	graphics.fillText("INSTRUCTIONS", sw/4, 600);
	graphics.fillText("HIGHSCORES", 3*sw/4, 600);

}

MenuManager.prototype.drawInstructions = function( graphics ){

	//Draw instructions

}

MenuManager.prototype.drawHighscores = function( graphics ){

	//Draw highscores

}

function toMainMenu(){

	myGame.menuManager.currentScreen = MAIN_MENU;

}

function toInstructions(){

	myGame.menuManager.currentScreen = INSTRUCTIONS;

}

function toHighscores(){

	myGame.menuManager.currentScreen = HIGHSCORES;

}

function menuHandleClick(event){
	
	if( !myGame.isOnMenu ) return;
	
	switch (myGame.menuManager.currentScreen){
	
	case MAIN_MENU:
	
		for( textElement in myGame.menuManager.mainMenu ){
		
			var text = myGame.menuManager.mainMenu[textElement];
		
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.callback( text.argument );
			
			}
		
		}
	
	}

}












