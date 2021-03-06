
var TIME_TRIAL = 1;
var SINGLE_CHALLENGE = 2;
var MULTI_RACE = 3;
var MULTI_CHALLENGE = 4;

function GameManager( gameObject, g ){

	this.parentGame = gameObject;

	this.gravityCoefficient = 0;
	
	this.ship = new Ship();
	this.shipHeight = this.ship.height;
	this.shipThrustHeight = this.shipHeight * Math.cos( PI/6 ) / Math.cos( PI/12 );
	
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
	
	this.thrustC = 0;
	this.thrustRate = 4;
	
	//Flag for death - use later during animations
	this.dead = false;
	
	//Flag for pause menu
	this.pause = false;
	
	//Identify a variable for game mode.
	this.gameMode = 0;
	
	this.opShip = new Ship();
	
	//opponent screen offset
	this.opSO = 0;
	this.opLevel = 0;
	
	this.bulletSet = new Array();
	
	this.deathCounter = 0;
	this.raceProgress = 0;
	
	this.warningCounter = 0;
	
	this.deathDSO;
	
	g.font = "65px Courier";
	this.rtmText = new CanvasText( "MAIN MENU", sw/2, sh/2, g.measureText( "MAIN MENU" ).width, 65, true, goToMenu );
	this.rtmScroll = false;
	
	this.reText = new CanvasText( "RESTART", sw/2, sh/2 + 100, g.measureText( "RESTART" ).width, 65, true, restart );
	this.reScroll = false
	
}

GameManager.prototype.newGame = function( gm ){

	console.log("New Game");
	timer.clearTime();
	this.gameMode = gm;
	
	//Sets all states to those to start a new game
	this.dead = false;
	this.pause = false;
	this.deathCounter = 0;
	this.raceProgress = 0;
	
	//Flags for ship movement
	this.thrust = false;
	this.leftTurn = false;
	this.rightTurn = false;
	
	this.ship.xPos = sw/2;
	this.ship.yPos = sh/4;
	this.ship.vx = 0;
	this.ship.vy = 0;
	this.ship.rotation = 0;
	
	this.opShip.xPos = sw/2;
	this.opShip.yPos = 3*sh/4;
	this.opShip.vx = 0;
	this.opShip.vy = 0;
	this.opShip.rotation = 0;
	
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

	}else if( this.gameMode == SINGLE_CHALLENGE || this.gameMode == MULTI_CHALLENGE){
		this.initChallengeBuffer();
	}else{
	
	}

}

GameManager.prototype.generateLevelLayout = function( levels, multi, top, opLevels ){

	initializeLevels( this.levelLayout, multi, top, opLevels );

}

GameManager.prototype.initChallengeBuffer = function(){

	var multi = this.isMulti();

	//initialize the challenge level buffer
	initChallengeBuffer( this.challengeBuffer, multi, multi );
		
}

GameManager.prototype.generateChallengeLevel = function(){

	//Create a new challenge level in the challenge buffer

}

GameManager.prototype.draw = function( graphics ){

	//graphics.clearRect(0,0,sw, sh);
	this.drawBackground( graphics );
	
	if( this.dead ){
		drawDeathAnimation( graphics );
	}else{
		this.drawShip( graphics, this.ship, false );	
	}
	
	this.drawBlocks( graphics );
	this.drawTimer ( graphics );	this.drawBullets( graphics );
	
	if(!this.isChallenge() && !this.isMulti() ){
		this.drawDeaths( graphics );
	}
	
	if(this.isChallenge()) {
		this.drawChallengeScore( graphics );
	}
	
	if( this.isMulti() ){
		this.drawShip( graphics, this.opShip, true );
		this.drawOpBlocks(graphics);
		if( !this.isChallenge()) {
			this.drawRaceProgress (graphics);
		}
	}
	
	if( this.pause ) this.drawPause( graphics );

}

GameManager.prototype.update = function(){

	if( this.pause ) return;
	
	if( this.dead ){
		updateDeathAnimation();
		this.so-=this.deathDSO;
		return;
	}
	
	//Thrust calculations need to know if its multi-player or not to scale
	if( this.thrust ){
		this.thrustC = (this.thrustC + 1)%4;
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
	
	this.ship.vy+=this.gravityCoefficient;
	
	//scroll velocity is linked to the x-velocity of the ship
	var sv = this.ship.update();
	
	if( this.isChallenge() ){
		this.so += this.challengeSV;
		//this.challengeShipOffset += sv;
	}else{
		this.so += sv;
		//console.log(this.levelLayout.size);
		if( this.ship.xPos > (this.levelLayout.length - 1.5) * sw ){
			
			this.onWin();
		}
		
	}
	
	//update active blocks
	
	var levelVar = this.isChallenge() ? this.challengeTotalLevels : this.currentLevel;
	
	if( this.ship.xPos > (levelVar + 1) * sw ){
		
		if( this.isChallenge() ){
			this.challengeTotalLevels++;
			makeChallengeLevel( this.challengeBuffer, this.isMulti(), true, this.currentLevel - 1, levelVar + 3 );
			//
			this.currentLevel = (this.currentLevel + 1)%4;
			//console.log( "Now in level: " + this.currentLevel );
		}else{
			this.currentLevel++;
			if( this.bulletSet.length == 0 ){
				this.generateBulletSet();
			}
		}
		
	}
	
	if( this.ship.xPos < (this.currentLevel * sw ) ){
		this.currentLevel--;
	}
	
	for( b in this.bulletSet ){
	
		this.bulletSet[b].update();
	
	}
	
	var bl = this.bulletSet.length;
	
	if( bl > 0 && this.bulletSet[bl-1].x < this.so ){
		this.bulletSet = new Array();
	}
	
	//Same change as in Draw function to change to challenge mode
	
	var collisionArray = this.isChallenge() ? this.challengeBuffer : this.levelLayout;
	
	updateCDVerticesAndLines( this.ship );
	
	for( i in collisionArray[this.currentLevel].blocks ){
			
		if( hasCollidedWithShip(this.ship, collisionArray[this.currentLevel].blocks[i] , this.isChallenge(), this.so) ){
		//if( false ){			
			//console.log("Collision");
			
			this.onDeath();		
				
			break;
		}
			
	}
	
	for( i in this.bulletSet ){
	
		if( hasHitBullet( this.bulletSet[i], this.isMulti() ) ){
		
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
	
		animateDeath( this.ship, this.currentLevel * sw, sh/4, this.so, this.isMulti(), respawnOffset);
		this.deathCounter++;
		
		this.deathDSO = respawnOffset/(deathAnimationTime*fps);
	
		this.dead = true;
		
	}
		
}

GameManager.prototype.respawn = function(){

	this.dead = false;

	var respawnPoint = this.currentLevel * sw;
			
	this.ship.rotation = 0;
	this.ship.xPos = respawnPoint;	
	this.ship.yPos = sh/4;
	this.ship.vx = 0;
	this.ship.vy = 0;

}

GameManager.prototype.onWin = function(){

	this.parentGame.returnToMenu();

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
	
	var so = this.so;
	
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
			
			graphics.moveTo(b.points[0].x - so, b.points[0].y);
			graphics.lineTo(b.points[1].x - so, b.points[1].y);
			
			graphics.moveTo(b.points[1].x - so, b.points[1].y);
			graphics.lineTo(b.points[2].x - so, b.points[2].y);
			
			graphics.moveTo(b.points[2].x - so, b.points[2].y);
			graphics.lineTo(b.points[3].x - so, b.points[3].y);
			
			//graphics.closePath();
			graphics.moveTo(b.points[3].x - so, b.points[3].y);
			graphics.lineTo(b.points[0].x - so, b.points[0].y);
			graphics.stroke();
			
		}
		
	}

}

GameManager.prototype.drawRaceProgress = function( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = "40px Courier";
	graphics.textAlign = 'right';
	graphics.strokeText("Progress: " + Math.floor(100*((this.ship.xPos-500)/(((this.levelLayout.length-1)*sw)-sw))) + "%",sw,bw/2);
	graphics.strokeText("Progress: " + Math.floor(100*((this.opShip.xPos-500)/(((this.levelLayout.length-1)*sw)-sw))) + "%",sw,sh/2+bw/2); 
}

GameManager.prototype.drawChallengeScore = function( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = "40px Courier";
	graphics.textAlign = 'right';
	graphics.strokeText("Score: " + Math.floor((this.ship.xPos-sw)/sw),sw,bw/2);
}

GameManager.prototype.drawTimer = function( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = "40px Courier";
	graphics.textAlign = 'center';
	if(timer.min==0){		
		graphics.strokeText(timer.sec,sw/2, bw/2);
	}
	else{
	if(timer.sec<10){
			graphics.strokeText(timer.min+":0"+timer.sec,sw/2, bw/2);
		}
		else{
			graphics.strokeText(timer.min+":"+timer.sec, sw/2, bw/2);
		}
	}
}

GameManager.prototype.drawDeaths = function ( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = "40px Courier";
	graphics.textAlign = 'right';
	graphics.strokeText("Deaths: " + this.deathCounter, sw,bw/2);
}

GameManager.prototype.drawOpBlocks = function( graphics ){

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
		drawArray = this.opponentLevelLayout;
		startIndex = (this.opLevel - 1);
		endIndex = (this.opLevel + 1);
	}
	
	var so;
	var co;
	if( this.isChallenge() ){
		so = this.so;
		co = sh/2;
	}else{
		so = this.opSO;
		co = 0;
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
			
			graphics.moveTo(b.points[0].x - so, b.points[0].y + co);
			graphics.lineTo(b.points[1].x - so, b.points[1].y + co);
			
			graphics.moveTo(b.points[1].x - so, b.points[1].y + co);
			graphics.lineTo(b.points[2].x - so, b.points[2].y + co);
			
			graphics.moveTo(b.points[2].x - so, b.points[2].y + co);
			graphics.lineTo(b.points[3].x - so, b.points[3].y + co);
			
			//graphics.closePath();
			graphics.moveTo(b.points[3].x - so, b.points[3].y + co);
			graphics.lineTo(b.points[0].x - so, b.points[0].y + co);
			graphics.stroke();
			
		}
		
	}

}

GameManager.prototype.generateBulletSet = function(){

	var rand = Math.floor((Math.random()*sh-2*bw));
	this.bulletSet[0] = new Bullet(this.so + sw, bw + rand, bw/4);
	
	rand = Math.floor((Math.random()*sh-2*bw));
	this.bulletSet[1] = new Bullet(this.so + sw + 3*bw, bw + rand, bw/4);
	
	rand = Math.floor((Math.random()*sh-2*bw));
	this.bulletSet[2] = new Bullet(this.so + sw + 6*bw, bw + rand, bw/4);
	
	rand = Math.floor((Math.random()*sh-2*bw));
	this.bulletSet[3] = new Bullet(this.so + sw + 9*bw, bw + rand, bw/4);
	
	


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
	
	var height = this.isMulti() ? this.shipHeight * .5 : this.shipHeight;
	var tHeight= this.isMulti() ? this.shipThrustHeight * .5 : this.shipThrustHeight;
	
	var tc;
	if( this.thrustC < 2 ){
		tc = 5;
	}else{
		tc = 3;
	}
	
	
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
	//graphics.stroke();
	
	if( this.thrust && !isOp ){
	
		graphics.moveTo(
			ship.xPos + tHeight * Math.cos( -5*PI/12 + ship.rotation ) - offset, 
			ship.yPos - tHeight * Math.sin( -5*PI/12 + ship.rotation ));
		graphics.lineTo(
			ship.xPos + (height + tc) * Math.cos( 3*PI/2 + ship.rotation ) - offset, 
			ship.yPos - (height + tc) * Math.sin( 3*PI/2 + ship.rotation ));
		
		graphics.moveTo(
			ship.xPos + (height + tc) * Math.cos( 3*PI/2 + ship.rotation ) - offset, 
			ship.yPos - (height + tc) * Math.sin( 3*PI/2 + ship.rotation ));
		graphics.lineTo(
			ship.xPos + tHeight * Math.cos( 17*PI/12 + ship.rotation ) - offset, 
			ship.yPos - tHeight * Math.sin( 17*PI/12 + ship.rotation ));
		
		
	}
	graphics.stroke();
}

GameManager.prototype.drawPause = function( graphics ){

	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect( sw/2 - 200, sh/2 - 200, 400, 400 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect( sw/2 - 200, sh/2 - 200, 400, 400 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = "100px Courier";
	
	graphics.strokeText("PAUSED", sw/2, sh/2 - 100);
	
	graphics.fillStyle = "green";
	graphics.font = "65px Courier";
	
	if( this.rtmScroll ){
		graphics.strokeText("MAIN MENU", sw/2, sh/2 );
	}else{
		graphics.fillText("MAIN MENU", sw/2, sh/2 );
	}
	
	if( this.reScroll ){
		graphics.strokeText("RESTART", sw/2, sh/2 + 100 );
	}else{
		graphics.fillText("RESTART", sw/2, sh/2 + 100 );
	}

}

GameManager.prototype.drawBullets = function(g){

	for( b in this.bulletSet ){
	
		this.bulletSet[b].draw(g, this.so);
	
	}

}

GameManager.prototype.handleUpdate = function( update ){

	var u = JSON.parse( update );
	this.opShip.xPos = u.xPos;
	this.opShip.yPos = u.yPos;
	this.opShip.rotation = u.rotation;
	
	this.opSO = u.screenOffset;


}

function gameHandleKeyDown(e){
		
	if( myGame.isOnMenu ) return;	
	//if( myGame.gameManager.pause || myGame.isOnMenu ) return;	
		
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
	case KEYCODE_P:
	
		if( !myGame.gameManager.isMulti() ){
			myGame.gameManager.pause = !myGame.gameManager.pause;
			myGame.gameManager.leftTurn = false;
			myGame.gameManager.rightTurn = false;
			myGame.gameManager.thrust = false;
		}
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

function alive(){

	myGame.gameManager.respawn();

}

function gameHandleClick(e){



}

function goToMenu(){
	myGame.returnToMenu();
}

function restart(){

	myGame.gameManager.newGame( myGame.gameManager.gameMode );

}

