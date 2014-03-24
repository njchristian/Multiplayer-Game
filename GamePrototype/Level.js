

function Level(){
		
	this.blocks = new Array();
		
}
		
function initializeLevels( levels ){
		
	//This is where we need to go through and hardcode levels in - each one takes maybe 5 minutes to do.
		
	levels[0] = new Level();
		
	levels[0].blocks[0] = new Block( new Point( sw/4, sh ), new Point( sw/4, sh/4 ), new Point( sw/4 + bw, sh/4 ), new Point( sw/4 + bw, sh ) );
	levels[0].blocks[1] = new Block( new Point( sw/4 + bw, sh/4 ), new Point( sw/2 + bw, sh/4 ), new Point( sw/2 + bw, sh/4 + bw ), new Point( sw/4 + bw, sh/4 + bw ) );
	levels[0].blocks[2] = new Block( new Point( 3*sw/4, bw ), new Point( 3*sw/4, 3*sh/4 ), new Point( 3*sw/4 + bw, 3*sh/4 ), new Point( 3*sw/4 + bw, bw ) );
	levels[0].blocks[3] = new Block( new Point( 3*sw/4, 3*sh/4 - bw ), new Point( 3*sw/4, 3*sh/4 ), new Point( sw/2 - bw , 3*sh/4 ), new Point( sw/2 - bw, 3*sh/4 - bw ) );
		
	levels[1] = new Level();
		
	levels[1].blocks[0] = new Block( new Point( sw/5, bw ), new Point( sw/5+ bw, bw ), new Point( sw/5 + bw, sh/2 - bw ), new Point( sw/5, sh/2 - bw ) );
	levels[1].blocks[1] = new Block( new Point( sw/5, sh ), new Point( sw/5+ bw, sh ), new Point( sw/5 + bw, sh/2 + bw ), new Point( sw/5, sh/2 + bw ) );
	levels[1].blocks[2] = new Block( new Point( 4*sw/5, bw ), new Point( 4*sw/5+ bw, bw ), new Point( 4*sw/5 + bw, sh/2 - bw ), new Point( 4*sw/5, sh/2 - bw ) );
	levels[1].blocks[3] = new Block( new Point( 4*sw/5, sh ), new Point( 4*sw/5+ bw, sh ), new Point( 4*sw/5 + bw, sh/2 + bw ), new Point( 4*sw/5, sh/2 + bw ) );
	levels[1].blocks[4] = new Block( new Point( sw/5 + bw, sh/2 - bw ), new Point( sw/5 + bw, sh/2 - 2*bw ), new Point( 4*sw/5, sh/2 - 2*bw ), new Point( 4*sw/5, sh/2 - bw ) );
	levels[1].blocks[5] = new Block( new Point( sw/5 + bw, sh/2 + bw ), new Point( sw/5 + bw, sh/2 + 2*bw ), new Point( 4*sw/5, sh/2 + 2*bw ), new Point( 4*sw/5, sh/2 + bw ) );
		
	levels[2] = new Level();
		
	levels[2].blocks[0] = new Block( new Point( 3*sw/4, bw ), new Point( 3*sw/4+ bw, bw ), new Point( 3*sw/4 + bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3 ) );
	levels[2].blocks[1] = new Block( new Point( 3*sw/4, sh ), new Point( 3*sw/4+ bw, sh ), new Point( 3*sw/4 + bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 ) );
	levels[2].blocks[2] = new Block( new Point( sw/5, bw ), new Point( sw/5 - r2bw, r2bw ), new Point( 3*sw/4 - r2bw, sh/2 - 2*bw/3 ), new Point( 3*sw/4, sh/2 - 2*bw/3- r2bw ) );
	levels[2].blocks[3] = new Block( new Point( sw/5, sh ), new Point( sw/5 - r2bw, sh-r2bw ), new Point( 3*sw/4 - r2bw, sh/2 + 2*bw/3 ), new Point( 3*sw/4, sh/2 + 2*bw/3 + r2bw ) );
		
		
}