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
	g.font = "140px Courier";
	this.mainMenu[0] = new CanvasText("MAIN MENU", sw/2, 75, g.measureText("MAIN MENU").width, 140, false, null, null );
	
	g.font = "80px Courier";
	this.mainMenu[1] = new CanvasText( "SINGLE PLAYER", sw/2, 200, g.measureText( "SINGLE PLAYER" ).width, 80, false, null, null );
	this.mainMenu[2] = new CanvasText( "MULTIPLAYER", sw/2, 425, g.measureText( "MULTIPLAYER" ).width, 80, false, null, null );
	
	g.font = "60px Courier";
	this.mainMenu[3] = new CanvasText( "TIME TRIAL", sw/2, 275, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, TIME_TRIAL );
	this.mainMenu[4] = new CanvasText( "CHALLENGE", sw/2, 345, g.measureText( "CHALLENGE" ).width, 60, true, goToGame, SINGLE_CHALLENGE );
	
	//this.mainMenu[5] = new CanvasText( "TIME TRIAL", sw/2, 275, g.measureText( "TIME TRIAL" ).width, 60 );
	//this.mainMenu[6] = new CanvasText( "TIME TRIAL", sw/2, 275, g.measureText( "TIME TRIAL" ).width, 60 );

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
	
	graphics.font = "60px Courier";
	
	graphics.fillText("TIME TRIAL", sw/2, 275);
	
	graphics.fillText("CHALLENGE", sw/2, 345);
	
	graphics.fillText("ONLINE RACE", sw/2, 500);
	
	graphics.fillText("ONLINE CHALLENGE", sw/2, 570);

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

function menuHandleClick(event){
	
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












