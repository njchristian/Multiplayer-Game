
function(fps, sw, sh) Game{

	this.start = function(){
	
		setInterval( gameLoop, 1000/fps );
	
	}
	
	this.end = function(){
		clearInterval( gameLoop );
	}

	this.isOnMenu = true;
	
	this.MenuManager = new MenuManager(sw, sh);
	this.GameManager = new GameManager(sw, sh);
}

Game.prototype.start = function(){

	this.isOnMenu = true;

}

Game.prototype.run = function(){

	Game.update();
	Game.draw();

}

Game.prototype.update = function(){

	//Tick

}

Game.prototype.draw = function(){



}

