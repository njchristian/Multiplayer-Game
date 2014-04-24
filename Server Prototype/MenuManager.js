var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

var TT_EASY = 1;
var TT_MEDIUM = 2;
var TT_HARD = 3;
var CHALLENGE = 4;
var RATING = 5;
var RACE = 6;


//Pass the parent game object, and a graphics object to measure text with
function MenuManager( gameObject, g ){

	this.currentScreen = MAIN_MENU;
	this.parentGame = gameObject;
	
	//The main menu is an array of text objects
	this.mainMenu = new Array();
	this.createMainMenu( g );
	
	this.instructionMenu = new Array();
	this.createInstructionMenu( g );
	
	this.highscoreMenu = new Array();
	this.createHighscoreMenu( g );
	
	this.singlePlayerMenu = new Array();
	this.createSPMenu( g );
	
	this.multiPlayerMenu = new Array();
	this.createMPMenu( g );	
	
	this.difficultyMenu = new Array();
	
	this.waitingScreen = new Array();
	this.createWaitingScreen( g );
	
	this.createDifficultyMenu( g );	
	
	this.instructionShip = new Ship();
	
	this.leftTurn = false;
	this.rightTurn = false;
	this.thrust = false;
	
	this.thrustC = 0;
	
	//this.hsStyle = TT_EASY;
	this.hsStyle = 0; // zero means no mode selected yet
	
	// true for showing overall high scores; false for showing individual
	this.hsIsOverall = true; 
	
	this.playerNames = new Array(10);
	for (var i = 0; i < this.playerNames.length; ++i) {
		// if (i == 9) {
			// this.playerNames[i] = "- ";
		// } else {
			this.playerNames[i] = " - ";
		// }
	}
	this.playerScores = new Array(10);
	for (var i = 0; i < this.playerScores.length; ++i) {
		this.playerScores[i] = " - ";
	}
	
	this.isWaiting = false;
	this.waitAnim = 0;
	this.onSPMenu = false;
	this.onMPMenu = false;	
	this.selectingTTD = false;
}


MenuManager.prototype.drawInstructionShip = function( graphics, ship ){
		
	graphics.lineWidth = 1;
	graphics.strokeStyle = "red";

	//console.log("Offset: " + offset);
	
	var height = myGame.gameManager.shipHeight;
	var tHeight= myGame.gameManager.shipThrustHeight;
	
	var tc;
	if( this.thrustC < 2 ){
		tc = 5;
	}else{
		tc = 3;
	}
	
	graphics.beginPath();
	graphics.moveTo(
		ship.xPos + height * Math.cos( PI/2 + ship.rotation ), 
		ship.yPos - height * Math.sin( PI/2 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( -2*PI/6 + ship.rotation ), 
		ship.yPos - height * Math.sin( -2*PI/6 + ship.rotation ));
	
	graphics.moveTo(
		ship.xPos + height * Math.cos( -2*PI/6 + ship.rotation ), 
		ship.yPos - height * Math.sin( -2*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( 8*PI/6 + ship.rotation ), 
		ship.yPos - height * Math.sin( 8*PI/6 + ship.rotation ));
	
	graphics.moveTo(
		ship.xPos + height * Math.cos( 8*PI/6 + ship.rotation ), 
		ship.yPos - height * Math.sin( 8*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( PI/2 + ship.rotation ), 
		ship.yPos - height * Math.sin( PI/2 + ship.rotation ));
	//graphics.stroke();
	
	if( this.thrust ){
	
		graphics.moveTo(
			ship.xPos + tHeight * Math.cos( -5*PI/12 + ship.rotation ), 
			ship.yPos - tHeight * Math.sin( -5*PI/12 + ship.rotation ));
		graphics.lineTo(
			ship.xPos + (height + tc) * Math.cos( 3*PI/2 + ship.rotation ), 
			ship.yPos - (height + tc) * Math.sin( 3*PI/2 + ship.rotation ));
		
		graphics.moveTo(
			ship.xPos + (height + tc) * Math.cos( 3*PI/2 + ship.rotation ), 
			ship.yPos - (height + tc) * Math.sin( 3*PI/2 + ship.rotation ));
		graphics.lineTo(
			ship.xPos + tHeight * Math.cos( 17*PI/12 + ship.rotation ), 
			ship.yPos - tHeight * Math.sin( 17*PI/12 + ship.rotation ));
		
		
	}
	graphics.stroke();
}

MenuManager.prototype.createMainMenu = function( g ){

	g.font = sh/8+"px Courier";
	
	this.mainMenu[0] = new CanvasText( "SINGLE PLAYER", sw/2, (sh/12)*5.25, g.measureText( "SINGLE PLAYER" ).width, sh/8, true, toSPMenu );
	// this.mainMenu[0] = new CanvasText( "TIME TRIAL", sw/2, (sh/12)*3.75, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, TIME_TRIAL ); // was 235
	//this.mainMenu[1] = new CanvasText( "CHALLENGE", sw/2, (sh/12)*4.85, g.measureText( "CHALLENGE" ).width, 60, true, goToGame, SINGLE_CHALLENGE ); // was 305
	
	
	this.mainMenu[1] = new CanvasText( "MULTIPLAYER", sw/2, (sh/12)*7.25, g.measureText( "MULTIPLAYER" ).width, sh/8, true, toMPMenu ); // was 460
	// this.mainMenu[2] = new CanvasText( "ONLINE CHALLENGE", sw/2, (sh/12)*8.55, g.measureText( "ONLINE CHALLENGE" ).width, 60, true, goToGame, MULTI_CHALLENGE); // was 530
	
	g.font = sh/10.25+"px Courier";
	this.mainMenu[2] = new CanvasText( "INSTRUCTIONS", sw/4, (sh/12)*10.25, g.measureText( "INSTRUCTIONS" ).width, sh/10.25, true, toInstructions ); // 600
	this.mainMenu[3] = new CanvasText( "HIGHSCORES", 3*sw/4, (sh/12)*10.25, g.measureText( "HIGHSCORES" ).width, sh/10.25, true, toHighscores ); // 600
	g.font = sh/8+"px Courier";
	this.mainMenu[4] = new CanvasText( "TUTORIAL", sw/2, (sh/12)*3.25, g.measureText( "TUTORIAL" ).width, sh/8, true, goToGame, TUTORIAL);

}

function selectDifficulty( ){

	myGame.menuManager.selectingTTD = true;

}

function unselectDifficulty( ) {
	
	myGame.menuManager.selectingTTD = false;
}

function goToTimeTrial( difficulty ){

	console.log("MenuManager: " + difficulty);
	goToGame( TIME_TRIAL, difficulty );

}

MenuManager.prototype.createWaitingScreen = function( g ){
	g.font = sh/11+"px Courier";
	
	this.waitingScreen[0] = new CanvasText( "Back to Menu", sw/2, (sh/12)*7, g.measureText( "Back to Menu" ).width, sh/11, true, toMainMenu );
}

MenuManager.prototype.createDifficultyMenu = function( g ){

	g.font = sh/10+"px Courier";
	
	this.difficultyMenu[0] = new CanvasText( "EASY", sw/2, (sh/12)*4, g.measureText( "EASY" ).width, sh/10, true, goToTimeTrial,  1); // 600
	this.difficultyMenu[1] = new CanvasText( "MEDIUM", sw/2, (sh/12)*5.5, g.measureText( "MEDIUM" ).width, sh/10, true, goToTimeTrial,  2); // 600
	this.difficultyMenu[2] = new CanvasText( "HARD", sw/2, (sh/12)*7, g.measureText( "HARD" ).width, sh/10, true, goToTimeTrial,  3); // 600
	
	g.font = sh/12+"px Courier";
	
	this.difficultyMenu[3] = new CanvasText( "Back to Menu", sw/2, (sh/12)*8.25, g.measureText( "Back to Menu").width, sh/12, true, unselectDifficulty);

}

MenuManager.prototype.createInstructionMenu = function( g ){

	g.font = sh/10+"px Courier";
	
	this.instructionMenu[0] = new CanvasText( "MAIN MENU", 3*sw/4, (sh/10)*9, g.measureText( "MAIN MENU" ).width, sh/10, true, toMainMenu ); // 600

}

MenuManager.prototype.createHighscoreMenu = function( g ){

	g.font = sh/10+"px Courier";
	
	this.highscoreMenu[0] = new CanvasText( "MAIN MENU", sw/2, (sh/10)*9, g.measureText( "MAIN MENU" ).width, sh/10, true, toMainMenu ); // 600
	
	g.font = sh/20+"px Courier";
	
	var w = g.measureText("Challenge").width;

	this.highscoreMenu[1] = new CanvasText( "Challenge", sw/8, (sh/10)*8.8, w, sh/20, true, setHighscoreStyle, CHALLENGE); // 650
	var w = g.measureText("Easy").width; 
	this.highscoreMenu[2] = new CanvasText( "Easy", sw/3.5, (sh/10)*8, w, sh/20, true, setHighscoreStyle, TT_EASY); // 595
	var w = g.measureText("Medium").width;
	
	this.highscoreMenu[3] = new CanvasText( "Medium", sw/2.2, (sh/10)*8, w, sh/20, true, setHighscoreStyle, TT_MEDIUM); // 630
	var w = g.measureText("Hard").width; 
	this.highscoreMenu[4] = new CanvasText( "Hard", (sw/16)*10, (sh/10)*8, w, sh/20, true, setHighscoreStyle, TT_HARD); // 595
	
	this.highscoreMenu[5] = new CanvasText( "Personal", (sw/12)*10, (sh/10)*8.8, g.measureText( "Personal" ).width, sh/20, true, setHSPersonal);
	this.highscoreMenu[6] = new CanvasText( "Overall", (sw/12)*10, (sh/10)*9.6, g.measureText( "Overall" ).width, sh/20, true, setHSOverall);
	
	this.highscoreMenu[7] = new CanvasText( "MP Ratings", sw/8, (sh/10)*9.6, g.measureText( "MP Ratings" ).width, sh/20, true, setHighscoreStyle, RATING);
	
	this.highscoreMenu[8] = new CanvasText( "Online Race", (sw/12)*10, sh/10*8, g.measureText( "Online Race" ).width, sh/20, true, setHighscoreStyle, RACE); // need to add the function to call and all that jazz
	
}

function setHSOverall() {
	myGame.menuManager.hsIsOverall = true;
	setHighscoreStyle(myGame.menuManager.hsStyle);
}
function setHSPersonal() {
	myGame.menuManager.hsIsOverall = false;
	setHighscoreStyle(myGame.menuManager.hsStyle);
}

// create the sub menu for the single player modes
MenuManager.prototype.createSPMenu = function( g ) {
	g.font = sh/12+"px Courier";
	
	this.singlePlayerMenu[0] = new CanvasText( "TIME TRIAL", sw/2, (sh/12)*4.5, g.measureText( "TIME TRIAL" ).width, sh/12, true, selectDifficulty, TIME_TRIAL );
	this.singlePlayerMenu[1] = new CanvasText( "CHALLENGE", sw/2, (sh/12)*6, g.measureText( "CHALLENGE" ).width, sh/12, true, goToGame, SINGLE_CHALLENGE );
	this.singlePlayerMenu[2] = new CanvasText( "Back to Menu", sw/2, (sh/12)*7.5, g.measureText( "Back to Menu").width, sh/12, true, backToMenu );
}

// create the sub menu for the multi player modes
MenuManager.prototype.createMPMenu = function( g ) {
	g.font = sh/12+"px Courier";
	
	this.multiPlayerMenu[0] = new CanvasText( "ONLINE RACE", sw/2, (sh/12)*4.5, g.measureText( "ONLINE RACE" ).width, sh/12, true, goToGame, MULTI_RACE ); 
	g.font = sh/14+"px Courier";
	this.multiPlayerMenu[1] = new CanvasText( "ONLINE CHALLENGE", sw/2, (sh/12)*6, g.measureText( "ONLINE CHALLENGE" ).width, sh/14, true, goToGame, MULTI_CHALLENGE); 
	g.font = sh/12+"px Courier";
	this.multiPlayerMenu[2] = new CanvasText( "Back to Menu", sw/2, (sh/12)*7.5, g.measureText( "Back to Menu").width, sh/12, true, backToMenu );
}

//draw the single player mode menu
MenuManager.prototype.drawSPMenu = function( graphics ) {
	
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect( sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/12+"px Courier";
	graphics.fillStyle = "green";
	
	if ( this.singlePlayerMenu[0].mouseOn ) {
		graphics.strokeText("TIME TRIAL", sw/2, (sh/12)*4.5);
	} else {
		graphics.fillText("TIME TRIAL", sw/2, (sh/12)*4.5);
	}
	
	if ( this.singlePlayerMenu[1].mouseOn ) {
		graphics.strokeText("CHALLENGE", sw/2, (sh/12)*6);
	} else {
		graphics.fillText("CHALLENGE", sw/2, (sh/12)*6);
	}
		
	if ( this.singlePlayerMenu[2].mouseOn ) {
		graphics.strokeText("Back to Menu", sw/2, (sh/12)*7.5);
	} else {
		graphics.fillText("Back to Menu", sw/2, (sh/12)*7.5);
	}	
		
}

// draw the multiplayer mode menu
MenuManager.prototype.drawMPMenu = function( graphics ) {
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect( sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/12+"px Courier";
	graphics.fillStyle = "green";
	
	if ( this.multiPlayerMenu[0].mouseOn ) {
		graphics.strokeText("ONLINE RACE", sw/2, (sh/12)*4.5);
	} else {
		graphics.fillText("ONLINE RACE", sw/2, (sh/12)*4.5);
	}
	
	graphics.font = sh/14+"px Courier";
	
	if ( this.multiPlayerMenu[1].mouseOn ) {
		graphics.strokeText("ONLINE CHALLENGE", sw/2, (sh/12)*6);
	} else {
		graphics.fillText("ONLINE CHALLENGE", sw/2, (sh/12)*6);
	}
		
	graphics.font = sh/12+"px Courier";	
		
	if ( this.multiPlayerMenu[2].mouseOn ) {
		graphics.strokeText("Back to Menu", sw/2, (sh/12)*7.5);
	} else {
		graphics.fillText("Back to Menu", sw/2, (sh/12)*7.5);
	}	
}


MenuManager.prototype.update = function(){

	if( this.currentScreen == INSTRUCTIONS ){
		this.instructionShipUpdate();
	}

}

MenuManager.prototype.draw = function( graphics ){

	graphics.fillStyle ="#000000";
	graphics.fillRect(0,0,sw, sh);

	if( this.currentScreen == MAIN_MENU ){
		this.drawMainMenu(graphics);
		if (this.onSPMenu) {
			//console.log("I'm suppose to draw the SP menu now");
			this.drawSPMenu( graphics );
		} else if(this.onMPMenu) {
			this.drawMPMenu( graphics );
		}
		
		if( this.isWaiting ){
			//console.log("Waiting");
			this.drawWaiting( graphics );
		}else if( this.selectingTTD ){
			this.drawSelectTTD( graphics );
		}
		
	}else if( this.currentScreen == INSTRUCTIONS ){
		this.drawInstructions(graphics);
	}else if( this.currentScreen == HIGHSCORES ){
		this.drawHighscores(graphics);
	}

}

MenuManager.prototype.drawMainMenu = function( graphics ){
	
	//Draw main menu
	
	graphics.fillStyle ="green";
	graphics.strokeStyle ="red";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.lineWidth = 1;
	
	graphics.font = sh/5+"px Courier";
	
	
	graphics.strokeText("SPACE ESCAPE",sw/2, sh/12); //was 75
	
	graphics.lineWidth = 2;
	graphics.font = sh/8+"px Courier";
	graphics.strokeStyle ="green";
	
	
	//graphics.strokeText("SINGLE PLAYER", sw/2, (sh/12)*2.5); // was 160
	
	
	//graphics.strokeText("MULTIPLAYER", sw/2, (sh/12)*6.25); // was 385
	
	//graphics.font = sh/11+"px Courier";
	
	
	if( this.mainMenu[0].mouseOn && !this.onSPMenu && !this.onMPMenu && !this.isWaiting ){
		
		graphics.strokeText("SINGLE PLAYER", sw/2, (sh/12)*5.25); // was 235
	}else{
	
		graphics.fillText("SINGLE PLAYER", sw/2, (sh/12)*5.25); // was 235
	}
	
	
	if( this.mainMenu[1].mouseOn && !this.onSPMenu && !this.onMPMenu && !this.isWaiting ){
		
		graphics.strokeText("MULTIPLAYER", sw/2, (sh/12)*7.25); // was 460
	}else{
		
		graphics.fillText("MULTIPLAYER", sw/2, (sh/12)*7.25);
	}
	
	
	graphics.font = sh/10.25+"px Courier";
	// graphics.lineWidth = 1;
	
	if( this.mainMenu[2].mouseOn && !this.onSPMenu && !this.onMPMenu && !this.isWaiting ){
		
		graphics.strokeText("INSTRUCTIONS", sw/4, (sh/12)*10); // was 600
	}else{
		
		graphics.fillText("INSTRUCTIONS", sw/4, (sh/12)*10);
	}
	
	if( this.mainMenu[3].mouseOn && !this.onSPMenu && !this.onMPMenu && !this.isWaiting ){
	
		graphics.strokeText("HIGHSCORES", 3*sw/4, (sh/12)*10); // was 600
	}else{
		
		graphics.fillText("HIGHSCORES", 3*sw/4, (sh/12)*10);
	}
	
	graphics.font = sh/8+"px Courier";
	// graphics.strokeStyle ="red";
	// graphics.fillStyle ="red";
	if( this.mainMenu[4].mouseOn && !this.onSPMenu && !this.onMPMenu && !this.isWaiting ){
		graphics.strokeText("TUTORIAL", sw/2, (sh/12)*3.25);
	}else{
		graphics.fillText("TUTORIAL", sw/2, (sh/12)*3.25);
	}
	
	// graphics.strokeStyle = "green";
	
	graphics.beginPath();
	
	graphics.moveTo( 7*sw/8, sh/2 );
	graphics.lineTo( sw, sh/8 );
	graphics.stroke();
	
	graphics.moveTo( 7*sw/8, sh/2 );
	graphics.lineTo( sw, 7*sh/8 );
	graphics.stroke();
	
	graphics.moveTo( sw/8, sh/2 );
	graphics.lineTo( 0, sh/8 );
	graphics.stroke();
	
	graphics.moveTo( sw/8, sh/2 );
	graphics.lineTo( 0, 7*sh/8 );
	graphics.stroke();
	
	
}

MenuManager.prototype.drawInstructions = function( graphics ){

	//Draw instructions
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = sh/5+"px Courier";
	
	
	graphics.strokeText("INSTRUCTIONS",sw/2, (sh/12)); // was 75
	
	graphics.font = sh/25+"px Courier";
	
	graphics.fillText("MOVE THROUGH THE OBSTACLES WITH YOUR SHIP!",sw/2, (sh/10)*2); // 150
	
	graphics.textAlign = 'left';
	graphics.font = sh/20+"px Courier";

	graphics.strokeText("CONTROLS",10, (sh/10)*3); // 210
	graphics.strokeText("GAME MODES",10, (sh/10)*6); // 370
	
	graphics.font = sh/25+"px Courier";

	graphics.fillText("UP ARROW: THRUST SHIP",10,(sh/10)*3.5); // 240
	graphics.fillText("LEFT/RIGHT ARROWS: ROTATE SHIP",10,(sh/10)*4); // 270
	graphics.fillText("P: PAUSE",10,(sh/10)*4.5); // 300
	
	graphics.font = sh/33+"px Courier";
	
	graphics.fillText("TIME TRIAL: RACE THROUGH THE LEVELS TO COMPLETE THE COURSE AS FAST AS YOU CAN!",10,(sh/10)*6.5); // 400
	graphics.fillText("CHALLENGE: 1 LIFE, GO AS FAR AS YOU CAN AND DON'T BLINK!",10,(sh/10)*7); // 430
	graphics.fillText("MULTIPLAYER: COMPETE IN A RACE OR CHALLENGE WITH ANOTHER PLAYER",10,(sh/10)*7.5); // 460
	
	graphics.textAlign = 'center';
	graphics.font = sh/10+"px Courier";
	
	if( this.instructionMenu[0].mouseOn ){
		
		graphics.strokeText("MAIN MENU", 3*sw/4, (sh/10)*9); // 600
	}else{
		
		graphics.fillText("MAIN MENU", 3*sw/4, (sh/10)*9); // 600
	}

	this.drawInstructionShip( graphics, this.instructionShip );
}

MenuManager.prototype.instructionShipUpdate = function(){

	var ship = this.instructionShip;

	//Thrust calculations need to know if its multi-player or not to scale
	if( this.thrust ){
		this.thrustC = (this.thrustC + 1)%4;
		ship.thrust( false );
	}
	
	//If one of them, but not both (exclusive OR)
	if( this.leftTurn ^ this.rightTurn ){
		if( this.leftTurn ){
			ship.leftTurn();
		}else{
			ship.rightTurn();
		}
	}

	ship.xPos+=ship.vx;
	ship.yPos+=ship.vy;

	if( ship.xPos > sw+ship.height ){
		ship.xPos = -ship.height;
	}else if ( ship.xPos < -ship.height ){
		ship.xPos = sw + ship.height;
	}
	
	if( ship.yPos > sh + ship.height ){
		ship.yPos = -ship.height;
	}else if( ship.yPos < -ship.height ){
		ship.yPos = sh + ship.height;
	}
	
}

MenuManager.prototype.drawWaiting = function( graphics ){

	//draw the waiting screen
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect( sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'left';
	
	graphics.font = sh/11+"px Courier";
	graphics.fillStyle = "green";
	
	var w = graphics.measureText( "Waiting...").width/2;
	
	if (this.waitAnim < fps/4){
		graphics.fillText("Waiting", sw/2-w, (sh/12)*5);
	}else if (this.waitAnim < fps/2){
		graphics.fillText("Waiting.", sw/2-w, (sh/12)*5);
	}else if (this.waitAnim < 3*fps/4){
		graphics.fillText("Waiting..", sw/2-w, (sh/12)*5);
	}else{
		graphics.fillText("Waiting...", sw/2-w, (sh/12)*5);
	}
	
	graphics.textAlign = 'center';
	
	if (this.waitingScreen[0].mouseOn) {
		graphics.strokeText("Back to Menu", sw/2, (sh/12)*7);
	} else {
		graphics.fillText("Back to Menu", sw/2, (sh/12)*7);
	}
	
	this.waitAnim = (this.waitAnim+1)%fps;
	
}


MenuManager.prototype.drawSelectTTD = function( graphics ){

	//draw the pause menu
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/10+"px Courier";
	
	graphics.fillStyle = "green";
	
	if(this.difficultyMenu[0].mouseOn){
		graphics.strokeText("Easy", sw/2, (sh/12)*4);
	}else{
		graphics.fillText("Easy", sw/2, (sh/12)*4);
	}
	
	if(this.difficultyMenu[1].mouseOn){
		graphics.strokeText("Medium", sw/2, (sh/12)*5.5);
	}else{
		graphics.fillText("Medium", sw/2, (sh/12)*5.5);
	}
	
	if(this.difficultyMenu[2].mouseOn){
		graphics.strokeText("Hard", sw/2, (sh/12)*7);
	}else{
		graphics.fillText("Hard", sw/2, (sh/12)*7);
	}
	
	graphics.font = sh/12+"px Courier";
	
	if(this.difficultyMenu[3].mouseOn) {
		graphics.strokeText("Back to Menu", sw/2, (sh/12)*8.25);
	} else {
		graphics.fillText("Back to Menu", sw/2, (sh/12)*8.25);
	}
	
}

MenuManager.prototype.drawHighscores = function( graphics ){

	//Draw highscores
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = sh/5+"px Courier";
	
	
	graphics.strokeText("HIGHSCORES",sw/2,sh/12); // was 75
	
	graphics.font = sh/10+"px Courier";
	
	if( this.highscoreMenu[0].mouseOn ){
		
		graphics.strokeText("MAIN MENU", sw/2, (sh/10)*9); // 600
	}else{
		
		graphics.fillText("MAIN MENU", sw/2, (sh/10)*9); // 600
	}
	
	//Draw table
	
	graphics.lineWidth = 5;
	
	graphics.beginPath();
	
	graphics.moveTo(sw/10, (sh/10)*3); // 170
	graphics.lineTo(9*sw/10, (sh/10)*3); // 170
	graphics.stroke();
	
	
	
	graphics.lineWidth = 1;
	graphics.font = sh/12+"px Courier";
	
	if (this.hsIsOverall) {
		graphics.strokeText("(Overall)", sw/2, (sh/10)*1.9); 
	} else {
		graphics.strokeText("(Personal)", sw/2, (sh/10)*1.9);
	}
	
	graphics.font = sh/15+"px Courier";
	
	graphics.strokeText("Player", sw/5, (sh/10)*2.65); // 150
	
	
	// 
	if ( this.hsStyle == CHALLENGE ) {
		graphics.strokeText("Score", 4*sw/5, (sh/10)*2.65); // 150
	} else if ( this.hsStyle == RATING ) {
		graphics.strokeText("Rating", 4*sw/5, (sh/10)*2.65);
	} else {
		graphics.strokeText("Time", 4*sw/5, (sh/10)*2.65); // 150
	}
	
	//
	
	graphics.font = sh/20+"px Courier";
	
	var styleText;
	switch (this.hsStyle){
	
	case TT_EASY:
		styleText = "Time Trial: Easy";
		break;
	case TT_MEDIUM:
		styleText = "Time Trial: Medium";
		break;
	case TT_HARD:
		styleText = "Time Trial: Hard";
		break;
	case CHALLENGE:
		styleText = "Challenge";
		break;
	case RATING:
		styleText = "MP Ratings";
		break;
	case RACE:
		styleText = "Online Race";
		break;
	default:
		styleText = "";
		break;
	}
	
	graphics.textAlign = 'center';
	
	graphics.fillText(styleText, sw/2, (sh/10)*2.65); // 150
	
	
	//Output names
	graphics.font = sh/20+"px Courier";
	graphics.textAlign = 'left';
	var i = 0;
	
	
	for( i = 0; i < this.playerNames.length; ++i){
		var text = "";
		text = text + (i+1) + ". ";
		if( i<9) text = text + ' ';
		text = text + this.playerNames[i];
		
		//make sure not to draw on the highscore buttons
		//if( ( (sh/10)*8 ) > ( (sh/10)*3.6 + 35*(i+1) ) ) { 
			graphics.strokeText(text, sw/10, (sh/10)*3.35 + (sh/23)*i); // was 210 + 35*i
		//}
	}
	
	/*
	for( var j = i; j < 10; ++j ){
		var text = "";
		
		text = text + (j+1) + ". ..."; // this got broken somehow
		graphics.strokeText(text, sw/10, (sh/10)*3.35 + 35*j); // was 210 + 35*i
	}
	*/
	
	graphics.textAlign = 'right';
	
	for( i = 0; i < this.playerScores.length; ++i){
		var text = this.playerScores[i];
	
		graphics.strokeText(text, 9*sw/10, (sh/10)*3.35 + (sh/23)*i); // was 210 + 35*i
	}
	
	/*
	for( var j = i; j < 10; ++j ){
		
		graphics.strokeText("...", 9*sw/10, (sh/10)*3.35 + 35*j); // was 210 + 35*i
	}
	*/
	
	//graphics.textAlign = 'left';
	graphics.textAlign = 'center';
	graphics.font = sh/20+"px Courier";
	
	
	graphics.fillText("Time Trial:", sw/8, (sh/10)*8); // 560
	
	if( this.highscoreMenu[1].mouseOn ){
		graphics.strokeText("Challenge", sw/8, (sh/10)*8.8); // 560
	} else {
		graphics.fillText("Challenge", sw/8, (sh/10)*8.8); // 560
	}
	
	if( this.highscoreMenu[2].mouseOn ){
		graphics.strokeText("Easy", sw/3.5, (sh/10)*8); // 595
	} else {
		graphics.fillText("Easy", sw/3.5, (sh/10)*8); // 595
	}
	
	if( this.highscoreMenu[3].mouseOn ){
		graphics.strokeText("Medium", sw/2.2, (sh/10)*8); // 630
	} else {
		graphics.fillText("Medium", sw/2.2, (sh/10)*8); // 630
	}
	
	if( this.highscoreMenu[4].mouseOn ){
		graphics.strokeText("Hard", (sw/16)*10, (sh/10)*8); // 595
	} else {
		graphics.fillText("Hard", (sw/16)*10, (sh/10)*8); // 595
	}
	
	if( this.highscoreMenu[5].mouseOn ){
		graphics.strokeText("Personal", (sw/12)*10, (sh/10)*8.8);
	} else {
		graphics.fillText("Personal", (sw/12)*10, (sh/10)*8.8);
	}
	
	if( this.highscoreMenu[6].mouseOn ){
		graphics.strokeText("Overall", (sw/12)*10, (sh/10)*9.6);
	} else {
		graphics.fillText("Overall", (sw/12)*10, (sh/10)*9.6);
	}
	
	if( this.highscoreMenu[7].mouseOn ) {
		graphics.strokeText("MP Ratings", sw/8, (sh/10)*9.6);
	} else {
		graphics.fillText("MP Ratings", sw/8, (sh/10)*9.6);
	}
	
	if( this.highscoreMenu[8].mouseOn ){
		graphics.strokeText("Online Race", (sw/12)*10, (sh/10)*8); // 595
	} else {
		graphics.fillText("Online Race", (sw/12)*10, (sh/10)*8); // 595
	}
	
	//graphics.textAlign = 'center';
	
	// graphics.lineWidth = 3;
	
	// graphics.beginPath();
	
	// graphics.moveTo( 0, (sh/10)*9.2 );
	// graphics.lineTo( sw/2, (sh/10)*9.2 );
	// graphics.stroke();
	
	// graphics.lineWidth = 1;
}

MenuManager.prototype.clearHighScores = function() {
	for (var i = 0; i < this.playerNames.length; ++i) {
		// if ( i == 9 ) {
			// this.playerNames[i] = "- ";
		// } else {
			this.playerNames[i] = " - ";
		// }
		this.playerScores[i] = " - ";
	}
}

MenuManager.prototype.setRatings = function(data) {
	for (var i = 0; i < 10; ++i) {
		//console.log("ith rating: " + data[i].rating);
		if(data[i] !== null && data[i] !== undefined) { // should this be null or undefined??
			this.playerNames[i] = data[i].playerName;
			this.playerScores[i] = data[i].rating;
		} else {
			// if ( i == 9 ) {
				// this.playerNames[i] = "- ";
			// } else {
				this.playerNames[i] = " - ";
			// }
			this.playerScores[i] = " - ";
		}
	}
}

MenuManager.prototype.setDistanceHighScores = function(data) {
	for (var i = 0; i < 10; ++i) {
		if(data[i] !== null && data[i] !== undefined) { 
			this.playerNames[i] = data[i].playerName;
			this.playerScores[i] = data[i].dist;
			console.log("dist: " + data[i].dist);
		} else {
			// if ( i == 9 ) {
				// this.playerNames[i] = "- ";
			// } else {
				this.playerNames[i] = " - ";
			// }
			this.playerScores[i] = " - ";
		}
	}
}

MenuManager.prototype.setTimeHighScores = function(data) {
	for (var i = 0; i < 10; ++i) {
		if (data[i] !== null && data[i] !== undefined) {
			this.playerNames[i] = data[i].playerName;
			this.playerScores[i] = data[i].time;
			console.log("time: " + data[i].time);
		} else {
			// if ( i == 9 ) {
				// this.playerNames[i] = "- ";
			// } else {
				this.playerNames[i] = " - ";
			// }
			this.playerScores[i] = " - ";
		}
	}
}

function toMainMenu(){

	if (myGame.menuManager.isWaiting) {
		myGame.socket.emit('stopWaiting', { userName: myGame.name } );
		myGame.menuManager.onMPMenu = false;
		myGame.menuManager.isWaiting = false;
	}
	
	if (myGame.menuManager.currentScreen == HIGHSCORES) {
		myGame.menuManager.clearHighScores();
		myGame.menuManager.hsStyle = 0;
	}
	myGame.menuManager.currentScreen = MAIN_MENU;

}

function toInstructions(){

	myGame.menuManager.currentScreen = INSTRUCTIONS;
	myGame.menuManager.instructionShip.xPos = sw/2;
	myGame.menuManager.instructionShip.yPos = sh/2;
	myGame.menuManager.instructionShip.rotation = 0;
	myGame.menuManager.instructionShip.vx = 0;
	myGame.menuManager.instructionShip.vy = 0;
	myGame.menuManager.leftTurn = false;
	myGame.menuManager.rightTurn = false;
	myGame.menuManager.thrust = false;

}

function toHighscores(){

	myGame.menuManager.currentScreen = HIGHSCORES;

}


function toSPMenu() {
	//console.log("in toSPMenu");
	myGame.menuManager.onSPMenu = true;
}


function toMPMenu() {
	myGame.menuManager.onMPMenu = true;
}

function backToMenu() {
	myGame.menuManager.onSPMenu = false;
	myGame.menuManager.onMPMenu = false;
}


function menuHandleClick(event){
	
	if( myGame.isOnMenu ){
	
		var menu;
	
		switch (myGame.menuManager.currentScreen){
	
		case MAIN_MENU:
			if (myGame.menuManager.onSPMenu) {
				if( myGame.menuManager.selectingTTD ){
					menu = myGame.menuManager.difficultyMenu;
				}else{
					menu = myGame.menuManager.singlePlayerMenu;
				}
			}
			else if (myGame.menuManager.onMPMenu) {
					menu = myGame.menuManager.multiPlayerMenu;
			}
			else if ( myGame.menuManager.isWaiting ) {
					menu = myGame.menuManager.waitingScreen;
			}
			else{
				menu = myGame.menuManager.mainMenu;
			}
			break;
		
		case INSTRUCTIONS:
			menu = myGame.menuManager.instructionMenu;
			break;
	
		case HIGHSCORES:
			menu = myGame.menuManager.highscoreMenu;
			break;
		
		default:
			return;
	
		}
	
		for( textElement in menu ){
		
			var text = menu[textElement];
		
			if( text.clicked( event.clientX, event.clientY ) ){
			
				console.log("Here");
				text.callback( text.argument );
				document.body.style.cursor = 'default';
			
			}
		
		}
	
	}else{
	
		if(myGame.gameManager.gameOver){
			
			var text = myGame.gameManager.endRTM;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.callback( );
			
			}
		
		}else if(myGame.gameManager.pause){
			var text = myGame.gameManager.rtmText;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.callback( );
			
			}
		
			text = myGame.gameManager.reText;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.callback();
			
			}
			
		}
	}

}

function menuHandleScroll( event ){

	//console.log( "Scroll" );

	if( myGame.isOnMenu ){
	
		var menu;
	
		switch (myGame.menuManager.currentScreen){
	
		case MAIN_MENU:
			if (myGame.menuManager.onSPMenu) {
				if( myGame.menuManager.selectingTTD ){
					menu = myGame.menuManager.difficultyMenu;
				}else{
					menu = myGame.menuManager.singlePlayerMenu;
				}
			}
			else if (myGame.menuManager.onMPMenu) {
				menu = myGame.menuManager.multiPlayerMenu;
			}
			else if ( myGame.menuManager.isWaiting ) {
					menu = myGame.menuManager.waitingScreen;
				}
			else{
				menu = myGame.menuManager.mainMenu;
			}			
			break;
		
		case INSTRUCTIONS:
			menu = myGame.menuManager.instructionMenu;
			break;
		
		case HIGHSCORES:
			menu = myGame.menuManager.highscoreMenu;
			break;
		
		default:
			return;
	
		}
	
		for( textElement in menu ){
		
			var text = menu[textElement];
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				text.mouseOn = true;
				document.body.style.cursor = 'pointer';
				break;
			
			}else{
				text.mouseOn = false;
				document.body.style.cursor = 'default';
			}
			
		}
		
	}else{
	
		if(myGame.gameManager.gameOver){
			
			var text = myGame.gameManager.endRTM;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				myGame.gameManager.endScroll = true;
			
			}else{
			
				myGame.gameManager.endScroll = false;
			
			}
		
		}else if(myGame.gameManager.pause){
			var text = myGame.gameManager.rtmText;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				myGame.gameManager.rtmScroll = true;
			
			}else{
			
				myGame.gameManager.rtmScroll = false;
			
			}
			
			text = myGame.gameManager.reText;
			
			if( text.clicked( event.clientX, event.clientY ) ){
			
				myGame.gameManager.reScroll = true;
			
			}else{
			
				myGame.gameManager.reScroll = false;
			
			}
		}
		
	}	

}

function setHighscoreStyle( style ){

	myGame.menuManager.hsStyle = style;
	socket.emit('highScoresRequest', { scoreType: style, isOverall: myGame.menuManager.hsIsOverall, userName: myGame.name });
	
	socket.on(
			'highScoresResponse',
			function(data) {
				if (data) {
					console.log("Got the high scores response.");
					if (style == CHALLENGE) {
						myGame.menuManager.clearHighScores();
						myGame.menuManager.setDistanceHighScores(data.scores);
					}
					else if (style == RATING) {
						console.log("Rating response");
						myGame.menuManager.clearHighScores();
						myGame.menuManager.setRatings(data.scores);
					}
					else {
						myGame.menuManager.clearHighScores();
						myGame.menuManager.setTimeHighScores(data.scores);
					}
				}
		});	
	

}










