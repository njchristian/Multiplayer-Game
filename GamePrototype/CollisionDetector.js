

function hasCollidedWithShip(ship, block){
		
	var shipVertices = new Array();
	var shipHeight = ship.height;
			
	shipVertices[0] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + PI/2 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + PI/2 ));
	shipVertices[1] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation - 2*PI/6 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation - 2*PI/6 ));
	shipVertices[2] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + 8*PI/6 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + 8*PI/6 ));
			
	var shipLines = new Array();
	shipLines[0] = new LinearFunction( shipVertices[0], shipVertices[1] );
	shipLines[1] = new LinearFunction( shipVertices[1], shipVertices[2] );
	shipLines[2] = new LinearFunction( shipVertices[2], shipVertices[0] );
			
	var blockLines = new Array();
	blockLines[0] = block.lines[0];
	blockLines[1] = block.lines[1];
	blockLines[2] = block.lines[2];
	blockLines[3] = block.lines[3];
	
	//Intersection between shipLines and blockLines
			
	for( var i = 0; i < 3; i++){
			
		for( var j = 0; j < 4; j++ ){
			
			if(blockLines[j].isVertical){
						
				//for vertical lines, the variable b describes the constant x value
				//So the intersection is just the ship lines function executed at the x value
				var intersection = new Point( blockLines[j].b, shipLines[i].m * blockLines[j].b + shipLines[i].b);
						
				if( intersection.y >= Math.min( block.points[j].y, block.points[(j+1)%4].y ) && 
					intersection.y <  Math.max( block.points[j].y, block.points[(j+1)%4].y ) && 
					intersection.x >= Math.min( shipVertices[i].x, shipVertices[(i+1)%3].x ) && 
					intersection.x <  Math.max( shipVertices[i].x, shipVertices[(i+1)%3].x ) ){
								
						return true;
				}
					

			}else{
			
				var intersection = intersect( shipLines[i], blockLines[j] );
			
				if( intersection.x >= Math.min( block.points[j].x, block.points[(j+1)%4].x ) && 
					intersection.x <  Math.max( block.points[j].x, block.points[(j+1)%4].x ) && 
					intersection.x >= Math.min( shipVertices[i].x, shipVertices[(i+1)%3].x ) && 
					intersection.x <  Math.max( shipVertices[i].x, shipVertices[(i+1)%3].x ) ){
							
					return true;
				}
					
			}
				
		}
	
	}
			
	//Else we've been through all points and no intersection
	return false;
}