var MAX_SPEED = 20;
var SHIP_HEIGHT;

function Ship(){

	this.TURNSPEED = .1;

	this.xPos = 0;
	this.yPos = 0; 
	this.rotation = 0;
	this.height = SHIP_HEIGHT;

	this.vx = 0;
	this.vy = 0;
	
}

Ship.prototype.update = function(){

	this.xPos+=this.vx;
	this.yPos+=this.vy;
	
	return this.vx;

}

Ship.prototype.thrust = function( isMulti ){

	var multiMulti = isMulti ? .5 : 1;
	//console.log("Thrust");
	
	this.vx += (Math.cos( this.rotation + PI/2 )*.5);
	if(this.vx > MAX_SPEED) this.vx = MAX_SPEED;
	if( this.vx < -MAX_SPEED ) this.vx = -MAX_SPEED
	this.vy -= (Math.sin( this.rotation + PI/2 )*.5) * multiMulti;
	if(this.vy > MAX_SPEED) this.vy = MAX_SPEED;
	if( this.vy < -MAX_SPEED ) this.vy = -MAX_SPEED

}

Ship.prototype.leftTurn = function(){

	this.rotation+=this.TURNSPEED;

}

Ship.prototype.rightTurn = function(){

	this.rotation-=this.TURNSPEED;

}

// UPDATE


function Update(){

	this.xPos;
	this.yPos;
	
	this.rotation;
	
	this.screenOffset;

}