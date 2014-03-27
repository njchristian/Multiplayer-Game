

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

	this.xPos+=this.vx;
	this.yPos+=this.vy;
	
	return this.vx;

}

Ship.prototype.thrust = function( isMulti ){

	var multiMulti = isMulti ? .5 : 1;
	//console.log("Thrust");
	this.vx += (Math.cos( this.rotation + PI/2 )*.5);
	this.vy -= (Math.sin( this.rotation + PI/2 )*.5) * multiMulti;

}

Ship.prototype.leftTurn = function(){

	this.rotation+=this.TURNSPEED;

}

Ship.prototype.rightTurn = function(){

	this.rotation-=this.TURNSPEED;

}


