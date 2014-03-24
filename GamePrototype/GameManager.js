
var TIME_TRIAL = 1;
var SINGLE_CHALLENGE = 2;
var MULTI_RACE = 3;
var MULTI_CHALLENGE = 4;

function GameManager( gameObject ){

	this.parentGame = gameObject;

	this.ship = new Ship();
	
	//An array of levels
	this.levelLayout = new Array();
	
	this.currentLevel = 0;
	
	//length of a level layout
	this.layoutSize = 3;
	
	//Array of active blocks for collision detection
	this.activeBlocks = new Array();
	
	//Buffer array for challenge mode
	this.challengeBuffer = new Array();
	
	//Flags for ship movement
	this.thrust = false;
	this.leftTurn = false;
	this.rightTurn = false;
	
	//Flag for death - use later during animations
	this.dead = false;
	
	//Flag for pause menu
	this.pause = false;
	
	//Identify a variable for game mode.
	this.gameMode = 0;
	
}

Game.prototype.newGame = function( gm ){

	this.gameMode = gm;
	
	if( this.gameMode == TIME_TRIAL || this.gameMode == MULTI_RACE ){
		this.generateLevelLayout();
	}else{
		this.initChallengeBuffer();
	}
	
	//Sets all states to those to start a new game

}

GameManager.prototype.generateLevelLayout = function(){

	//A function to clear the current level layout, and use the level generation functions to fill it with new levels

}

GameManager.prototype.initChallengeBuffer = function(){

	//initialize the challenge level buffer

}

GameManager.prototype.generateChallengeLevel = function(){

	//Create a new challenge level in the challenge buffer

}

GameManager.prototype.draw = function( graphics ){

	this.drawBackground();
	this.drawShip();
	this.drawBlocks();
	
	if( this.pause ) this.drawPause();

}

GameManager.prototype.update = function(){

	if( this.pause ) return;
	
	if( this.gameMode == SINGLE_CHALLENGE || this.gameMode == MULTI_CHALLENGE ){
	
		//check if we need to add a new level
	
	}

	if( this.thrust ) this.ship.thrust();
	
	//If one of them, but not both (exclusive OR)
	if( this.leftTurn ^ this.rightTurn ){
		if( this.leftTurn ){
			this.ship.leftTurn();
		}else{
			this.ship.rightTurn();
		}
	}
	
	//update active blocks
	/****
	
	****/
	//
	
	for( i in this.activeBlocks ){
			
		if( hasCollidedWithShip(this.ship, this.activeBlocks[i]) ){
					
			this.ship.xPos = shipHeight;
			this.ship.yPos = stage.canvas.height/2;
			this.ship.vx = 0;
			this.ship.vy = 0;
					
			break;
		}
			
	}

}

GameManager.prototype.resumeGame = function(){

	this.pause = false;

}

GameManager.prototype.pauseGame = function(){

	this.pause = true;

}

GameManager.prototype.quitGame = function(){

	//Clear game state
	
	this.parentGame.isOnMenu = true;

}

GameManager.prototype.drawBackground = function( graphics ){

	graphics.fillStyle ="#000000";

	graphics.fillRect(0, 0, sw, sh);
}

GameManager.prototype.drawBlocks = function( graphics ){

	graphics.fillStyle = "green";
	
	for( var i = this.currentLevel - 1; i <= this.currentLevel + 1; ++i){
	
		//bounds for the first and last levels
		if( i < 0 ) i = 0;
		if( i > this.layoutSize ) i = this.layoutSize;
	
		var currentBlocks = levelLayout.at(i).blocks;
	
		for( blockIndex in currentBlocks ){
			
			var b = currentBlocks[blockIndex];
			graphics.moveTo(b.points[0].x, b.points[0].y);
			graphics.lineTo(b.points[1].x, b.points[1].y);
			graphics.stroke();
			
			graphics.moveTo(b.points[1].x, b.points[1].y);
			graphics.lineTo(b.points[2].x, b.points[2].y);
			graphics.stroke();
			
			graphics.moveTo(b.points[2].x, b.points[2].y);
			graphics.lineTo(b.points[3].x, b.points[3].y);
			graphics.stroke();
			
			graphics.moveTo(b.points[3].x, b.points[3].y);
			graphics.lineTo(b.points[0].x, b.points[0].y);
			graphics.stroke();
			
		}
		
	}

}

GameManager.prototype.drawShip = function( graphics ){
		
	graphics.fillStyle = "red";
	
	graphics.moveTo(
		ship.x + shipHeight * Math.cos( PI/2 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( PI/2 + ship.rotation ));
	graphics.lineTo(
		ship.x + shipHeight * Math.cos( -2*PI/6 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( -2*PI/6 + ship.rotation ));
	graphics.stroke();
	
	graphics.moveTo(
		ship.x + shipHeight * Math.cos( -2*PI/6 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( -2*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.x + shipHeight * Math.cos( 8*PI/6 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( 8*PI/6 + ship.rotation ));
	graphics.stroke();
	
	graphics.moveTo(
		ship.x + shipHeight * Math.cos( 8*PI/6 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( 8*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.x + shipHeight * Math.cos( PI/2 + ship.rotation ), 
		ship.y - shipHeight * Math.sin( PI/2 + ship.rotation ));
			
}

GameManager.prototype.drawPause = function(){

	//draw the pause menu

}

function gameHandleKeyDown(e){
		
	if( this.pause ) return;	
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
	
	case KEYCODE_LEFT:
		this.leftTurn = true;
		break;
	case KEYCODE_RIGHT:
		this.rightTurn = true;
		break;
	case KEYCODE_UP:
		this.thrust = true;
		break;
		
	}
}

function gameHandleKeyUp(e){
		
	if( this.pause ) return;
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
			
	case KEYCODE_LEFT:
		this.leftTurn = false;
		break;
	case KEYCODE_RIGHT:
		this.rightTurn = false;
		break;
	case KEYCODE_UP:
		this.thrust = false;
		break;
			
	}
	
}

function gameHandleClick(e){



}
