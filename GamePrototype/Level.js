

function Level(){
		
	this.blocks = new Array();
		
}

function makeBoundingBlocks( levels, i, j ){

	levels[i].blocks[j] = new Block( new Point( sw * i, 0 ), new Point( sw * (i+1), 0 ), new Point( sw * (i+1), bw ), new Point( sw * i, bw ) );
	levels[i].blocks[j+1] = new Block( new Point( sw * i, sh ), new Point( sw * (i+1), sh ), new Point( sw * (i+1), sh-bw ), new Point( sw * i, sh-bw ) );

}

function makeLevelOneAtIndex( levels, i ){
		
	levels[i] = new Level();
		
	levels[i].blocks[0] = new Block( new Point( i*sw + sw/4, sh - bw ), new Point( i*sw + sw/4, sh/4 ), new Point( i*sw + sw/4 + bw, sh/4 ), new Point( i*sw + sw/4 + bw, sh - bw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw + sw/4 + bw, sh/4 ), new Point( i*sw + sw/2 + bw, sh/4 ), new Point( i*sw + sw/2 + bw, sh/4 + bw ), new Point( i*sw + sw/4 + bw, sh/4 + bw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw + 3*sw/4, bw ), new Point( i*sw + 3*sw/4, 3*sh/4 ), new Point( i*sw + 3*sw/4 + bw, 3*sh/4 ), new Point( i*sw + 3*sw/4 + bw, bw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw + 3*sw/4, 3*sh/4 - bw ), new Point( i*sw + 3*sw/4, 3*sh/4 ), new Point( i*sw + sw/2 - bw , 3*sh/4 ), new Point( i*sw + sw/2 - bw, 3*sh/4 - bw ) );
		
	makeBoundingBlocks( levels, i, 4 );	
	
}
		
function makeLevelTwoAtIndex( levels, i ){
		
	levels[i] = new Level();
		
	levels[i].blocks[0] = new Block( new Point( i*sw +sw/5, bw ), new Point( i*sw +sw/5+ bw, bw ), new Point( i*sw +sw/5 + bw, sh/2 - bw ), new Point( i*sw +sw/5, sh/2 - bw ) );
	levels[i].blocks[1] = new Block( new Point( i*sw +sw/5, sh-bw ), new Point( i*sw +sw/5+ bw, sh-bw ), new Point( i*sw +sw/5 + bw, sh/2 + bw ), new Point( i*sw +sw/5, sh/2 + bw ) );
	levels[i].blocks[2] = new Block( new Point( i*sw +4*sw/5, bw ), new Point( i*sw +4*sw/5+ bw, bw ), new Point( i*sw +4*sw/5 + bw, sh/2 - bw ), new Point( i*sw +4*sw/5, sh/2 - bw ) );
	levels[i].blocks[3] = new Block( new Point( i*sw +4*sw/5, sh-bw ), new Point( i*sw +4*sw/5+ bw, sh-bw ), new Point( i*sw +4*sw/5 + bw, sh/2 + bw ), new Point( i*sw +4*sw/5, sh/2 + bw ) );
	levels[i].blocks[4] = new Block( new Point( i*sw +sw/5 + bw, sh/2 - bw ), new Point( i*sw +sw/5 + bw, sh/2 - 2*bw ), new Point( i*sw +4*sw/5, sh/2 - 2*bw ), new Point( i*sw +4*sw/5, sh/2 - bw ) );
	levels[i].blocks[5] = new Block( new Point( i*sw +sw/5 + bw, sh/2 + bw ), new Point( i*sw +sw/5 + bw, sh/2 + 2*bw ), new Point( i*sw +4*sw/5, sh/2 + 2*bw ), new Point( i*sw +4*sw/5, sh/2 + bw ) );
	
	makeBoundingBlocks( levels, i, 6 );
}
		
function initializeLevels( levels ){
		
	//This is where we need to go through and hardcode levels in - each one takes maybe 5 minutes to do.
		
	makeLevelOneAtIndex( levels, 0 );	
		
	makeLevelTwoAtIndex( levels, 1 );

	/*
	levels[2] = new Level();
		
	levels[2].blocks[0] = new Block( new Point( 3*sw/4, bw ), new Point( 3*sw/4+ bw, bw ), new Point( 3*sw/4 + bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3 ) );
	levels[2].blocks[1] = new Block( new Point( 3*sw/4, sh ), new Point( 3*sw/4+ bw, sh ), new Point( 3*sw/4 + bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 ) );
	levels[2].blocks[2] = new Block( new Point( sw/5, bw ), new Point( sw/5 - r2bw, r2bw ), new Point( 3*sw/4 - r2bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3- r2bw ) );
	levels[2].blocks[3] = new Block( new Point( sw/5, sh ), new Point( sw/5 - r2bw, sh-r2bw ), new Point( 3*sw/4 - r2bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 + r2bw ) );
	*/
		
}