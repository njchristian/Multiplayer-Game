/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file has the block class. A block is the building block for levels.
	
	Requires Node.js and socket.io
*/


function Block(p1, p2, p3, p4){
	
	this.points = new Array();
	this.points[0] = p1;
	this.points[1] = p2;
	this.points[2] = p3;
	this.points[3] = p4;
		
	this.lines = new Array();
	this.lines[0] = new LinearFunction(p1, p2);
	this.lines[1] = new LinearFunction(p2, p3);
	this.lines[2] = new LinearFunction(p3, p4);
	this.lines[3] = new LinearFunction(p4, p1);
		
	this.zeroIsLower = p1.y < p3.y;
	this.oneIsLower  = p2.y < p4.y;
		
}