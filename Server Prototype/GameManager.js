
var TIME_TRIAL = 1;
var SINGLE_CHALLENGE = 2;
var MULTI_RACE = 3;
var MULTI_CHALLENGE = 4;
var TUTORIAL = 5;

var T_STAGE1 = 1;
var T_STAGE2 = 2;
var T_STAGE3 = 3;
var T_STAGE4 = 4;
var T_STAGE5 = 5;

function GameManager( gameObject, g, websocket, userName ){

	this.parentGame = gameObject;
	this.g = g;
	this.gravityCoefficient = 0;
	
	this.socket = websocket;
	this.name = userName; // store the user name

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
	this.challengeSV = 2;
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
	//this.progress = 0; //used to log progess
	
	this.winner = false;
	this.gameOver = false;
	
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
	
	g.font = sh/10+"px Courier";
	this.rtmText = new CanvasText( "MAIN MENU", sw/2, sh/2, g.measureText( "MAIN MENU" ).width, 65, true, goToMenu );
	this.rtmScroll = false;
	
	this.reText = new CanvasText( "RESTART", sw/2, sh/2 + 100, g.measureText( "RESTART" ).width, 65, true, restart );
	this.reScroll = false
	
	g.font = sh/15+"px Courier";
	this.endRTM = new CanvasText( "MAIN MENU", sw/2, sh/2 + 175, g.measureText( "MAIN MENU" ).width, 45, true, goToMenu );
	this.endScroll = false;
	
	this.isTutorial = false
	this.tutorialPause = false;
	this.tutorialStage = 1;
	this.playerLeft = false;
	
	this.difficulty
	
}

GameManager.prototype.newGame = function( gm, difficulty ){

	console.log("New Game");
	timer.clearTime();
	this.gameMode = gm;
	this.highChallengeScore = 0;
	this.highChallengeScore = 0;
	
	//Sets all states to those to start a new game
	this.dead = false;
	this.pause = false;
	this.deathCounter = 0;
	this.raceProgress = 0;
	this.gameOver = false;
	this.bulletSet = new Array();
	//Flags for ship movement
	this.thrust = false;
	this.leftTurn = false;
	this.rightTurn = false;
	
	if( gm == TIME_TRIAL ){
		console.log( "Game Manager: " + difficulty);
		this.difficulty = difficulty;
	}
	
	this.challengeSV = 2;
	
	this.ship.xPos = sw/2;
	this.ship.yPos = sh/2;
	if( this.isMulti() ){
		this.ship.yPos = sh/4;
	}
	this.ship.vx = 0;
	this.ship.vy = 0;
	this.ship.rotation = -1*PI/2;
	
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
	
	this.tutorialStage = 1;
	if( gm == TUTORIAL ){
		this.isTutorial = true;
	}else{
		this.isTutorial = false;
	}
	
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
	
		if( this.gameMode == TUTORIAL ){
			this.generateTutorial();
		}
	
	}

}

GameManager.prototype.generateLevelLayout = function( levels, multi, top, opLevels ){

	if( !this.isMulti() ){
		initializeLevels( this.levelLayout, multi, top, opLevels, this.difficulty );
	}else{
		initializeLevels( this.levelLayout, multi, top, opLevels );
	}

}

GameManager.prototype.generateTutorial = function( ){

	initializeTutorial( this.levelLayout );
	this.tutorialPause = true;

}


GameManager.prototype.initChallengeBuffer = function(){

	var multi = this.isMulti();

	//initialize the challenge level buffer
	initChallengeBuffer( this.challengeBuffer, multi, multi );
		
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
	this.drawTimer ( graphics );	
	this.drawBullets( graphics );
	
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
	
	if( this.gameOver ){ 
		this.drawEndGame( graphics, this.winner, this.playerLeft );
		return;
	}
	
	if( this.pause ) this.drawPause( graphics );
	if( this.tutorialPause ) this.drawTutorialPause( graphics );

}
/*
GameManager.prototype.handleUpdate = function( update ){


	var u = JSON.parse( update );
	this.opShip.xPos = u.xPos;
	this.opShip.yPos = u.yPos;
	this.opShip.rotation = u.rotation;
	
	this.opSO = u.screenOffset;

} */

GameManager.prototype.update = function(){

	if( this.pause || this.gameOver || this.tutorialPause ) return;
	
	if( this.dead ){
		this.tutorialStage = 5;
		updateDeathAnimation();
		this.so-=this.deathDSO;
		return;
	}
	
	this.tutorialStage = this.currentLevel+1;
	
	if( this.isMulti() ){
		// send own update
		this.socket.emit('update', { xPosition: this.ship.xPos, yPosition : this.ship.yPos, rotation : this.ship.rotation, screenOffset : this.so, level : this.currentLevel } );
	
		// get update object from other player
		this.socket.on(
			'newUpdate',
			function(update) {
				if (update) {
					//console.log('update x position is: ' + update.xPosition );
						//var u = JSON.parse( update );
						myGame.gameManager.opShip.xPos = update.xPosition;
						myGame.gameManager.opShip.yPos = update.yPosition + sh/2;
						myGame.gameManager.opShip.rotation = update.rotation;
						
						myGame.gameManager.opSO = update.screenOffset;
						
						myGame.gameManager.opLevel = update.level;
				}
		});	
		
		this.socket.on(
			'opponentWon',
			function(name) {
				if (name) {
					//console.log('update x position is: ' + update.xPosition );
						//var u = JSON.parse( update );
						myGame.gameManager.onLoss();
				}
		});	
		
		this.socket.on(
			'opponentLost',
			function(name) {
				if (name) {
					//console.log('update x position is: ' + update.xPosition );
						//var u = JSON.parse( update );
						myGame.gameManager.onWin();
				}
		});	
		
		this.socket.on(
			'opponentLeftGame',
			function(name) {
				if(name){
					console.log("opponentLeftGame");
					myGame.gameManager.opponentLeft();
				//user left menu
				}
		});
		
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
			this.challengeSV+=.2;
			
			makeChallengeLevel( this.challengeBuffer, this.isMulti(), true, this.currentLevel - 1, levelVar + 3 );
			//
			this.currentLevel = (this.currentLevel + 1)%4;
			//console.log( "Now in level: " + this.currentLevel );
		}else{
			this.currentLevel++;
			
			if( this.isTutorial ){
				this.tutorialStage = this.currentLevel +  1;
				//moving to a new level is a good time to tell the user something
				this.tutorialPause = true;
			}
			
			//this.generateBulletSet();
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
	
	updateCDVerticesAndLines( this.ship, this.isMulti() );
	
	for( i in collisionArray[this.currentLevel].blocks ){
			
		if( hasCollidedWithShip(this.ship, collisionArray[this.currentLevel].blocks[i] , this.isMulti(), this.isChallenge(), this.so) ){
		//if( false ){			
			//console.log("Collision");
			
			//progess is not used in single player challenge mode  and should be
			this.socket.emit('deathByWall', { user_name: this.name, progress : this.raceProgress } );
			
			this.onDeath();		
				
			break;
		}
			
	}
	
	for( i in this.bulletSet ){
	
		if( hasHitBullet( this.bulletSet[i], this.isMulti() ) ){
		
			//progess is not used in single player challenge mode and should be
			this.socket.emit('deathByBullet', { user_name: this.name, progress : this.raceProgress } );
			
			this.onDeath();		
				
			break;
		
		}
	
	}

}

GameManager.prototype.onDeath = function(){

	if( this.isChallenge() ){

		this.socket.emit('newDistance', { userName: this.name, distance: this.highChallengeScore });
	
		this.onLoss();
	
	}else{
	
		var respawnPoint = this.currentLevel * sw;
			
		if( this.currentLevel == 0 ) respawnPoint+=(2*bw);
			
		var respawnOffset = this.ship.xPos - respawnPoint;
			
		//if( this.currentLevel == 0 ) respawnOffset-=(2*bw);
		
		animateDeath( this.ship, this.currentLevel * sw, sh/4, this.so, this.isMulti(), respawnOffset);
		this.deathCounter++;	
		
		//this.deathDSO = respawnOffset/frames;
		this.deathDSO = respawnOffset/(deathAnimationTime*fps);
	
		this.dead = true;
		
		if( this.isTutorial){
			this.tutorialPause = true;
			this.tutorialStage = 5;
		}
		//setTimeout( alive, 3000 );
		
		//this.so-=respawnOffset;
			
		//this.ship.xPos = respawnPoint;
			
		//this.ship.yPos = sh/2;
		//this.ship.vx = 0;
		//this.ship.vy = 0;
		
	}
		
}

GameManager.prototype.respawn = function(){

	this.dead = false;

	var respawnPoint = this.currentLevel * sw;
			
	if( this.currentLevel == 0 ){
		respawnPoint = 2*bw;
	}
			
	this.ship.rotation = -PI/2;
	this.ship.xPos = respawnPoint;	
	if( this.isMulti() ){
		this.ship.yPos = sh/4;
	}else{
		this.ship.yPos = sh/2;
	}
	this.ship.vx = 0;
	this.ship.vy = 0;

}

GameManager.prototype.onWin = function( ){

	this.gameOver = true;
	
	if( this.isMulti() && this.gameMode == MULTI_RACE){
		console.log("Win");
		this.socket.emit('wonGame', { userName : this.name } );
	}
	
	if (this.gameMode == TIME_TRIAL) {
		console.log("Sending time");
		// console.log("name: " + this.name);
		// console.log("time: " + timer.min);
		this.socket.emit('newTime', { userName: this.name, min: timer.min, sec: timer.sec, tenth: timer.tenth, difficulty: this.difficulty });
	}

	
	this.winner = true;
	//this.parentGame.returnToMenu(); //??
}

GameManager.prototype.opponentLeft = function( ){
	
	this.playerLeft = true;
	this.gameOver = true;
	
	if( this.isMulti() && this.gameMode == MULTI_RACE){
		console.log("Player Left");
		
		//this.socket.emit('wonGame', { userName : this.name } );
	}
	
	//this.winner = true;
	//this.parentGame.returnToMenu(); //??
	
};

GameManager.prototype.onLoss = function(){
	this.gameOver = true;
	
	if( this.isMulti() && this.gameMode == MULTI_CHALLENGE){
		console.log("Lose");
		this.socket.emit('lostGame', { userName : this.name } );
	}

	
	this.winner = false;
	//this.parentGame.returnToMenu(); //??
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
	
	if( this.currentLevel <= 1 && !this.isMulti() ){
	
		if( this.isChallenge() ){
			this.drawChallengeBackground( graphics );
		}else{
			this.drawTimeTrialBackground( graphics );
		}
	}
	
	if( !this.isChallenge() ){
	
		if( this.currentLevel >= this.levelLayout.length - 3){
			
			//Draw finish line
			graphics.lineWidth = 1;
			graphics.strokeStyle = "red";
			
			graphics.beginPath();
			
			var x = (this.levelLayout.length - 1.5) * sw - this.so;
			
			graphics.moveTo( x, bw );
			graphics.lineTo( x, sh-bw );
			
			graphics.stroke();
			
			graphics.textAlign = 'center';
	
			graphics.font = sh/5+"px Courier";
			var y = sh/2;
			if( this.isMulti() ){
				y = sh/4;
			}
			graphics.strokeText( "FINISH", x, y);
			
		}
	
	}
	
	//graphics.fillStyle = "green";
	//graphics.fillRect( 100, 100, 100, 100 );
	
	//console.log("Back");
}

GameManager.prototype.drawBlocks = function( graphics ){

	graphics.strokeStyle = "green";
	graphics.lineWidth = 1;
	
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
	graphics.font = sh/15+"px Courier";
	graphics.textAlign = 'right';
	this.raceProgress = Math.floor(100*((this.ship.xPos-500)/(((this.levelLayout.length-1)*sw)-sw)))
	// graphics.strokeText("Progress: " + (this.raceProgress)-1 + "%",sw,bw/2);
	// graphics.strokeText("Progress: " + (Math.floor(100*((this.opShip.xPos-500)/(((this.levelLayout.length-1)*sw)-sw))))-1 + "%",sw,sh/2+bw/2); 
	graphics.strokeText("Progress: " + (this.raceProgress) + "%",sw,bw/2);
	graphics.strokeText("Progress: " + (Math.floor(100*((this.opShip.xPos-500)/(((this.levelLayout.length-1)*sw)-sw)))) + "%",sw,sh/2+bw/2); 
}

GameManager.prototype.drawChallengeScore = function( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = sh/15+"px Courier";
	graphics.textAlign = 'right';
	var score = Math.floor((((this.ship.xPos)/sw)*100)-50);
	if(score > this.highChallengeScore){
		this.highChallengeScore = score;
	}
	graphics.strokeText("Score: " + this.highChallengeScore,sw,bw/2);
}

GameManager.prototype.drawTimer = function( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = sh/15+"px Courier";
	graphics.textAlign = 'center';
	if(timer.min==0){		
		if(timer.sec==0){
			graphics.strokeText("0."+timer.tenth,sw/2,bw/2);
		}
		else{
			graphics.strokeText(timer.sec+"."+timer.tenth,sw/2, bw/2);
		}
	}
	else{
	if(timer.sec<10){
		if(timer.sec==0){
			graphics.strokeText(timer.min+":00."+timer.tenth,sw/2,bw/2);
		}
		else{
			graphics.strokeText(timer.min+":0"+timer.sec+"."+timer.tenth,sw/2, bw/2);
		}
	}
	else{
		graphics.strokeText(timer.min+":"+timer.sec+"."+timer.tenth, sw/2, bw/2);
	}
}
}

GameManager.prototype.drawDeaths = function ( graphics ){
	graphics.strokeStyle = "white";
	graphics.font = sh/15+"px Courier";
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

GameManager.prototype.drawTimeTrialBackground = function( g ){

	g.textAlign = 'center';
	
	g.font = sh/7+"px Courier";
	
	g.fillStyle = "green";
	g.font = sh/25+"px Courier";

	g.fillText("UP TO THRUST - LEFT/RIGHT TO TURN", sw/2 - this.so, sh/2 - 100);
	g.fillText("NAVIGATE THE OBSTACLES AND AIM FOR THE BEST TIME!", sw/2 - this.so, sh/2 + 100);
	

}

GameManager.prototype.drawChallengeBackground = function( g ){

	g.textAlign = 'center';
	
	g.font = sh/7+"px Courier";
	
	g.fillStyle = "green";
	g.font = sh/25+"px Courier";

	g.fillText("UP TO THRUST - LEFT/RIGHT TO TURN", (sw*.75) - this.so, sh/2 - 100);
	g.fillText("SURVIVE AS LONG AS YOU CAN AND GET THE BEST SCORE!", (sw*.75) - this.so, sh/2 + 100);
	

}

GameManager.prototype.drawPause = function( graphics ){

	//draw the pause menu
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/7+"px Courier";
	
	graphics.strokeText("PAUSED", sw/2, sh/2 - 100);
	
	graphics.fillStyle = "green";
	graphics.font = sh/10+"px Courier";
	
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
	
	graphics.font = sh/15+"px Courier";
	
	graphics.fillText("'P' TO CONTINUE", sw/2, sh/2 + 175 );
	
}

GameManager.prototype.drawBullets = function(g){

	for( b in this.bulletSet ){
	
		this.bulletSet[b].draw(g, this.so);
	
	}

}

//Attemp at adding a wait menu
//the error is that the graphics object doesn't have any members
// GameManager.prototype.drawWait = function( graphics )
// {	
	// //draw the wait menu
	// //graphics.lineWidth = 3;
	
	// graphics.strokeStyle = "green";
	// graphics.strokeRect( sw/2 - 200, sh/2 - 200, 500, 500 );
	
	// graphics.fillStyle = "black";
	
	// graphics.fillRect( sw/2 - 200, sh/2 - 200, 500, 500 );
	
	// //graphics.lineWidth = 1;
	
	// graphics.textAlign = 'center';
	
	// graphics.font = sh/7+"px Courier";
	
	// var text;
	// //if( won ){
		// text = "WAITING";
	// //}else{
	// //	text = "YOU SUCK"; //just for giggles but we should let the loser down softly
	// //}
	
	// graphics.strokeText(text, sw/2+50, sh/2+50 );
	
	// graphics.fillStyle = "green";
	// graphics.font = sh/15+"px Courier";
	
	// if( this.endScroll ){
		// graphics.strokeText("Main Menu", sw/2, sh/2 + 175 );
	// }else{
		// graphics.fillText("Main Menu", sw/2, sh/2 + 175 );
	// }
// };

GameManager.prototype.drawTutorialPause = function( graphics ){

	//draw the pause menu
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );

	graphics.fillStyle = "green";
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/35+"px Courier";
	
	var text = new Array();
	switch( this.tutorialStage ){
	
	case 1:
		text[0] = "Welcome to Space Escape!";
		text[1] = "Use the arrow keys to guide your ship";
		text[2] = "through the course.";
		text[2] = "Avoid the walls and obstacles!";
		text[3] = "Press 'p' to continue,";
		text[4] = "and 'p' to pause at any time";
		break;
	case 2:
		text[0] = "Here comes your first obstacle!";
		text[1] = "Carefully fly over the top.";
		text[2] = "Hitting the obstacle will destroy your ship!";
		break;
	case 3:
		text[0] = "This one will be a little more difficult!";
		text[1] = "Just control your speed, and keep it slow.";
		text[2] = "";
		text[3] = "Tip: As you get more experienced,";
		text[4] = "try turning and thrusting at the same time!";
		break;
	case 4:
		text[0] = "Congratulations!";
		text[1] = "Fly over the finish line to stop your time";
		text[2] = "And finish your game.";
		text[3] = "Now try your hand at time trial,";
		text[4] = "Or challenge mode if you're up for it!";
		break;
	case 5:
		text[0] = "Watch out!!!";
		text[1] = "Deaths will slow you down";
		text[2] = "And in challenge mode will end your game!";
		text[3] = "";
		text[4] = "Tip: At first, tap lightly on the keys";
		text[5] = "to control your speed";
		break;
	}
	
	for( i in text ){
	
		graphics.fillText(text[i], sw/2, sh/2 - 120 + 40*i);
		
	}
	
	
	
	
	graphics.font = sh/15+"px Courier";
	
	graphics.fillText("'P' TO CONTINUE", sw/2, sh/2 + 175 );
	
	graphics.stroke();
}	

GameManager.prototype.drawEndGame = function( graphics, won, playerLeft ){

	//draw the pause menu
	graphics.lineWidth = 3;
	
	graphics.strokeStyle = "green";
	graphics.strokeRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.fillStyle = "black";
	
	graphics.fillRect(  sw/2 - sw/4, sh/2 - sh/4, sw/2, sh/2 );
	
	graphics.lineWidth = 1;
	
	graphics.textAlign = 'center';
	
	graphics.font = sh/9+"px Courier";
	
	var text;
	
	if(playerLeft){
		text = "OPPONENT";
	}
	else if( won ){
		text = "YOU WON!";
	}else{
		text = "GOOD GAME!";
	}
	
	graphics.strokeText(text, sw/2+50, sh/2 - 100 );
	
	graphics.fillStyle = "green";
	if( playerLeft ){
		graphics.lineWidth = 1;
		graphics.textAlign = 'center';
		graphics.font = sh/9+"px Courier";
	}
	else{
		graphics.font = sh/13+"px Courier";
	}
	
	
	if ( playerLeft ){
		text = "LEFT";
	}
	else if( this.isChallenge() ){
		text = "SCORE: " + this.highChallengeScore;
	}else{
		text = "TIME: " + timer.min+":"+timer.sec+"."+timer.tenth;
	}
	
	graphics.fillText(text, sw/2 + 50, sh/2 + 50);
	
	graphics.font = sh/15+"px Courier";
	
	if( this.endScroll ){
		graphics.strokeText("Main Menu", sw/2 + 50, sh/2 + 175 );
	}else{
		graphics.fillText("Main Menu", sw/2 + 50, sh/2 + 175 );
	}
	
}

function gameHandleKeyDown(e){
		
	//if( myGame.isOnMenu ) return;	
	//if( myGame.gameManager.pause || myGame.isOnMenu ) return;	
		
	if (!e) { var e = window.event; }
		
	var targetManager;

	if( !myGame.isOnMenu ){
		targetManager = myGame.gameManager;
	}else{
	
		if( myGame.menuManager.currentScreen == INSTRUCTIONS ){
			targetManager = myGame.menuManager;
		}else{
			//console.log("Return");
			return;
		}
	
	}	
		
	switch (e.keyCode){
	
	case KEYCODE_LEFT:
		targetManager.leftTurn = true;
		break;
	case KEYCODE_RIGHT:
		targetManager.rightTurn = true;
		break;
	case KEYCODE_UP:
		//console.log("Thrust");
		targetManager.thrust = true;
		break;
	case KEYCODE_P:
	
		if( myGame.isOnMenu ) break;
	
		if( myGame.gameManager.tutorialPause ){
			//if the tutorial is paused we want to do something different
			myGame.gameManager.tutorialPause = false;
			break;
		}
	
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
		
	if( myGame.gameManager.pause ) return;
		
		
	if (!e) { var e = window.event; }
		
	var targetManager;

	if( !myGame.isOnMenu ){
		targetManager = myGame.gameManager;
	}else{
	
		if( myGame.menuManager.currentScreen == INSTRUCTIONS ){
			targetManager = myGame.menuManager;
		}else{
			return;
		}
	
	}
		
	switch (e.keyCode){
			
	case KEYCODE_LEFT:
		targetManager.leftTurn = false;
		break;
	case KEYCODE_RIGHT:
		targetManager.rightTurn = false;
		break;
	case KEYCODE_UP:
		targetManager.thrust = false;
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