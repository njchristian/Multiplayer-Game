

function Level(){
		
	this.blocks = new Array();
		
}

function makeBoundingBlocks( levels, i, j, multi, top ){

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

	levels[i].blocks[j] = new Block( new Point( sw * i, base + 0 ), new Point( sw * (i+1), base + 0 ), new Point( sw * (i+1), base + lbw ), new Point( sw * i, base + lbw ) );
	levels[i].blocks[j+1] = new Block( new Point( sw * i, base + lsh ), new Point( sw * (i+1), base + lsh ), new Point( sw * (i+1), base + lsh-lbw ), new Point( sw * i, base + lsh-lbw ) );

}

function makeStart( levels ){

	levels[0] = new Level();
	
	makeBoundingBlocks( levels, 0, 0 ); 

}

function makeEnd( levels ){

	levels[levels.length] = new Level();
	
	makeBoundingBlocks( levels, levels.length - 1, 0 ); 

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
	var lsh = multi ? .5 * sh : sh;
		
	var i = levels.length - 1;
	levels[i].blocks[0] = new Block( new Point( i*sw + sw/4, base + lsh - lbw ), new Point( i*sw + sw/4, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/4 + lbw, base + lsh - lbw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw + sw/4 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 ), new Point( i*sw + sw/2 + lbw, base + lsh/4 + lbw ), new Point( i*sw + sw/4 + lbw, base + lsh/4 + lbw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw + 3*sw/4, base + lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + 3*lsh/4 ), new Point( i*sw + 3*sw/4 + lbw, base + lbw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw + 3*sw/4, base + 3*lsh/4 - lbw ), new Point( i*sw + 3*sw/4, base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw , base + 3*lsh/4 ), new Point( i*sw + sw/2 - lbw, base + 3*lsh/4 - lbw ) );
		
	makeBoundingBlocks( levels, levels.length - 1, 4, multi, top );	
	
}
		
function makeLevelTwo( levels ){
		
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
	
	levels[i].blocks[0] = new Block( new Point( i*sw +sw/5, lbw ), new Point( i*sw +sw/5+ lbw, lbw ), new Point( i*sw +sw/5 + lbw, sh/2 - lbw ), new Point( i*sw +sw/5, sh/2 - lbw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw +sw/5, sh-lbw ), new Point( i*sw +sw/5+ lbw, sh-lbw ), new Point( i*sw +sw/5 + lbw, sh/2 + lbw ), new Point( i*sw +sw/5, sh/2 + lbw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw +4*sw/5, lbw ), new Point( i*sw +4*sw/5+ lbw, lbw ), new Point( i*sw +4*sw/5 + lbw, sh/2 - lbw ), new Point( i*sw +4*sw/5, sh/2 - lbw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw +4*sw/5, sh-lbw ), new Point( i*sw +4*sw/5+ lbw, sh-lbw ), new Point( i*sw +4*sw/5 + lbw, sh/2 + lbw ), new Point( i*sw +4*sw/5, sh/2 + lbw ) );
	levels[i].blocks[4] = new Block( new Point( i*sw +sw/5 + lbw, sh/2 - lbw ), new Point( i*sw +sw/5 + lbw, sh/2 - 2*lbw ), new Point( i*sw +4*sw/5, sh/2 - 2*lbw ), new Point( i*sw +4*sw/5, sh/2 - lbw ) );
	levels[i].blocks[5] = new Block( new Point( i*sw +sw/5 + lbw, sh/2 + lbw ), new Point( i*sw +sw/5 + lbw, sh/2 + 2*lbw ), new Point( i*sw +4*sw/5, sh/2 + 2*lbw ), new Point( i*sw +4*sw/5, sh/2 + lbw ) );
	
	makeBoundingBlocks( levels, i, 6 );
}
		
function initializeLevels( levels ){
		
	//This is where we need to go through and hardcode levels in - each one takes maybe 5 minutes to do.
		
	//makeStart( levels );
		
	//makeLevelTwo( levels );
	
	makeLevelOne( levels, true, true );
	
	//makeEnd( levels );
	
	/*
	levels[2] = new Level();
		
	levels[2].blocks[0] = new Block( new Point( 3*sw/4, bw ), new Point( 3*sw/4+ bw, bw ), new Point( 3*sw/4 + bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3 ) );
	levels[2].blocks[1] = new Block( new Point( 3*sw/4, sh ), new Point( 3*sw/4+ bw, sh ), new Point( 3*sw/4 + bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 ) );
	levels[2].blocks[2] = new Block( new Point( sw/5, bw ), new Point( sw/5 - r2bw, r2bw ), new Point( 3*sw/4 - r2bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3- r2bw ) );
	levels[2].blocks[3] = new Block( new Point( sw/5, sh ), new Point( sw/5 - r2bw, sh-r2bw ), new Point( 3*sw/4 - r2bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 + r2bw ) );
	*/
		
}