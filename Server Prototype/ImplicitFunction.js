/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file is currently not being used by our game.
	
	Requires Node.js and socket.io
*/


function evaluateIm( p ){
	return this.c * p.x + this.d * p.y + this.e;
}
		
function ImplicitFunction( p1, p2 ){
		
	this.c = p1.y - p2.y;
	this.d = p2.x - p1.x;
	var m = (p1.y - p2.y) / (p1.x - p2.x);
	var b = p1.y - m * p1.x;
	this.e = b * (p1.x - p2.x);
		
	this.eval = evaluateIm;
		
}
