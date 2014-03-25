

function CanvasText( text, x, y, width, height ){

	this.text = text;
	this.xPos = x;
	this.yPos = y;
	
	this.width = width;
	this.height = height;
	
	this.clicked = function( var x, var y ){
	
		return ( x >= this.xPos - this.width/2 && x <= this.xPos + this.width/2 && y >= this.yPos - this.height/2 && y <= this.yPos + this.height/2 );
		
	}

}