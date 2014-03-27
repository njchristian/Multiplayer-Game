
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
	this.layoutSize = 7;
	
	//Buffer array for challenge mode
	this.challengeBuffer = new Array();
	this.challengeTotalLevels = 0;
	this.challengeSV = 4;
	this.challengeShipOffset = 0;
	
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
	
	//Sets all states to those to start a new game
	
	//Flags for ship movement
	this.thrust = false;
	this.leftTurn = false;
	this.rightTurn = false;
	
	this.ship.xPos = sw/2;
	this.ship.yPos = sh/4;
	this.ship.vx = 0;
	this.ship.vy = 0;
	
	this.opShip.xPos = sw/2;
	this.opShip.yPos = 3*sh/4;
	this.opShip.vx = 0;
	this.opShip.vy = 0;
	
	this.so = 0;
	this.currentLevel = 0;
	this.challengeTotalLevels = 0;
	
	this.levelLayout = new Array();
	this.challengeBuffer = new Array();
	
	this.levelGenerator();
	
	//document.addEventListener('keydown', gameHandleKeyDown);
	//document.addEventListener('keyup', gameHandleKeyUp);

}

GameManager.prototype.levelGenerator = function(){

	if( this.gameMode == TIME_TRIAL ){
		this.generateLevelLayout( this.levelLayout, false, false );
	} else if( this.gameMode == MULTI_RACE ){
		
		this.generateLevelLayout( this.levelLayout, true, true, this.opponentLevelLayout );

	}else if( this.gameMode == SINGLE_CHALLENGE){
		this.initChallengeBuffer();
	}else{
	
	}

}

GameManager.prototype.generateLevelLayout = function( levels, multi, top, opLevels ){

	initializeLevels( this.levelLayout, multi, top, opLevels );

}

GameManager.prototype.initChallengeBuffer = function(){

	//initialize the challenge level buffer
	initChallengeBuffer( this.challengeBuffer, false, false );
		
}

GameManager.prototype.generateChallengeLevel = function(){

	//Create a new challenge level in the challenge buffer

}

GameManager.prototype.draw = function( graphics ){

	//graphics.clearRect(0,0,sw, sh);
	this.drawBackground( graphics );
	this.drawShip( graphics, this.ship, false );
	this.drawBlocks( graphics );
	
	if( this.isMulti() ){
		this.drawShip( graphics, this.opShip, true );
		this.drawOpBlocks(graphics);
	}
	
	if( this.pause ) this.drawPause( graphics );

}

GameManager.prototype.update = function(){

	if( this.pause ) return;
	
	if( this.isMulti() ){

	
	}
	
	if( this.gameMode == SINGLE_CHALLENGE || this.gameMode == MULTI_CHALLENGE ){
	
		//check if we need to add a new level
	
	}

	if( this.thrust ){
		this.ship.thrust( this.isMulti() );
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
	
	if( this.isChallenge() ){
		this.so += this.challengeSV;
		//this.challengeShipOffset += sv;
	}else{
		this.so += sv;
	}
	
	//update active blocks
	
	var levelVar = this.isChallenge() ? this.challengeTotalLevels : this.currentLevel;
	
	if( this.ship.xPos > (levelVar + 1) * sw ){
		
		if( this.isChallenge() ){
			this.challengeTotalLevels++;
			makeChallengeLevel( this.challengeBuffer, false, false, this.currentLevel - 1, levelVar + 3 );
			//
			this.currentLevel = (this.currentLevel + 1)%4;
			console.log( "Now in level: " + this.currentLevel );
		}else{
			this.currentLevel++;
		}
		
	}
	
	if( this.ship.xPos < (this.currentLevel * sw ) ){
		this.currentLevel--;
	}
	
	//Same change as in Draw function to change to challenge mode
	
	var collisionArray = this.isChallenge() ? this.challengeBuffer : this.levelLayout;
	
	for( i in collisionArray[this.currentLevel].blocks ){
			
		if( hasCollidedWithShip(this.ship, collisionArray[this.currentLevel].blocks[i] , this.isMulti()) ){
		//if( false ){			
			console.log("Collision");
			
			this.onDeath();		
				
			break;
		}
			
	}

}

GameManager.prototype.onDeath = function(){

	if( this.isChallenge() ){

		this.parentGame.returnToMenu();
	
	}else{
	
		var respawnPoint = this.currentLevel * sw;
			
		if( this.currentLevel == 0 ) respawnPoint+=(2*bw);
			
		var respawnOffset = this.ship.xPos - respawnPoint;
			
		if( this.currentLevel == 0 ) respawnOffset-=(2*bw);
			
		this.so-=respawnOffset;
			
		this.ship.xPos = respawnPoint;
			
		this.ship.yPos = sh/4;
		this.ship.vx = 0;
		this.ship.vy = 0;
		
	}
		
}

GameManager.prototype.isMulti = function(){
	return this.gameMode == MULTI_RACE || this.gameMode == MULTI_CHALLENGE;
}

GameManager.prototype.isChallenge = function(){
	return this.gameMode == MULTI_CHALLENGE || this.gameMode == SINGLE_CHALLENGE;
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
	
	var drawArray;
	var startIndex;
	var endIndex;
	
	if( this.isChallenge() ){
		drawArray = this.challengeBuffer;
		startIndex = this.currentLevel - 1;
		if( startIndex == -1 ) startIndex == 3;
		endIndex = (this.currentLevel + 1) % 4;
	}else{
		drawArray = this.levelLayout;
		startIndex = (this.currentLevel - 1);
		endIndex = (this.currentLevel + 1);
	}
	
	for( var i = 0; i < 3; ++i){
	
		var index;
		
		if( this.isChallenge() ){
			index = (startIndex + i)%4;
			if( index < 0 ) index = 3;
		}else{
			index = startIndex + i;
			if( index < 0 ) index = 0;
		}
	
		
		if( index >= drawArray.size ) break;
	
		var currentBlocks = drawArray[index].blocks;
	
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

GameManager.prototype.drawShip = function( graphics, ship, isOp ){
		
	graphics.lineWidth = 1;
	graphics.strokeStyle = "red";
	
	var offset;
	
	if( this.isChallenge() ){
		//offset = this.challengeShipOffset + this.so;
		offset = this.so;
	}else{
		offset = isOp ? this.opSO : this.so;
	}

	//console.log("Offset: " + offset);
	
	var height = ( this.gameMode == MULTI_RACE || this.gameMode == MULTI_CHALLENGE ) ? this.shipHeight * .5 : this.shipHeight;
	
	graphics.beginPath();
	graphics.moveTo(
		ship.xPos + height * Math.cos( PI/2 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( PI/2 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( -2*PI/6 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( -2*PI/6 + ship.rotation ));
	
	graphics.moveTo(
		ship.xPos + height * Math.cos( -2*PI/6 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( -2*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( 8*PI/6 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( 8*PI/6 + ship.rotation ));
	
	graphics.moveTo(
		ship.xPos + height * Math.cos( 8*PI/6 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( 8*PI/6 + ship.rotation ));
	graphics.lineTo(
		ship.xPos + height * Math.cos( PI/2 + ship.rotation ) - offset, 
		ship.yPos - height * Math.sin( PI/2 + ship.rotation ));
	graphics.stroke();
}

GameManager.prototype.drawPause = function( graphics ){

	//draw the pause menu

}

function gameHandleKeyDown(e){
		
	if( myGame.gameManager.pause || myGame.isOnMenu ) return;	
		
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
		
	if( myGame.gameManager.pause || myGame.isOnMenu ) return;
		
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
