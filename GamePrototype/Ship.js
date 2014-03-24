

function Ship(){

	this.TURNSPEED = .1;

	this.xPos = 0;
	this.yPos = 0; 
	this.rotation = 0;
	this.height = 15;

	this.vx = 0;
	this.vy = 0;
	
}

Ship.prototype.update = function(){

	xPos+=vx;
	yPos+=vy;
	
	rotation+=rotationSpeed;

}

Ship.prototype.thrust = function(){

	vx -= Math.cos( ship.rotation + PI/2 );
	vy -= Math.sin( ship.rotation + PI/2 );

}

Ship.prototype.leftTurn = function(){

	rotation-=TURNSPEED;

}

Ship.prototype.rightTurn = function(){

	rotation+=TURNSPEED;

}


