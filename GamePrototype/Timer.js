

function Timer(){
	
	this.min = 0;
	this.sec = 0;
}

Timer.prototype.update = function(){
	setInterval(function(){Update()},1000);
	//console.log(timer.tenth);
}

Timer.prototype.clearTime = function(){
	timer.min=0;
	timer.sec=0;
}

function Update(){
	if(!myGame.gameManager.pause){
		timer.sec++;
		if(timer.sec==60){
			timer.sec=0;
			timer.min+=1;
		}
	}
}