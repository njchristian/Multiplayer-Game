var levelFactory = new Array();
var levelFactory = new Array();
var lastIndex = 0;

function Level(){
		
	this.blocks = new Array();
		
}

function makeBoundingBlocks( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}

	var lbw = multi ? .5 * bw : bw;
	var lsh = multi ? .5 * sh : sh;

	
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	
	var len = levels[t].blocks.length;
	//console.log(t);
	
	levels[t].blocks[len] = new Block( new Point( sw * i, base + 0 ), new Point( sw * (i+1), base + 0 ), new Point( sw * (i+1), base + lbw ), new Point( sw * i, base + lbw ) );
	levels[t].blocks[len+1] = new Block( new Point( sw * i, base + lsh ), new Point( sw * (i+1), base + lsh ), new Point( sw * (i+1), base + lsh-lbw ), new Point( sw * i, base + lsh-lbw ) );

}

function makeStart( levels, multi, top ){

	levels[0] = new Level();
	
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;
	var lsh = multi ? .5 * sh : sh;
	
	levels[0].blocks[0] = new Block( new Point( 0,base+lbw ), new Point( 0, base+lsh - lbw ), new Point( lbw, base+lsh - lbw ), new Point( lbw, base+lbw ) );
	
	makeBoundingBlocks( levels, multi, top, false, 0, 0 ); 

}

function makeEnd( levels, multi, top, isChallenge, index, swOffset ){

	if( !isChallenge ) levels[levels.length] = new Level();
	
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;
	var lsh = multi ? .5 * sh : sh;
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	//console.log(t);
	levels[t].blocks[0] = new Block( new Point( (i+1) * sw , base+lbw ), new Point( (i+1) * sw, base+lsh - lbw ), 
		new Point( (i+1) * sw - lbw, base+lsh - lbw ), new Point( (i+1) * sw - lbw, base+lbw ) );
	
	makeBoundingBlocks( levels, multi, top, isChallenge, index, swOffset ); 

}

levelFactory[0] = makeLevelOne;
function makeLevelOne( levels, multi, top, isChallenge, index, swOffset ){
		
	if( !isChallenge ) levels[levels.length] = new Level();
		
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;
	var lsh = multi ? (.5 * sh) : sh;
		
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	//console.log(t);
	levels[t].blocks[0] = new Block( new Point( i*sw + sw/4, base + lsh - lbw ), new Point( i*sw + sw/4, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh - lbw ) );
	levels[t].blocks[1] = new Block( new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 + lbw ), new Point( i*sw + sw/4 + lbw, base + lsh/4 + lbw ) );
	levels[t].blocks[2] = new Block( new Point( i*sw + 3*sw/4, base + lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + lbw ) );
	levels[t].blocks[3] = new Block( new Point( i*sw + 3*sw/4, base + 3*lsh/4 - lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw , base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw, base + 3*lsh/4 - lbw ) );
		
	makeBoundingBlocks( levels, multi, top, isChallenge, index, swOffset );	
	
}
		
levelFactory[1] = makeLevelTwo;
function makeLevelTwo( levels, multi, top, isChallenge, index, swOffset ){
		
	if( !isChallenge ) levels[levels.length] = new Level();
		
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
		
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	//console.log(t);
	levels[t].blocks[0] = new Block( new Point( i*sw +sw/5, base+lbw ), new Point( i*sw +sw/5+ lbw, base+lbw ), 
		new Point( i*sw +sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +sw/5, base+lsh/2 - lbw ) );
	levels[t].blocks[1] = new Block( new Point( i*sw +sw/5, base+lsh-lbw ), new Point( i*sw +sw/5+ lbw, base+lsh-lbw ), 
		new Point( i*sw +sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +sw/5, base+lsh/2 + lbw ) );
	levels[t].blocks[2] = new Block( new Point( i*sw +4*sw/5, base+lbw ), new Point( i*sw +4*sw/5+ lbw, base+lbw ), 
		new Point( i*sw +4*sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +4*sw/5, base+lsh/2 - lbw ) );
	levels[t].blocks[3] = new Block( new Point( i*sw +4*sw/5, base+lsh-lbw ), new Point( i*sw +4*sw/5+ lbw, base+lsh-lbw ), 
		new Point( i*sw +4*sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +4*sw/5, base+lsh/2 + lbw ) );
	levels[t].blocks[4] = new Block( new Point( i*sw +sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +sw/5 + lbw, base+lsh/2 - 2*lbw ), 
		new Point( i*sw +4*sw/5, base+lsh/2 - 2*lbw ), new Point( i*sw +4*sw/5, base+lsh/2 - lbw ) );
	levels[t].blocks[5] = new Block( new Point( i*sw +sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +sw/5 + lbw, base+lsh/2 + 2*lbw ), 
		new Point( i*sw +4*sw/5, base+lsh/2 + 2*lbw ), new Point( i*sw +4*sw/5, base+lsh/2 + lbw ) );
	
	makeBoundingBlocks( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[2] = makeLevelThree;
function makeLevelThree ( levels, multi, top, isChallenge, index, swOffset ){
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	//console.log(t);
	levels[t].blocks[0] = new Block( new Point( i*sw + sw/5, base + lsh-lbw ), new Point( i*sw + sw/5, base + 3*lbw ), new Point ( i*sw + sw/5 + 2*lbw , base + 3*lbw ), new Point ( i*sw + sw/5 + 2*lbw, base + lsh-lbw) );
	levels[t].blocks[1] = new Block( new Point( i*sw + 4*sw/5 - 2*lbw, base + lbw), new Point (i*sw + 4*sw/5 - 2*lbw, base + lsh-3*lbw ), new Point ( i*sw + 4*sw/5, base + lsh-3*lbw), new Point ( i*sw + 4*sw/5, base + lbw) );
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[3] = makeLevelFour;
function makeLevelFour ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	//console.log(t);
	levels[t].blocks[0] = new Block( new Point( i*sw + bw, base + 2*lbw), new Point( i*sw + bw, base + lbw), new Point ( i*sw + 4*sw/5, base + lbw), new Point( i*sw + 4*sw/5, base + 3*lsh/5) ); 
	levels[t].blocks[1] = new Block( new Point( i*sw + 4*sw/5, base + lsh-2*lbw), new Point( i*sw + bw, base + 2*lsh/5), new Point( i*sw + bw, base + lsh-lbw), new Point( i*sw + 4*sw/5, base + lsh-lbw) );

	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset);
}

levelFactory[4] = makeLevelFive;
function makeLevelFive ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}

	//console.log(t);
	
	levels[t].blocks[0] = new Block( new Point( i*sw + 3*sw/4, base + lsh-lbw), new Point( i*sw + 3*sw/4, base + lsh/4), new Point( i*sw + 3*sw/4 + lbw, base + lsh/4), new Point( i*sw + 3*sw/4 + lbw, base + lsh - lbw) );
	levels[t].blocks[1] = new Block( new Point( i*sw + 3*sw/4, base + lsh/4), new Point( i*sw + sw/2 - lbw, base + lsh/4), new Point( i*sw + sw/2 - lbw, base + lsh/4 + lbw), new Point( i*sw + 3*sw/4, base + lsh/4 + lbw) );
	levels[t].blocks[2] = new Block( new Point( i*sw + sw/4, base + lbw), new Point( i*sw + sw/4, base + 3*lsh/4), new Point( i*sw + sw/4 + lbw, base + 3*lsh/4), new Point( i*sw + sw/4 + lbw, base + lbw) );
	levels[t].blocks[3] = new Block( new Point( i*sw + sw/4 + lbw, base + 3*lsh/4), new Point( i*sw + sw/2 + lbw, base + 3*lsh/4), new Point( i*sw + sw/2 + lbw, base + 3*lsh/4 - lbw), new Point( i*sw + sw/4 + lbw, base + 3*lsh/4 - lbw) );
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[5] = makeLevelSix;
function makeLevelSix ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}

	//console.log(t);
	
	levels[t].blocks[0] = new Block( new Point( i*sw + bw, base + lsh - 2*lbw), new Point( i*sw + bw, base + lsh - lbw), new Point ( i*sw + 4*sw/5, base + lsh - lbw), new Point( i*sw + 4*sw/5, base + 2*lsh/5) ); 
	levels[t].blocks[1] = new Block( new Point( i*sw + 4*sw/5, base + 2*lbw), new Point( i*sw + bw, base + 3*lsh/5), new Point( i*sw + bw, base + lbw), new Point( i*sw + 4*sw/5, base + lbw) );
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[6] = makeLevelSeven;
function makeLevelSeven ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}

	//console.log(t);
	
	levels[t].blocks[0] = new Block( new Point( i*sw + sw/6, base + lbw), new Point( i*sw + sw/6, base + lsh/2-lbw ), new Point ( i*sw + sw/3, base + lsh/2-lbw), new Point( i*sw + sw/3, base +lbw) ); 
	levels[t].blocks[1] = new Block( new Point( i*sw + 5*sw/6, base + lbw), new Point( i*sw + 5*sw/6, base + lsh/2-lbw ), new Point ( i*sw + 2*sw/3, base + lsh/2-lbw), new Point( i*sw + 2*sw/3, base +lbw) ); 
	levels[t].blocks[2] = new Block( new Point( i*sw + sw/6, base +lsh- lbw), new Point( i*sw + sw/6, base + lsh/2+lbw ), new Point ( i*sw + sw/3, base + lsh/2+lbw), new Point( i*sw + sw/3, base +lsh-lbw) ); 
	levels[t].blocks[3] = new Block( new Point( i*sw + 5*sw/6, base + lsh- lbw), new Point( i*sw + 5*sw/6, base + lsh/2+lbw ), new Point ( i*sw + 2*sw/3, base + lsh/2+lbw), new Point( i*sw + 2*sw/3, base +lsh-lbw) ); 
	levels[t].blocks[4] = new Block( new Point( i*sw + sw/2 - sw/12, base + lsh/3), new Point( i*sw + sw/2 - sw/12, base + 2*lsh/3 ), new Point ( i*sw + sw/2 + sw/12, base + 2*lsh/3), new Point( i*sw + sw/2 + sw/12, base + lsh/3) ); 
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

//Template for a block
//levels[t].blocks[1] = new Block( new Point( i*sw + , base + ), new Point( i*sw + , base +  ), new Point ( i*sw + , base + ), new Point( i*sw + , base + ) ); 

levelFactory[7] = makeLevelEight;
function makeLevelEight ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}

	//console.log(t);
	
	levels[t].blocks[0] = new Block( new Point( i*sw + lbw, base + lsh-lbw ), new Point( i*sw + 2*lbw, base + lsh-lbw ), new Point ( i*sw + sw/4, base + lsh/4 ), new Point( i*sw + sw/4 - lbw, base + lsh/4 ) ); 
	levels[t].blocks[1] = new Block( new Point( i*sw + sw/4, base + lsh/4), new Point( i*sw + sw/4, base + lsh/4+lbw), new Point ( i*sw + sw/2, base + lsh/4+lbw), new Point( i*sw + sw/2, base + lsh/4) ); 
	levels[t].blocks[2] = new Block( new Point( i*sw + sw/2, base + lsh/4+lbw), new Point( i*sw + sw/2-lbw, base + lsh/4+lbw ), new Point ( i*sw + sw/2-lbw, base + lsh - lbw), new Point( i*sw + sw/2, base + lsh-lbw) ); 
	levels[t].blocks[3] = new Block( new Point( i*sw + 3*sw/4 - 2*lbw, base + lsh/4+lbw), new Point( i*sw + 3*sw/4-3*lbw, base + lsh/4+lbw ), new Point ( i*sw + 3*sw/4-3*lbw, base + 3*lsh/4), new Point( i*sw + 3*sw/4-2*lbw, base + 3*lsh/4) ); 
	levels[t].blocks[4] = new Block( new Point( i*sw + 3*sw/4-3*lbw, base + lsh/4), new Point( i*sw + 3*sw/4-3*lbw, base + lsh/4+lbw), new Point ( i*sw + 4*sw/5, base + lsh/4+lbw), new Point( i*sw + 4*sw/5, base + lsh/4) );  
	levels[t].blocks[5] = new Block( new Point( i*sw + 4*sw/5, base +lbw ), new Point( i*sw + 4*sw/5-lbw, base + lbw ), new Point ( i*sw + 4*sw/5-lbw, base + lsh/4), new Point( i*sw + 4*sw/5, base + lsh/4) ); 
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[8] = makeLevelNine;
function makeLevelNine ( levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}

	//console.log(t);
	
	levels[t].blocks[0] = new Block( new Point( i*sw + lbw, base + lbw), new Point( i*sw + 4*sw/5, base + lbw), new Point ( i*sw + 4*sw/5, base + lsh/2-lbw/2 ), new Point( i*sw + 4*sw/5-lbw, base + lsh/2-lbw/2) ); 
	levels[t].blocks[1] = new Block( new Point( i*sw + lbw, base +lsh- lbw), new Point( i*sw + 4*sw/5, base+lsh- lbw), new Point ( i*sw + 4*sw/5, base + lsh/2+lbw/2 ), new Point( i*sw + 4*sw/5-lbw, base + lsh/2+lbw/2) ); 
	
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[9] = makeLevelTen;
function makeLevelTen (levels, multi, top, isChallenge, index, swOffset ){
	
	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	
	levels[t].blocks[0] = new Block( new Point( i*sw +sw/2, base + lsh/2 - lbw*2), new Point( i*sw +sw/2 + lbw*2, base + lsh/2), new Point( i*sw +sw/2, base + lsh/2 + lbw*2), new Point( i*sw + sw/2 - lbw*2, base + lsh/2) );
	levels[t].blocks[1] = new Block( new Point( i*sw + lbw, base + lsh - lbw), new Point ( i*sw + lbw + 1, base + lsh - lbw), new Point( i*sw + sw/4, base + lsh - lbw), new Point ( i*sw + sw/4, base + 2*lsh/3 - lbw));
	levels[t].blocks[2] = new Block( new Point( i*sw + lbw, base + lbw), new Point ( i*sw + lbw + 1, base + lbw), new Point ( i*sw + sw/4, base + lbw), new Point ( i*sw + sw/4, base + lbw + lsh/3));
	levels[t].blocks[3] = new Block( new Point( i*sw + sw - lbw, base + lbw), new Point ( i*sw + sw - lbw - 1, base + lbw), new Point ( i*sw + 3*sw/4 - lbw, base + lbw), new Point ( i*sw + 3*sw/4 - lbw, base + lbw + lsh/3));
	levels[t].blocks[4] = new Block( new Point( i*sw + sw - lbw, base + lsh - lbw), new Point(i*sw + sw - lbw - 1, base + lsh - lbw), new Point ( i*sw + 3*sw/4 - lbw, base + lsh - lbw), new Point (i*sw + 3*sw/4 - lbw, base + 2*lsh/3 - lbw));
		
	makeBoundingBlocks ( levels, multi, top, isChallenge, index, swOffset );
}

levelFactory[10] = makeLevelEleven;
function makeLevelEleven (levels, multi, top, isChallenge, index, swOffset ){

	var base;
	if( multi ){
		if( top ){
			base = 0;
		}else{
			base = sh/2;
		}
	}else{
		base = 0;
	}
	
	var lbw = multi ? .5 * bw : bw;	
	var lsh = multi ? .5 * sh : sh;
	
	if( !isChallenge ) levels[levels.length] = new Level();
	
	var i;
	var t;
	if( isChallenge ){
		t = index;
		i = swOffset;
	}else{
		t = levels.length - 1;
		i = t;
	}
	
	levels[t].blocks[0] = new Block(new Point( i*sw + lbw, base + lsh - lbw), new Point( i*sw + lbw + 1, base + lsh - lbw), new Point( i*sw + sw - lbw, base + lsh - lbw), new Point (i*sw + sw/2, base + lsh/4));
	
	makeBoundingBlocks (levels, multi, top, isChallenge, index, swOffset );
}
		
function initializeLevels( levels, multi, top, opLevels){
		
	//This is where we need to go through and hardcode levels in - each one takes maybe 5 minutes to do.
		
	makeStart( levels, multi, top );
	if( multi ) makeStart( opLevels, multi, !top, false );
		
	for( var i = 0; i < levelFactory.length; ++i ){
	
		levelFactory[levelFactory.length - i - 1](levels, multi, top, false );
		if( multi ) levelFactory[levelFactory.length - i - 1](opLevels, multi, !top, false );
	
	}
	
	makeEnd( levels, multi, top, false );
	if( multi ) makeEnd( opLevels, multi, !top, false );
	
	levels[levels.length] = new Level();
	if( multi ) opLevels[opLevels.length] = new Level();

		
}

function initChallengeBuffer( challengeBuffer, multi, top ){

	

	makeStart( challengeBuffer, multi, top );
	for(var i = 1; i < 4; ++i){
		challengeBuffer[i] = new Level();
	}
	makeLevelOne( challengeBuffer, multi, top, true, 1, 1 );
	
	makeLevelTwo( challengeBuffer, multi, top, true, 2, 2 );
	
	makeLevelThree( challengeBuffer, multi, top, true, 3, 3 );

}

function makeChallengeLevel( challengeBuffer, multi, top, index, swOffset ){
	
	var rand = Math.floor((Math.random()* levelFactory.length ));
	while ( rand == lastIndex ) {rand = Math.floor((Math.random()*5));}
	lastIndex = rand;
	if( index == -1 ) index = 3;
	levelFactory[ rand ](challengeBuffer, multi, top, true, index, swOffset);


}

