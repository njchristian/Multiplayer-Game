var MAIN_MENU = 1;
var INSTRUCTIONS = 2;
var HIGHSCORES = 3;

var TT_EASY = 1;
var TT_MEDIUM = 2;
var TT_HARD = 3;
var CHALLENGE = 4;


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
	
	this.instructionShip = new Ship();
	
	this.leftTurn = false;
	this.rightTurn = false;
	this.thrust = false;
	
	this.thrustC = 0;
	
	this.hsStyle = TT_EASY;
	
	this.playerNames = new Array(10);
	for (var i = 0; i < this.playerNames.length; ++i) {
		this.playerNames[i] = "";
	}
	this.playerScores = new Array(10);
	for (var i = 0; i < this.playerScores.length; ++i) {
		this.playerScores[i] = "";
	}
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

	g.font = "60px Courier";
	this.mainMenu[0] = new CanvasText( "TIME TRIAL", sw/2, (sh/12)*3.75, g.measureText( "TIME TRIAL" ).width, 60, true, goToGame, TIME_TRIAL ); // was 235
	this.mainMenu[1] = new CanvasText( "CHALLENGE", sw/2, (sh/12)*4.85, g.measureText( "CHALLENGE" ).width, 60, true, goToGame, SINGLE_CHALLENGE ); // was 305
	
	this.mainMenu[2] = new CanvasText( "ONLINE RACE", sw/2, (sh/12)*7.45, g.measureText( "ONLINE RACE" ).width, 60, true, goToGame, MULTI_RACE ); // was 460
	this.mainMenu[3] = new CanvasText( "ONLINE CHALLENGE", sw/2, (sh/12)*8.55, g.measureText( "ONLINE CHALLENGE" ).width, 60, true, goToGame, MULTI_CHALLENGE); // was 530
	
	g.font = "65px Courier";
	this.mainMenu[4] = new CanvasText( "INSTRUCTIONS", sw/4, (sh/12)*10.25, g.measureText( "INSTRUCTIONS" ).width, 65, true, toInstructions ); // 600
	this.mainMenu[5] = new CanvasText( "HIGHSCORES", 3*sw/4, (sh/12)*10.25, g.measureText( "HIGHSCORES" ).width, 65, true, toHighscores ); // 600

}

MenuManager.prototype.createInstructionMenu = function( g ){

	g.font = "65px Courier";
	this.instructionMenu[0] = new CanvasText( "MAIN MENU", 3*sw/4, (sh/10)*9, g.measureText( "MAIN MENU" ).width, 65, true, toMainMenu ); // 600

}

MenuManager.prototype.createHighscoreMenu = function( g ){

	g.font = "65px Courier";
	this.highscoreMenu[0] = new CanvasText( "MAIN MENU", 3*sw/4, (sh/10)*9, g.measureText( "MAIN MENU" ).width, 65, true, toMainMenu ); // 600
	
	g.font = "35px Courier";
	
	var w = g.measureText("Challenge").width;
	this.highscoreMenu[1] = new CanvasText( "Challenge", 325 + w/2, (sh/10)*7.75, w, 35, true, setHighscoreStyle, CHALLENGE); // 650
	var w = g.measureText("Easy").width; 
	this.highscoreMenu[2] = new CanvasText( "Easy", 20 + w/2, (sh/10)*8.25, w, 35, true, setHighscoreStyle, TT_EASY); // 595
	var w = g.measureText("Medium").width;
	this.highscoreMenu[3] = new CanvasText( "Medium", 20 + w/2, (sh/10)*8.75, w, 35, true, setHighscoreStyle, TT_MEDIUM); // 630
	var w = g.measureText("Hard").width; 
	this.highscoreMenu[4] = new CanvasText( "Hard", 150 + w/2, (sh/10)*8.25, w, 35, true, setHighscoreStyle, TT_HARD); // 595
	
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
	
	graphics.font = "120px Courier";
	
	graphics.strokeText("SPACE ESCAPE",sw/2, sh/12); //was 75
	
	graphics.lineWidth = 2;
	graphics.font = "80px Courier";
	graphics.strokeStyle ="green";
	
	graphics.strokeText("SINGLE PLAYER", sw/2, (sh/12)*2.5); // was 160
	
	graphics.strokeText("MULTIPLAYER", sw/2, (sh/12)*6.25); // was 385
	
	graphics.font = "60px Courier";
	graphics.lineWidth = 1;
	
	if( this.mainMenu[0].mouseOn ){
		graphics.strokeText("TIME TRIAL", sw/2, (sh/12)*3.75); // was 235
	}else{
		graphics.fillText("TIME TRIAL", sw/2, (sh/12)*3.75); // was 235
	}
	
	if( this.mainMenu[1].mouseOn ){
		graphics.strokeText("CHALLENGE", sw/2, (sh/12)*4.85); // was 305
	}else{
		graphics.fillText("CHALLENGE", sw/2, (sh/12)*4.85);
	}
	
	if( this.mainMenu[2].mouseOn ){
		graphics.strokeText("ONLINE RACE", sw/2, (sh/12)*7.45); // was 460
	}else{
		graphics.fillText("ONLINE RACE", sw/2, (sh/12)*7.45);
	}
	
	if( this.mainMenu[3].mouseOn ){
		graphics.strokeText("ONLINE CHALLENGE", sw/2, (sh/12)*8.55); // was 530
	}else{
		graphics.fillText("ONLINE CHALLENGE", sw/2, (sh/12)*8.55);
	}
	
	graphics.font = "65px Courier";
	
	if( this.mainMenu[4].mouseOn ){
		graphics.strokeText("INSTRUCTIONS", sw/4, (sh/12)*10.25); // was 600
	}else{
		graphics.fillText("INSTRUCTIONS", sw/4, (sh/12)*10.25);
	}
	
	if( this.mainMenu[5].mouseOn ){
		graphics.strokeText("HIGHSCORES", 3*sw/4, (sh/12)*10.25); // was 600
	}else{
		graphics.fillText("HIGHSCORES", 3*sw/4, (sh/12)*10.25);
	}
	
	graphics.beginPath();
	
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
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = "120px Courier";
	
	graphics.strokeText("INSTRUCTIONS",sw/2, (sh/12)); // was 75
	
	graphics.font = "30px Courier";
	graphics.fillText("MOVE THROUGH THE OBSTACLES WITH YOUR SHIP!",sw/2, (sh/10)*2); // 150
	
	graphics.textAlign = 'left';
	graphics.font = "40px Courier";
	graphics.strokeText("CONTROLS",10, (sh/10)*3); // 210
	graphics.strokeText("GAME MODES",10, (sh/10)*6); // 370
	
	graphics.font = "30px Courier";
	graphics.fillText("UP ARROW: THRUST SHIP",10,(sh/10)*3.5); // 240
	graphics.fillText("LEFT/RIGHT ARROWS: ROTATE SHIP",10,(sh/10)*4); // 270
	graphics.fillText("P: PAUSE",10,(sh/10)*4.5); // 300
	
	graphics.font = "25px Courier";
	graphics.fillText("TIME TRIAL: RACE THROUGH THE LEVELS TO COMPLETE THE COURSE AS FAST AS YOU CAN!",10,(sh/10)*6.5); // 400
	graphics.fillText("CHALLENGE: 1 LIFE, GO AS FAR AS YOU CAN AND DON'T BLINK!",10,(sh/10)*7); // 430
	graphics.fillText("MULTIPLAYER: COMPETE IN A RACE OR CHALLENGE WITH ANOTHER PLAYER",10,(sh/10)*7.5); // 460
	
	graphics.textAlign = 'center';
	graphics.font = "65px Courier";
	
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

MenuManager.prototype.drawHighscores = function( graphics ){

	//Draw highscores
	//Draw instructions
	graphics.fillStyle ="green";
	graphics.strokeStyle ="green";
	graphics.textAlign = 'center';
	graphics.textBaseline = 'middle';
	
	graphics.font = "120px Courier";
	
	graphics.strokeText("HIGHSCORES",sw/2,sh/12); // was 75
	
	graphics.font = "65px Courier";
	
	if( this.highscoreMenu[0].mouseOn ){
		graphics.strokeText("MAIN MENU", 3*sw/4, (sh/10)*9); // 600
	}else{
		graphics.fillText("MAIN MENU", 3*sw/4, (sh/10)*9); // 600
	}
	
	//Draw table
	
	graphics.lineWidth = 5;
	
	graphics.beginPath();
	graphics.moveTo(sw/10, (sh/10)*2.25); // 170
	graphics.lineTo(9*sw/10, (sh/10)*2.25); // 170
	graphics.stroke();
	
	graphics.font = "45px Courier";
	
	graphics.lineWidth = 1;
	
	graphics.strokeText("Player", sw/5, (sh/10)*1.9); // 150
	
	
	//
	if( this.hsStyle == CHALLENGE ){
		graphics.strokeText("Score", 4*sw/5, (sh/10)*1.9); // 150
	}else{
		graphics.strokeText("Time", 4*sw/5, (sh/10)*1.9); // 150
	}
	
	//
	
	graphics.font = "30px Courier";
	
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
		
	}
	
	graphics.textAlign = 'center';
	graphics.fillText(styleText, sw/2, (sh/10)*1.9); // 150
	
	
	//populate this array...
		
	
	//Client sends the server a request given this.hsStyle. hsStyle is the enum style description of the game type we want the highscores for.
	//It can return this in any way you want, as long as it has the player names and score
	
	
	//Output names
	graphics.font = "30px Courier";
	graphics.textAlign = 'left';
	var i = 0;
	
	
	for( i = 0; i < this.playerNames.length; ++i){
		var text = "";
		text = text + (i+1) + ". " + this.playerNames[i];
		graphics.strokeText(text, sw/10, (sh/10)*2.6 + 35*i); // was 210 + 35*i
	}
	
	
	for( var j = i; j < 10; ++j ){
		var text = "";
		text = text + (j+1) + ". ..."; // this got broken somehow
		graphics.strokeText(text, sw/10, (sh/10)*2.6 + 35*j); // was 210 + 35*i
	}
	
	graphics.textAlign = 'right';
	
	for( i = 0; i < this.playerScores.length; ++i){
		var text = this.playerScores[i];
		graphics.strokeText(text, 9*sw/10, (sh/10)*2.6 + 35*i); // was 210 + 35*i
	}
	
	
	for( var j = i; j < 10; ++j ){
		graphics.strokeText("...", 9*sw/10, (sh/10)*2.6 + 35*j); // was 210 + 35*i
	}
	
	graphics.textAlign = 'left';
	
	graphics.font = "35px Courier";
	
	graphics.fillText("Time Trial:", 20, (sh/10)*7.75); // 560
	graphics.fillText("Challenge", 325, (sh/10)*7.75); // 560
	graphics.fillText("Easy", 20, (sh/10)*8.25); // 595
	graphics.fillText("Medium", 20, (sh/10)*8.75); // 630
	graphics.fillText("Hard", 150, (sh/10)*8.25); // 595
	
	graphics.textAlign = 'center';
}

MenuManager.prototype.clearHighScores = function() {
	for (var i = 0; i < this.playerNames.length; ++i) {
		this.playerNames[i] = "";
		this.playerScores[i] = "";
	}
}

MenuManager.prototype.setDistanceHighScores = function(data) {
	for (var i = 0; i < data.length; ++i) {
		this.playerNames[i] = data[i].playerName;
		this.playerScores[i] = data[i].dist;
	}
}

MenuManager.prototype.setTimeHighScores = function(data) {
	for (var i = 0; i < data.length; ++i) {
		this.playerNames[i] = data[i].playerName;
		this.playerScores[i] = data[i].time;
	}
}

function toMainMenu(){

	if (myGame.menuManager.currentScreen == HIGHSCORES) {
		myGame.menuManager.clearHighScores();
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

function menuHandleClick(event){
	
	if( myGame.isOnMenu ){
	
		var menu;
	
		switch (myGame.menuManager.currentScreen){
	
		case MAIN_MENU:
			menu = myGame.menuManager.mainMenu;
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
		}
		
		text = myGame.gameManager.reText;
			
		if( text.clicked( event.clientX, event.clientY ) ){
			
			text.callback();
			
		}
		
	}

}

function menuHandleScroll( event ){

	//console.log( "Scroll" );

	if( myGame.isOnMenu ){
	
		var menu;
	
		switch (myGame.menuManager.currentScreen){
	
		case MAIN_MENU:
			menu = myGame.menuManager.mainMenu;
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
	socket.emit('highScoresRequest', { scoreType: style });
	
	socket.on(
			'highScoresResponse',
			function(data) {
				if (data) {
					console.log("Got the high scores response.");
					if (style == CHALLENGE) {
						myGame.menuManager.clearHighScores();
						myGame.menuManager.setDistanceHighScores(data.scores);
					}
					else {
						myGame.menuManager.clearHighScores();
						myGame.menuManager.setTimeHighScores(data.scores);
					}
				}
		});	
	

}










