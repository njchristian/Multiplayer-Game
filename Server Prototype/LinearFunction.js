/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file is for calculating if two lines have intersected.
	Used in collision detection.
	
	Requires Node.js and socket.io
*/


//Intersect two linear functions
function intersect(l1, l2){
		
	var x = (l2.b - l1.b)/(l1.m - l2.m);
	var result = new Point( x, (l1.m * x + l1.b) );
	return result;
}

function LinearFunction( p1, p2 ){
		
	if( p2.x == p1.x ){
		this.isVertical = true;
		this.b = p1.x;
		this.m = 0;
	}else{
		this.isVertical = false;
		this.m = (p2.y - p1.y)/(p2.x - p1.x);
		this.b = p1.y - this.m * p1.x;
				
	}
		
}