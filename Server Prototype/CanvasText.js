/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file houses the class for creating our buttons.
	
	Requires Node.js and socket.io
*/


function CanvasText( text, x, y, width, height, c, cb, arg1, arg2, arg3 ){

	this.clickable = c;
	
	this.callback = cb;
	
	this.argument = arg1;
	
	this.socket = arg2;
	this.name = arg3;

	this.text = text;
	this.xPos = x;
	this.yPos = y;
	
	this.width = width;
	this.height = height;
	
	this.clicked = function( x, y ){
	
		return this.clickable && x >= this.xPos - this.width/2 && x <= this.xPos + this.width/2 && y >= this.yPos - this.height/2 && y <= this.yPos + this.height/2;
		
	}
	
	this.mouseOn = false;

}