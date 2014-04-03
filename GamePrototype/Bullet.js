
var bulletSpeed = 4;

function Bullet( xPos, yPos, radius ){

	this.radius = radius;

	this.y = yPos;
	this.x = xPos;
	
	this.vx = bulletSpeed;
	
	this.update = function(){
		this.x-=this.vx;
	}

	this.draw = function( g, xOff ){
		
		g.strokeStyle = "red";
		g.beginPath();
		g.arc( this.x - xOff, this.y, this.radius, 0, 2*PI );
		g.stroke();
	
	}
	

}