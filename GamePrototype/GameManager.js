


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
	
	//Flags for ship movement
	this.thrust = false;
	this.leftTurn = false;
	this.rightTurn = false;
	
	//Flag for death - use later during animations
	this.dead = false;
	
	//Flag for pause menu
	this.pause = false;
	
}

Game.prototype.newGame(){

	//Sets all states to those to start a new game

}

GameManager.prototype.generateLevelLayout = function(){

	//A function to clear the current level layout, and use the level generation functions to fill it with new levels

}

GameManager.prototype.draw = function( graphics ){

	drawBackground();
	drawShip();
	drawBlocks();
	
	if( pause ) drawPause();

}

GameManager.prototype.update = function(){

	if( pause ) return;

	if( thrust ) ship.thrust();
	
	//If one of them, but not both (exclusive OR)
	if( leftTurn ^ rightTurn ){
		if( leftTurn ){
			ship.leftTurn();
		}else{
			ship.rightTurn();
		}
	}
	
	//update active blocks
	/****
	
	****/
	//
	
	for( i in activeBlocks ){
			
		if( hasCollidedWithShip(ship, activeBlocks[i]) ){
					
			init();
					
			ship.x = shipHeight;
			ship.y = stage.canvas.height/2;
			vx = 0;
			vy = 0;
					
			break;
		}
			
	}

}

GameManager.prototype.resumeGame = function(){

	pause = false;

}

GameManager.prototype.pauseGame = function(){

	pause = true;

}

GameManager.prototype.quitGame = function(){

	//Clear game state
	
	parentGame.isOnMenu = true;

}

GameManager.prototype.drawBackground = function( graphics ){

	graphics.fillStyle ="#000000";

	graphics.fillRect(0, 0, sw, sh);
}

GameManager.prototype.drawBlocks = function( graphics ){

	graphics.fillStyle = "green";
	
	for( int i = currentLevel - 1; i <= currentLevel + 1; ++i){
	
		//bounds for the first and last levels
		if( i < 0 ) i = 0;
		if( i > layoutSize ) i = layoutSize;
	
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
		
	if( pause ) return;	
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
	
	case KEYCODE_LEFT:
		leftPressed = true;
		break;
	case KEYCODE_RIGHT:
		rightPressed = true;
		break;
	case KEYCODE_UP:
		upPressed = true;
		break;
	case KEYCODE_DOWN:
		downPressed = true;
		break;
		
	}
}

function gameHandleKeyUp(e){
		
	if( pause ) return;
		
	if (!e) { var e = window.event; }
		
	switch (e.keyCode){
			
	case KEYCODE_LEFT:
		leftPressed = false;
		break;
	case KEYCODE_RIGHT:
		rightPressed = false;
		break;
	case KEYCODE_UP:
		upPressed = false;
		break;
	case KEYCODE_DOWN:
		downPressed = false;
		break;
			
	}
	
}

function gameHandleClick(e){



}
