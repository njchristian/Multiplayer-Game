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
	
	this.mainMenu[2] = new CanvasText( "ONLINE RACE", sw/2, 460, g.measureText( "ONLINE RACE" ).width, 60, true, goToGame, MULTI_RACE );
	this.mainMenu[3] = new CanvasText( "ONLINE CHALLENGE", sw/2, 530, g.measureText( "ONLINE CHALLENGE" ).width, 60, true, goToGame, MULTI_CHALLENGE);
	
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
	
	if( this.mainMenu[0].mouseOn ){
		graphics.strokeText("TIME TRIAL", sw/2, 235);
	}else{
		graphics.fillText("TIME TRIAL", sw/2, 235);
	}
	
	if( this.mainMenu[1].mouseOn ){
		graphics.strokeText("CHALLENGE", sw/2, 305);
	}else{
		graphics.fillText("CHALLENGE", sw/2, 305);
	}
	
	if( this.mainMenu[2].mouseOn ){
		graphics.strokeText("ONLINE RACE", sw/2, 460);
	}else{
		graphics.fillText("ONLINE RACE", sw/2, 460);
	}
	
	if( this.mainMenu[3].mouseOn ){
		graphics.strokeText("ONLINE CHALLENGE", sw/2, 530);
	}else{
		graphics.fillText("ONLINE CHALLENGE", sw/2, 530);
	}
	
	graphics.font = "65px Courier";
	
	if( this.mainMenu[4].mouseOn ){
		graphics.strokeText("INSTRUCTIONS", sw/4, 600);
	}else{
		graphics.fillText("INSTRUCTIONS", sw/4, 600);
	}
	
	if( this.mainMenu[5].mouseOn ){
		graphics.strokeText("HIGHSCORES", 3*sw/4, 600);
	}else{
		graphics.fillText("HIGHSCORES", 3*sw/4, 600);
	}
	
	
	graphics.moveTo( 3*sw/4, sh/2 );
	graphics.lineTo( sw, sh/8 );
	graphics.stroke();
	
	graphics.moveTo( 3*sw/4, sh/2 );
	graphics.lineTo( sw, 7*sh/8 );
	graphics.stroke();
	
	graphics.moveTo( sw/4, sh/2 );
	graphics.lineTo( 0, sh/8 );
	graphics.stroke();
	
	graphics.moveTo( sw/4, sh/2 );
	graphics.lineTo( 0, 7*sh/8 );
	graphics.stroke();
	
	
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

function menuHandleScroll( event ){

	//console.log( "Scroll" );

	if( !myGame.isOnMenu ) return;
	
	switch (myGame.menuManager.currentScreen){
	
	case MAIN_MENU:
	
		for( textElement in myGame.menuManager.mainMenu ){
		
			var text = myGame.menuManager.mainMenu[textElement];
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.mouseOn = true;
			
			}else{
				text.mouseOn = false;
			}
			
		}
	
	}

}












