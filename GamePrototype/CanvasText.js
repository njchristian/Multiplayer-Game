

function CanvasText( text, x, y, width, height, c, cb, arg ){

	this.clickable = c;
	
	this.callback = cb;
	
	this.argument = arg;

	this.text = text;
	this.xPos = x;
	this.yPos = y;
	
	this.width = width;
	this.height = height;
	
	this.clicked = function( x, y ){
	
		return this.clickable && x >= this.xPos - this.width/2 && x <= this.xPos + this.width/2 && y >= this.yPos - this.height/2 && y <= this.yPos + this.height/2;
		
	}

}