
var TIME_TRIAL = 1;
var SINGLE_CHALLENGE = 2;
var MULTI_RACE = 3;
var MULTI_CHALLENGE = 4;

function GameManager( gameObject ){

	this.parentGame = gameObject;

	this.ship = new Ship();
	this.shipHeight = this.ship.height;
	
	//An array of levels
	this.levelLayout = new Array();
	
	this.opponentLevelLayout = new Array();
	
	this.currentLevel = 0;
	
	//length of a level layout
	this.layoutSize = 1;
	
	//Buffer array for challenge mode
	this.challengeBuffer = new Array();
	
	//Scroll offset
	this.so = 0;
	
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
	
	this.opShip = new Ship();
	this.opSO = 0;
	this.opLevel = 0;
	
}

GameManager.prototype.newGame = function( gm ){

	console.log("New Game");

	this.gameMode = gm;
	
	if( this.gameMode == TIME_TRIAL ){
		this.generateLevelLayout( this.levelLayout, false, false );
	} else if( this.gameMode == MULTI_RACE ){
		
		this.generateLevelLayout( this.levelLayout, true, true, this.opponentLevelLayout );

	}else{
		this.initChallengeBuffer();
	}
	
	//Sets all states to those to start a new game
	
	this.ship.xPos = sw/2;
	this.ship.yPos = sh/4;
	
	this.opShip.xPos = sw/2;
	this.opShip.yPos = 3*sh/4;
	
	//document.addEventListener('keydown', gameHandleKeyDown);
	//document.addEventListener('keyup', gameHandleKeyUp);

}

GameManager.prototype.generateLevelLayout = function( levels, multi, top, opLevels ){

	initializeLevels( this.levelLayout, multi, top, opLevels );

}

GameManager.prototype.initChallengeBuffer = function(){

	//initialize the challenge level buffer

}

GameManager.prototype.generateChallengeLevel = function(){

	//Create a new challenge level in the challenge buffer

}

GameManager.prototype.draw = function( graphics ){

	//graphics.clearRect(0,0,sw, sh);
	this.drawBackground( graphics );
	this.drawShip( graphics );
	this.drawBlocks( graphics );
	
	if( this.isMulti() ){
		this.drawOpShip( graphics );
		this.drawOpBlocks(graphics);
	}
	
	if( this.pause ) this.drawPause( graphics );

}

GameManager.prototype.update = function(){

	if( this.pause ) return;
	
	/*
	this.opSO += 2;
	
	if( this.opShip.xPos > (this.opLevel + 1) * sw ){
		this.opLevel++;
	}
	
	if( this.opShip.xPos < (this.opLevel * sw ) ){
		this.opLevel--;
	}
	*/
	
	if( this.gameMode == SINGLE_CHALLENGE || this.gameMode == MULTI_CHALLENGE ){
	
		//check if we need to add a new level
	
	}

	if( this.thrust ){
		this.ship.thrust();
	}
	
	//If one of them, but not both (exclusive OR)
	if( this.leftTurn ^ this.rightTurn ){
		if( this.leftTurn ){
			this.ship.leftTurn();
		}else{
			this.ship.rightTurn();
		}
	}
	
	//scroll velocity is linked to the x-velocity of the ship
	var sv = this.ship.update();
	
	this.so += sv;
	
	//update active blocks
	
	if( this.ship.xPos > (this.currentLevel + 1) * sw ){
		this.currentLevel++;
	}
	
	if( this.ship.xPos < (this.currentLevel * sw ) ){
		this.currentLevel--;
	}
	
	for( i in this.levelLayout[this.currentLevel].blocks ){
			
		if( hasCollidedWithShip(this.ship, this.levelLayout[this.currentLevel].blocks[i] , this.isMulti()) ){
		//if( false ){			
			console.log("Collision");
			
			var respawnPoint = this.currentLevel * sw;
			
			if( this.currentLevel == 0 ) respawnPoint+=(2*bw);
			
			var respawnOffset = this.ship.xPos - respawnPoint;
			
			if( this.currentLevel == 0 ) respawnOffset-=(2*bw);
			
			this.so-=respawnOffset;
			
			this.ship.xPos = respawnPoint;
			
			this.ship.yPos = sh/4;
			this.ship.vx = 0;
			this.ship.vy = 0;
					
			break;
		}
			
	}

}

GameManager.prototype.isMulti = function(){
	return ( this.gameMode == MULTI_RACE || this.gameMode == MULTI_CHALLENGE );
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

	graphics.clearRect(100,100,100, 100);

	graphics.fillStyle ="black";

	graphics.fillRect(0, 0, sw, sh);
	
	//graphics.fillStyle = "green";
	//graphics.fillRect( 100, 100, 100, 100 );
	
	//console.log("Back");
}

GameManager.prototype.drawBlocks = function( graphics ){

	graphics.strokeStyle = "green";
	
	for( var i = this.currentLevel - 1; i <= this.currentLevel + 1; ++i){
	
		if( i < 0 ) i = 0;
		if( i >= this.levelLayout.size ) break;
	
		var currentBlocks = this.levelLayout[i].blocks;
	
		for( blockIndex in currentBlocks ){
			
			var b = currentBlocks[blockIndex];
			graphics.beginPath();
			
			graphics.moveTo(b.points[0].x - this.so, b.points[0].y);
			graphics.lineTo(b.points[1].x - this.so, b.points[1].y);
			
			graphics.moveTo(b.points[1].x - this.so, b.points[1].y);
			graphics.lineTo(b.points[2].x - this.so, b.points[2].y);
			
			graphics.moveTo(b.points[2].x - this.so, b.points[2].y);
			graphics.lineTo(b.points[3].x - this.so, b.points[3].y);
			
			//graphics.closePath();
			graphics.moveTo(b.points[3].x - this.so, b.points[3].y);
			graphics.lineTo(b.points[0].x - this.so, b.points[0].y);
			graphics.stroke();
			
		}
		
	}

}

GameManager.prototype.drawOpBlocks = function( graphics ){

	graphics.strokeStyle = "green";
	
	for( var i = this.opLevel - 1; i <= this.opLevel + 1; ++i){
	
		if( i < 0 ) i = 0;
		if( i >= this.levelLayout.size ) break;
	
		var currentBlocks = this.opponentLevelLayout[i].blocks;
	
		for( blockIndex in currentBlocks ){
			
			var b = currentBlocks[blockIndex];
			graphics.beginPath();
			
			graphics.moveTo(b.points[0].x - this.opSO, b.points[0].y);
			graphics.lineTo(b.points[1].x - this.opSO, b.points[1].y);
			
			graphics.moveTo(b.points[1].x - this.opSO, b.points[1].y);
			graphics.lineTo(b.points[2].x - this.opSO, b.points[2].y);
			
			graphics.moveTo(b.points[2].x - this.opSO, b.points[2].y);
			graphics.lineTo(b.points[3].x - this.opSO, b.points[3].y);
			
			//graphics.closePath();
			graphics.moveTo(b.points[3].x - this.opSO, b.points[3].y);
			graphics.lineTo(b.points[0].x - this.opSO, b.points[0].y);
			graphics.stroke();
			
		}
		
	}

}

GameManager.prototype.drawShip = function( graphics ){
		
	graphics.lineWidth = 1;
	graphics.strokeStyle = "red";
	
	var height = ( this.gameMode == MULTI_RACE || this.gameMode == MULTI_CHALLENGE ) ? this.shipHeight * .5 : this.shipHeight;
	
	graphics.beginPath();
	graphics.moveTo(
		this.ship.xPos + height * Math.cos( PI/2 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( PI/2 + this.ship.rotation ));
	graphics.lineTo(
		this.ship.xPos + height * Math.cos( -2*PI/6 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( -2*PI/6 + this.ship.rotation ));
	
	graphics.moveTo(
		this.ship.xPos + height * Math.cos( -2*PI/6 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( -2*PI/6 + this.ship.rotation ));
	graphics.lineTo(
		this.ship.xPos + height * Math.cos( 8*PI/6 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( 8*PI/6 + this.ship.rotation ));
	
	graphics.moveTo(
		this.ship.xPos + height * Math.cos( 8*PI/6 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( 8*PI/6 + this.ship.rotation ));
	graphics.lineTo(
		this.ship.xPos + height * Math.cos( PI/2 + this.ship.rotation ) - this.so, 
		this.ship.yPos - height * Math.sin( PI/2 + this.ship.rotation ));
	graphics.stroke();
}

GameManager.prototype.drawOpShip = function( graphics ){
		
	graphics.lineWidth = 1;
	graphics.strokeStyle = "red";
	
	var height = ( this.gameMode == MULTI_RACE || this.gameMode == MULTI_CHALLENGE ) ? this.shipHeight * .5 : this.shipHeight;
	
	graphics.beginPath();
	graphics.moveTo(
		this.opShip.xPos + height * Math.cos( PI/2 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( PI/2 + this.opShip.rotation ));
	graphics.lineTo(
		this.opShip.xPos + height * Math.cos( -2*PI/6 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( -2*PI/6 + this.opShip.rotation ));
	
	graphics.moveTo(
		this.opShip.xPos + height * Math.cos( -2*PI/6 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( -2*PI/6 + this.opShip.rotation ));
	graphics.lineTo(
		this.opShip.xPos + height * Math.cos( 8*PI/6 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( 8*PI/6 + this.opShip.rotation ));
	
	graphics.moveTo(
		this.opShip.xPos + height * Math.cos( 8*PI/6 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( 8*PI/6 + this.opShip.rotation ));
	graphics.lineTo(
		this.opShip.xPos + height * Math.cos( PI/2 + this.opShip.rotation ) - this.opSO, 
		this.opShip.yPos - height * Math.sin( PI/2 + this.opShip.rotation ));
	graphics.stroke();
}

GameManager.prototype.drawPause = function( graphics ){

	//draw the pause menu

}

function gameHandleKeyDown(e){
		
	if( myGame.gameManager.pause ) return;	
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
	
	case KEYCODE_LEFT:
		myGame.gameManager.leftTurn = true;
		break;
	case KEYCODE_RIGHT:
		myGame.gameManager.rightTurn = true;
		break;
	case KEYCODE_UP:
		myGame.gameManager.thrust = true;
		break;
		
	}
}

function gameHandleKeyUp(e){
		
	if( myGame.gameManager.pause ) return;
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
			
	case KEYCODE_LEFT:
		myGame.gameManager.leftTurn = false;
		break;
	case KEYCODE_RIGHT:
		myGame.gameManager.rightTurn = false;
		break;
	case KEYCODE_UP:
		myGame.gameManager.thrust = false;
		break;
			
	}
	
}

function gameHandleClick(e){



}
