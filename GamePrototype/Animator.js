
var deathAnimationTime = 3.0;

var segmentOne = new Array();
var segmentTwo = new Array();
var segmentThree = new Array();

var rp1;
var rp2
var rp3;

var segDX;
var segOnedy;
var segTwody;
var segThreedy;

var r1dx;
var r1dy;
var r2dx;
var r2dy;
var r3dx;
var r3dy;

var frames;
var currentFrame;

function animateDeath( ship, respawnX, respawnY, so, multi, ro ){

	frames = deathAnimationTime*fps;
	currentFrame = 0;
	
	var dso = ro/frames;

	var shipHeight = (multi) ? ship.height * .5 : ship.height;

	var animVertices = new Array();
	
	var animHalfVertices = new Array();

	animVertices[0] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + PI/2 ) - so, 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + PI/2 ));
	animVertices[1] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation - 2*PI/6 ) - so, 
							    ship.yPos - shipHeight * Math.sin( ship.rotation - 2*PI/6 ));
	animVertices[2] = new Point(ship.xPos + shipHeight * Math.cos( ship.rotation + 8*PI/6 ) - so, 
							    ship.yPos - shipHeight * Math.sin( ship.rotation + 8*PI/6 ));
								
	animHalfVertices[0] = new Point( (animVertices[0].x + animVertices[1].x)/2, (animVertices[0].y + animVertices[1].y)/2 );
	animHalfVertices[1] = new Point( (animVertices[2].x + animVertices[1].x)/2, (animVertices[2].y + animVertices[1].y)/2 );
	animHalfVertices[2] = new Point( (animVertices[2].x + animVertices[0].x)/2, (animVertices[2].y + animVertices[0].y)/2 );	

	//Create segments
	
	segmentOne[0] = new Point( animVertices[0].x, animVertices[0].y );
	segmentOne[1] = new Point( animVertices[1].x, animVertices[1].y );
	
	segmentTwo[0] = new Point( animVertices[1].x, animVertices[1].y );
	segmentTwo[1] = new Point( animVertices[2].x, animVertices[2].y );
	
	segmentThree[0] = new Point( animVertices[2].x, animVertices[2].y );
	segmentThree[1] = new Point( animVertices[0].x, animVertices[0].y );
	
	//Find random Point for each segment to travel too
	
	console.log(ship.vx);
	
	
	//Add multiple of two for splitting animation in two
	segDX = 2*ship.vx * fps/frames + dso;
	segOnedy = Math.floor( Math.random() * sh/4 - sh/8 )/frames;
	
	segTwody = Math.floor( Math.random() * sh/4 - sh/8 )/frames;
	
	segThreedy = Math.floor( Math.random() * sh/4 - sh/8 )/frames;

	//Move back to respawn points
	
	rp1 = new Point(respawnX + shipHeight * Math.cos( PI/2 ) - so, 
							    respawnY - shipHeight * Math.sin( PI/2 ));
	rp2 = new Point(respawnX + shipHeight * Math.cos(  0 - 2*PI/6 ) - so, 
							    respawnY - shipHeight * Math.sin( 0 - 2*PI/6 ));
	rp3 = new Point(respawnX + shipHeight * Math.cos( 8*PI/6 ) - so, 
							    respawnY - shipHeight * Math.sin( 8*PI/6 ));
								
	r1dx = (segDX * frames - rp1.x)/frames;	
	r2dx = (segDX * frames - rp2.x)/frames;	
	r3dx = (segDX * frames - rp3.x)/frames;	
	
	r1dy = (segTwody * frames - rp1.y)/frames;
	r2dy = (segTwody * frames - rp2.y)/frames;
	r3dy = (segTwody * frames - rp3.y)/frames;
	

}

function drawDeathAnimation( g ){

	g.strokeStyle = "red";
	
	g.beginPath();
	g.moveTo( segmentOne[0].x, segmentOne[0].y );
	g.lineTo( segmentOne[1].x, segmentOne[1].y );
	g.stroke();
	
	g.beginPath();
	g.moveTo( segmentTwo[0].x, segmentTwo[0].y );
	g.lineTo( segmentTwo[1].x, segmentTwo[1].y );
	g.stroke();
	
	g.beginPath();
	g.moveTo( segmentThree[0].x, segmentThree[0].y );
	g.lineTo( segmentThree[1].x, segmentThree[1].y );
	g.stroke();
	
}

function updateDeathAnimation(){

	if( currentFrame < frames/2 ){
		segmentOne[0].x+=segDX;
		segmentOne[0].y+=segOnedy;
		segmentOne[1].x+=segDX;
		segmentOne[1].y+=segOnedy;
	
		segmentTwo[0].x+=segDX;
		segmentTwo[0].y+=segTwody;
		segmentTwo[1].x+=segDX;
		segmentTwo[1].y+=segTwody;
	
		segmentThree[0].x+=segDX;
		segmentThree[0].y+=segThreedy;
		segmentThree[1].x+=segDX;
		segmentThree[1].y+=segThreedy;
	}else{
		segmentOne[0].x+=r1dx;
		segmentOne[0].y+=r1dy;
		segmentOne[1].x+=r1dx;
		segmentOne[1].y+=r1dy;
	
		segmentTwo[0].x+=r2dx;
		segmentTwo[0].y+=r2dy;
		segmentTwo[1].x+=r2dx;
		segmentTwo[1].y+=r2dy;
	
		segmentThree[0].x+=r3dx;
		segmentThree[0].y+=r3dy;
		segmentThree[1].x+=r3dx;
		segmentThree[1].y+=r3dy;
	
	}
	
	if( currentFrame == frames ){
		alive();
	}
	
	currentFrame++;
}









