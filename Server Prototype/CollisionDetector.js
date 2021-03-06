/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This file has the collision detection code.
	
	Requires Node.js and socket.io
*/


var shipVertices = new Array();
var shipHalfVertices = new Array();
var shipLines = new Array();
var lastFrameVertices = new Array();
var vBuf = new Array();

function updateCDVerticesAndLines( ship, multi ){

	if( vBuf.length > 0 ){
	
		for( i in vBuf ){
			lastFrameVertices[i] = vBuf[i];
		}
	
	}

	var shipHeight = (multi) ? ship.height * .5 : ship.height;

	shipVertices[0] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + PI/2 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + PI/2 ));
	shipVertices[1] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation - 2*PI/6 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation - 2*PI/6 ));
	shipVertices[2] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + 8*PI/6 ), 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + 8*PI/6 ));
								
	shipHalfVertices[0] = new Point( (shipVertices[0].x + shipVertices[1].x)/2, (shipVertices[0].y + shipVertices[1].y)/2 );
	shipHalfVertices[1] = new Point( (shipVertices[2].x + shipVertices[1].x)/2, (shipVertices[2].y + shipVertices[1].y)/2 );
	shipHalfVertices[2] = new Point( (shipVertices[2].x + shipVertices[0].x)/2, (shipVertices[2].y + shipVertices[0].y)/2 );
								
	shipLines[0] = new LinearFunction( shipVertices[0], shipVertices[1] );
	shipLines[1] = new LinearFunction( shipVertices[1], shipVertices[2] );
	shipLines[2] = new LinearFunction( shipVertices[2], shipVertices[0] );

	if( lastFrameVertices.length == 0 ){
	
		lastFrameVertices[0] = shipVertices[0];
		lastFrameVertices[1] = shipVertices[1];
		lastFrameVertices[2] = shipVertices[2];
	
	}
	
	shipLines[3] = new LinearFunction( shipVertices[0], lastFrameVertices[0] );
	shipLines[4] = new LinearFunction( shipVertices[1], lastFrameVertices[1] );
	shipLines[5] = new LinearFunction( shipVertices[2], lastFrameVertices[2] );
	
	vBuf[0] = shipVertices[0];
	vBuf[1] = shipVertices[1];
	vBuf[2] = shipVertices[2];

}

function hasCollidedWithShip(ship, block, multi, isChallenge, so){
		
	// var shipVertices = new Array();
	// var shipHeight = (multi) ? ship.height * .5 : ship.height;
	
	//console.log(shipHeight);
			
	// shipVertices[0] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + PI/2 ), 
							    // ship.yPos - shipHeight * Math.sin( ship.rotation + PI/2 ));
	// shipVertices[1] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation - 2*PI/6 ), 
							    // ship.yPos - shipHeight * Math.sin( ship.rotation - 2*PI/6 ));
	// shipVertices[2] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + 8*PI/6 ), 
							    // ship.yPos - shipHeight * Math.sin( ship.rotation + 8*PI/6 ));
			
	// var shipLines = new Array();
	// shipLines[0] = new LinearFunction( shipVertices[0], shipVertices[1] );
	// shipLines[1] = new LinearFunction( shipVertices[1], shipVertices[2] );
	// shipLines[2] = new LinearFunction( shipVertices[2], shipVertices[0] );
			
	var blockLines = new Array();
	blockLines[0] = block.lines[0];
	blockLines[1] = block.lines[1];
	blockLines[2] = block.lines[2];
	blockLines[3] = block.lines[3];
	
	if( isChallenge ){
	
		for( var i = 0; i < 3; ++i ){
		
			if( shipVertices[i].x < so || shipVertices[i].x > so + sw ){
				return true;
			}
		
		}
	
	}
	
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
	
	for( var i = 3; i < 6; i++){
			
		for( var j = 0; j < 4; j++ ){
			
			if(blockLines[j].isVertical){
						
				//for vertical lines, the variable b describes the constant x value
				//So the intersection is just the ship lines function executed at the x value
				var intersection = new Point( blockLines[j].b, shipLines[i].m * blockLines[j].b + shipLines[i].b);
						
				if( intersection.y >= Math.min( block.points[j].y, block.points[(j+1)%4].y ) && 
					intersection.y <  Math.max( block.points[j].y, block.points[(j+1)%4].y ) && 
					intersection.x >= Math.min( shipVertices[i-3].x, lastFrameVertices[i-3].x ) && 
					intersection.x <  Math.max( shipVertices[i-3].x, lastFrameVertices[i-3].x ) ){
								
						return true;
				}
					

			}else{
			
				var intersection = intersect( shipLines[i], blockLines[j] );
			
				if( intersection.x >= Math.min( block.points[j].x, block.points[(j+1)%4].x ) && 
					intersection.x <  Math.max( block.points[j].x, block.points[(j+1)%4].x ) && 
					intersection.x >= Math.min( shipVertices[i-3].x, lastFrameVertices[i-3].x ) && 
					intersection.x <  Math.max( shipVertices[i-3].x, lastFrameVertices[i-3].x ) ){
							
					return true;
				}
					
			}
				
		}
	
	}
			
	//Else we've been through all points and no intersection
	return false;
}

function hasHitBullet( bullet ){

	for( var i = 0; i < 3; ++i ){
	
		var point = shipVertices[i];
		
		var dx = (point.x - bullet.x);
		var dy = (point.y - bullet.y);
		
		var distance = Math.sqrt( dx*dx + dy*dy );
		
		if( distance < bullet.radius ){
			return true;
		}
	
	}
	
	for( var i = 0; i < 3; ++i ){
	
		var point = shipHalfVertices[i];
		
		var dx = (point.x - bullet.x);
		var dy = (point.y - bullet.y);
		
		var distance = Math.sqrt( dx*dx + dy*dy );
		
		if( distance < bullet.radius ){
			return true;
		}
	
	}


}
