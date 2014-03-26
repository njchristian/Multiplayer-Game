

function Level(){
		
	this.blocks = new Array();
		
}

function makeBoundingBlocks( levels, multi, top ){

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

	var len = levels[levels.length - 1].blocks.length;
	
	var i = levels.length - 1;
	
	levels[i].blocks[len] = new Block( new Point( sw * i, base + 0 ), new Point( sw * (i+1), base + 0 ), new Point( sw * (i+1), base + lbw ), new Point( sw * i, base + lbw ) );
	levels[i].blocks[len+1] = new Block( new Point( sw * i, base + lsh ), new Point( sw * (i+1), base + lsh ), new Point( sw * (i+1), base + lsh-lbw ), new Point( sw * i, base + lsh-lbw ) );

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
	
	makeBoundingBlocks( levels, multi, top ); 

}

function makeEnd( levels, multi, top ){

	levels[levels.length] = new Level();
	
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
	
	var i = levels.length - 1;
	
	levels[i].blocks[0] = new Block( new Point( (i+1) * sw , base+lbw ), new Point( (i+1) * sw, base+lsh - lbw ), 
		new Point( (i+1) * sw - lbw, base+lsh - lbw ), new Point( (i+1) * sw - lbw, base+lbw ) );
	
	makeBoundingBlocks( levels, multi, top ); 

}

function makeLevelOne( levels, multi, top ){
		
	levels[levels.length] = new Level();
		
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
		
	var i = levels.length - 1;
	levels[i].blocks[0] = new Block( new Point( i*sw + sw/4, base + lsh - lbw ), new Point( i*sw + sw/4, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh - lbw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 + lbw ), new Point( i*sw + sw/4 + lbw, base + lsh/4 + lbw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw + 3*sw/4, base + lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + lbw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw + 3*sw/4, base + 3*lsh/4 - lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw , base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw, base + 3*lsh/4 - lbw ) );
		
	makeBoundingBlocks( levels, multi, top );	
	
}
		
function makeLevelTwo( levels, multi, top ){
		
	levels[levels.length] = new Level();
		
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
		
	var i = levels.length - 1;
	
	levels[i].blocks[0] = new Block( new Point( i*sw +sw/5, base+lbw ), new Point( i*sw +sw/5+ lbw, base+lbw ), 
		new Point( i*sw +sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +sw/5, base+lsh/2 - lbw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw +sw/5, base+lsh-lbw ), new Point( i*sw +sw/5+ lbw, base+lsh-lbw ), 
		new Point( i*sw +sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +sw/5, base+lsh/2 + lbw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw +4*sw/5, base+lbw ), new Point( i*sw +4*sw/5+ lbw, base+lbw ), 
		new Point( i*sw +4*sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +4*sw/5, base+lsh/2 - lbw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw +4*sw/5, base+lsh-lbw ), new Point( i*sw +4*sw/5+ lbw, base+lsh-lbw ), 
		new Point( i*sw +4*sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +4*sw/5, base+lsh/2 + lbw ) );
	levels[i].blocks[4] = new Block( new Point( i*sw +sw/5 + lbw, base+lsh/2 - lbw ), new Point( i*sw +sw/5 + lbw, base+lsh/2 - 2*lbw ), 
		new Point( i*sw +4*sw/5, base+lsh/2 - 2*lbw ), new Point( i*sw +4*sw/5, base+lsh/2 - lbw ) );
	levels[i].blocks[5] = new Block( new Point( i*sw +sw/5 + lbw, base+lsh/2 + lbw ), new Point( i*sw +sw/5 + lbw, base+lsh/2 + 2*lbw ), 
		new Point( i*sw +4*sw/5, base+lsh/2 + 2*lbw ), new Point( i*sw +4*sw/5, base+lsh/2 + lbw ) );
	
	makeBoundingBlocks( levels, multi, top );
}

function makeLevelThree ( levels, multi, top ){
	
	levels[levels.length] = new Level();
	
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
	
	var i = levels.length - 1;
	
	levels[i].blocks[0] = new Block( new Point( i*sw + sw/5, base + lsh-lbw ), new Point( i*sw + sw/5, base + 3*lbw ), new Point ( i*sw + sw/5 + 2*lbw , base + 3*lbw ), new Point ( i*sw + sw/5 + 2*lbw, base + lsh-lbw) );
	levels[i].blocks[1] = new Block( new Point( i*sw + 4*sw/5 - 2*lbw, base + lbw), new Point (i*sw + 4*sw/5 - 2*lbw, base + lsh-3*lbw ), new Point ( i*sw + 4*sw/5, base + lsh-3*lbw), new Point ( i*sw + 4*sw/5, base + lbw) );
	
	makeBoundingBlocks ( levels, multi, top);
}

function makeLevelFour ( levels, multi, top ){

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
	
	levels[levels.length] = new Level();
	
	var i = levels.length - 1;
	
	levels[i].blocks[0] = new Block( new Point( i*sw + bw, base + 2*lbw), new Point( i*sw + bw, base + lbw), new Point ( i*sw + 4*sw/5, base + lbw), new Point( i*sw + 4*sw/5, base + 7*lsh/10) ); 
	levels[i].blocks[1] = new Block( new Point( i*sw + 4*sw/5, base + lsh-2*lbw), new Point( i*sw + bw, base + 2*lsh/5), new Point( i*sw + bw, base + lsh-lbw), new Point( i*sw + 4*sw/5, base + lsh-lbw) );

	makeBoundingBlocks ( levels, multi, top);
}

function makeLevelFive ( levels, multi, top ){

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
	
	levels[levels.length] = new Level();
	
	var i = levels.length - 1;

	levels[i].blocks[0] = new Block( new Point( i*sw + 3*sw/4, base + lsh-lbw), new Point( i*sw + 3*sw/4, base + lsh/4), new Point( i*sw + 3*sw/4 + lbw, base + lsh/4), new Point( i*sw + 3*sw/4 + lbw, base + lsh - lbw) );
	levels[i].blocks[1] = new Block( new Point( i*sw + 3*sw/4, base + lsh/4), new Point( i*sw + sw/2 - lbw, base + lsh/4), new Point( i*sw + sw/2 - lbw, base + lsh/4 + lbw), new Point( i*sw + 3*sw/4, base + lsh/4 + lbw) );
	levels[i].blocks[2] = new Block( new Point( i*sw + sw/4, base + lbw), new Point( i*sw + sw/4, base + 3*lsh/4), new Point( i*sw + sw/4 + lbw, base + 3*lsh/4), new Point( i*sw + sw/4 + lbw, base + lbw) );
	levels[i].blocks[3] = new Block( new Point( i*sw + sw/4 + lbw, base + 3*lsh/4), new Point( i*sw + sw/2 + lbw, base + 3*lsh/4), new Point( i*sw + sw/2 + lbw, base + 3*lsh/4 - lbw), new Point( i*sw + sw/4 + lbw, base + 3*lsh/4 - lbw) );
	
	makeBoundingBlocks ( levels, multi, top );
}
		
function initializeLevels( levels, multi, top, opLevels){
		
	//This is where we need to go through and hardcode levels in - each one takes maybe 5 minutes to do.
		
	makeStart( levels, multi, top );
	if( multi ) makeStart( opLevels, multi, !top );
		
	makeLevelFour( levels, multi, top );
	if( multi ) makeLevelThree( opLevels, multi, !top );
	
	makeLevelFour( levels, multi, top );
	if( multi ) makeLevelOne( opLevels, multi, !top );
	
	makeEnd( levels, multi, top );
	if( multi ) makeEnd( opLevels, multi, !top );

		
}