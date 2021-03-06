/* 
	Space Escape
	By: Cameron Hill, Taylor Hunt, Chris Langham, Nick Lonsway
	
	CSCE 315-503
	4/28/2014
	
	This is the server file for running the game server.
	The server manages the various games, keeps track of player scores,
	and facilitates player log-in.
	
	Requires Node.js and socket.io
*/


/*
	TODO:
	
	--remove single player games at the right time
*/

var TT_EASY = 1;
var TT_MEDIUM = 2;
var TT_HARD = 3;
var CHALLENGE = 4;
var RATING = 5;
var RACE = 6;

// Semi-random global variable in order to reference in Player.js:

var highScores = new HighScores(); // array for the high scores
var players = []; // array of all the players



// ----------------------StringTime.js-----------------------------------------
 
// Holds a string representation of a time for easy sending to a client
function StringTime(name, t) {
	this.playerName = name;
	this.time = t;
}

// ------------------------Time.js---------------------------------------------

// Time class
function Time(minutes, seconds, tenths, playerName) {
	this.min = minutes;
	this.sec = seconds;
	this.tenth = tenths;
	this.player = playerName;
}


Time.prototype.convertToString = function () {
	// check to see if there are less than 10 seconds
	// if so then add in a 0 placeholder in the tens spot
	if (this.sec < 10) {
		return this.min + ':0' + this.sec + '.' + this.tenth;
	}
	
	return this.min + ':' + this.sec + '.' + this.tenth;
}

// returns true if time1 is greater than time 2 or false if time2 is less
function timeCompareGreaterThan(time1, time2) {
	if (time1.min > time2.min) {
		return true;
	}
	else if (time1.min < time2.min) {
		return false;
	}
	// if it gets this far then min must be the same
	else if (time1.sec > time2.sec) {
		return true;
	}
	else if (time1.sec < time2.sec) {
		return false;
	}
	// if it gets this far then min and sec must be the same
	else if (time1.tenth > time2.tenth) {
		return true;
	}	
	else if (time1.tenth < time2.tenth) { // might not need this comparison
		return false;
	}
	// we want to return false if they are equal
	return false;
}

// ---------------------Distance.js---------------------------------------

function Distance(name, d) {
	this.playerName = name; // stores the player's name
	this.dist = d; // stores the distance
}

// return true if dist1 is smaller, else return false
function distCompareLessThan(dist1, dist2) {
	if (dist1.dist < dist2.dist) {
		return true;
	}
	return false;
}

// ----------------------RatingItem.js----------------------------------------

// Class for holding rating items
function RatingItem(pName, r) {
	this.playerName = pName;
	this.rating = r;
}

function ratingCompareLessThan(r1, r2) { 
	if (r1.rating < r2.rating) {
		return true;
	}
	return false;
}

// ---------------------HighScores.js------------------------------------------

// Class for storing the overall high scores
function HighScores() {
	this.overallBestEasyTimes = [];
	this.overallBestMedTimes = [];
	this.overallBestHardTimes = [];
	this.overallBestRaceTimes = [];
	this.overallBestDistances = [];
	this.playerRatings = [];
}


HighScores.prototype.addNewEasyTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.overallBestEasyTimes.length < 10) {
		this.overallBestEasyTimes[this.overallBestEasyTimes.length] = time;
		// sort in descending order
		this.overallBestEasyTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		console.log("added a new time");
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.overallBestEasyTimes[this.overallBestEasyTimes.length - 1])) {
			// replace the slowest time with the new time
			this.overallBestEasyTimes[this.overallBestEasyTimes.length - 1] = time;
			
			// sort in descending order
			this.overallBestEasyTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		}
		// else the new time isn't as fast as any of the saved times
	}
}


HighScores.prototype.addNewMedTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.overallBestMedTimes.length < 10) {
		this.overallBestMedTimes[this.overallBestMedTimes.length] = time;
		// sort in descending order
		this.overallBestMedTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		console.log("added a new time");
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.overallBestMedTimes[this.overallBestMedTimes.length - 1])) {
			// replace the slowest time with the new time
			this.overallBestMedTimes[this.overallBestMedTimes.length - 1] = time;
			
			// sort in descending order
			this.overallBestMedTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		}
		// else the new time isn't as fast as any of the saved times
	}
}


HighScores.prototype.addNewHardTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.overallBestHardTimes.length < 10) {
		this.overallBestHardTimes[this.overallBestHardTimes.length] = time;
		// sort in descending order
		this.overallBestHardTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		console.log("added a new time");
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.overallBestHardTimes[this.overallBestHardTimes.length - 1])) {
			// replace the slowest time with the new time
			this.overallBestHardTimes[this.overallBestHardTimes.length - 1] = time;
			
			// sort in descending order
			this.overallBestHardTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		}
		// else the new time isn't as fast as any of the saved times
	}
}


HighScores.prototype.addNewRaceTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.overallBestRaceTimes.length < 10) {
		this.overallBestRaceTimes[this.overallBestRaceTimes.length] = time;
		// sort in descending order
		this.overallBestRaceTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		console.log("added a new time");
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.overallBestRaceTimes[this.overallBestRaceTimes.length - 1])) {
			// replace the slowest time with the new time
			this.overallBestRaceTimes[this.overallBestRaceTimes.length - 1] = time;
			
			// sort in descending order
			this.overallBestRaceTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		}
		// else the new time isn't as fast as any of the saved times
	}
}


HighScores.prototype.addNewDistance = function(distance) {
	// Stores the top 10 longest distances in challenge mode
	
	// So if there are less than 10 top distances, just store it
	if (this.overallBestDistances.length < 10) {
		this.overallBestDistances[this.overallBestDistances.length] = distance;
		// sort in descending order
		this.overallBestDistances.sort(function(a, b) {return distCompareLessThan(a, b)});
	}
	else {
		// assume it is sorted in descending order, therefore the smallest 
		// distance is the last one
		if (distCompareLessThan(this.overallBestDistances[this.overallBestDistances.length - 1], distance)) {
			// replace the smallest distance with the new distance
			this.overallBestDistances[this.overallBestDistances.length - 1] = distance;
			// sort in descending order
			this.overallBestDistances.sort(function(a, b) {return distCompareLessThan(a, b)});
		}
		// else the new distance isn't as far as any of the saved distances
	}
}


HighScores.prototype.addNewRating = function(rating) { 
	// Stores the top 10 ratings
	
	// So if there are less than 10 top ratings, just store it
	if (this.playerRatings.length < 10) {
		this.playerRatings[this.playerRatings.length] = rating;
		// sort in descending order
		this.playerRatings.sort(function(a, b) {return ratingCompareLessThan(a, b)});
	}
	else {
		// assume the ratings array is sorted in descending order, therefore, the
		// lowest rating is in the last slot
		if (rating > this.playerRatings[this.playerRatings.length - 1].rating) {
			// replace the lowest rating with the new one
			this.playerRatings[this.playerRatings.length - 1] = rating;
			// sort in descending order
			this.playerRatings.sort(function(a, b) {return ratingCompareLessThan(a, b)});
		}
	}
}


HighScores.prototype.updateRatings = function() {
	// empty the current scores (because scores in there 
	// might have gone down and not be top 10 anymore)
	this.playerRatings.length = 0;
	
	// Add new ratings, the addNewRating function will keep the top 10
	for (var i = 0; i < players.length; ++i) {
		console.log("Player rating: " + players[i].multiplayerRating);
		var rating = new RatingItem(players[i].userName, players[i].multiplayerRating);
		console.log("Adding a new rating of value: " + rating.rating);
		console.log("From player: " + rating.playerName);
		this.addNewRating(rating);
	}
}

//-----------------------------------------------------------------------------

// ------------------------Player.js-------------------------------------------	

function Player(name) {
	this.userName = name;
	this.gameMode = 0; // 0 signifies no game mode selected yet
	
	this.bestEasyTimes = []; // best times from time trial easy
	this.bestMedTimes = [];
	this.bestHardTimes = [];
	this.bestRaceTimes = [];
	this.bestDistances = []; // furtherest distances from challenge mode
	this.multiplayerRating = 0;
}

Player.prototype.setName = function(name) {
	this.userName = name;
}

Player.prototype.setGameMode = function(mode) {
	this.gameMode = mode;
}


Player.prototype.addNewEasyTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.bestEasyTimes.length < 10) {
		this.bestEasyTimes[this.bestEasyTimes.length] = time;
		// sort in descending order
		this.bestEasyTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		highScores.addNewEasyTime(time);
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.bestEasyTimes[this.bestEasyTimes.length - 1])) {
			// replace the slowest time with the new time
			this.bestEasyTimes[this.bestEasyTimes.length - 1] = time;
			// sort in descending order
			this.bestEasyTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
			
			highScores.addNewEasyTime(time);
		}
		// else the new time isn't as fast as any of the saved times
	}
	
}


Player.prototype.addNewMedTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.bestMedTimes.length < 10) {
		this.bestMedTimes[this.bestMedTimes.length] = time;
		// sort in descending order
		this.bestMedTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		highScores.addNewMedTime(time);
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.bestMedTimes[this.bestMedTimes.length - 1])) {
			// replace the slowest time with the new time
			this.bestMedTimes[this.bestMedTimes.length - 1] = time;
			// sort in descending order
			this.bestMedTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
			
			highScores.addNewMedTime(time);
		}
		// else the new time isn't as fast as any of the saved times
	}
	
}


Player.prototype.addNewHardTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.bestHardTimes.length < 10) {
		this.bestHardTimes[this.bestHardTimes.length] = time;
		// sort in descending order
		this.bestHardTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		highScores.addNewHardTime(time);
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.bestHardTimes[this.bestHardTimes.length - 1])) {
			// replace the slowest time with the new time
			this.bestHardTimes[this.bestHardTimes.length - 1] = time;
			// sort in descending order
			this.bestHardTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
			
			highScores.addNewHardTime(time);
		}
		// else the new time isn't as fast as any of the saved times
	}
	
}


Player.prototype.addNewRaceTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.bestRaceTimes.length < 10) {
		this.bestRaceTimes[this.bestRaceTimes.length] = time;
		// sort in descending order
		this.bestRaceTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
		highScores.addNewRaceTime(time);
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareGreaterThan(time, this.bestRaceTimes[this.bestRaceTimes.length - 1])) {
			// replace the slowest time with the new time
			this.bestRaceTimes[this.bestRaceTimes.length - 1] = time;
			// sort in descending order
			this.bestRaceTimes.sort(function(a, b) {return timeCompareGreaterThan(a, b)});
			
			highScores.addNewRaceTime(time);
		}
		// else the new time isn't as fast as any of the saved times
	}
	
}


Player.prototype.addNewDistance = function(distance) {
	// Stores the top 10 longest distances in challenge mode
	
	// So if there are less than 10 top distances, just store it
	if (this.bestDistances.length < 10) {
		this.bestDistances[this.bestDistances.length] = distance;
		// sort in descending order
		this.bestDistances.sort(function(a, b) {return distCompareLessThan(a, b)});
		highScores.addNewDistance(distance);
	}
	else {
		// assume it is sorted in descending order, therefore the smallest 
		// distance is the last one
		console.log("checkpoint 1");
		if (distCompareLessThan(this.bestDistances[this.bestDistances.length - 1], distance)) {
			console.log("checkpoint 2");
			// replace the smallest distance with the new distance
			this.bestDistances[this.bestDistances.length - 1] = distance;
			// sort in descending order
			this.bestDistances.sort(function(a, b) {return distCompareLessThan(a, b)});
			
			highScores.addNewDistance(distance);
		}
		// else the new distance isn't as far as any of the saved distances
	}
	
}


Player.prototype.updateMPRating = function(rating) {
	this.multiplayerRating += rating;
	//highScores.addNewRating(this.userName, rating);
	console.log("Updated a rating to: " + this.multiplayerRating);	
	highScores.updateRatings();
}

// -----------------------GameManager.js---------------------------------------

//takes cliend.id and sends a value to the opponent
function emitOtherPlayer( myid , msg, value )
{
	var game = gameManager.findMultiGame( myid );
	if( game !== null ){
		var otherPlayer = game.otherPlayer( myid );
		
		io.sockets.socket( otherPlayer ).emit( msg, value );
	}
};

//class to multiplayer games
function activeGame(player1, p1Name, player2, p2Name, gameMode)
{
	this.player1id = player1;
	this.player1Name = p1Name;
	this.player2id = player2;
	this.player2Name = p2Name;
	this.gameMode = gameMode;
	
	this.otherPlayer = function(myid)
	{
		if ( this.player1id == myid )
			return this.player2id;
		else
			return this.player1id;
	}
	
	this.otherPlayerName = function(myName) {
		if (this.player1Name == myName) {
			return this.player2Name;
		}
		else
			return this.player1Name;
	}
};

//Class for single player games
function activeSingleGame(player1, p1Name, gameMode)
{
	this.player1id = player1;
	this.player1Name = p1Name;
	this.gameMode = gameMode;
}

function currenlyLoginPlayer(id, Name)
{
	this.id = id;
	this.Name = Name;
}

//manages all of the active games
function GameManager()
{
	this.multiGames = [];
	this.singleGames = [];
	this.currentlyLogin = [];
	
	this.addMultiGame = function( game )
	{
		this.multiGames[ this.multiGames.length ] = game;
	};
	
	this.addSingleGame = function( game )
	{
		this.singleGames[ this.singleGames.length ] = game;
	};
	
	this.addLoginUser = function( player )
	{
		this.currentlyLogin[ this.currentlyLogin.length ] = player;
	}
	
	this.isPlayerLogin = function( name )
	{
		for( var player in this.currentlyLogin)
		{
			if( this.currentlyLogin[player].Name === name)
			{
				return true;
			}
		}
		return false;
	}
	
	this.findMultiGame = function( playerId )
	{
		//checks the ids of the players
		for( var game in this.multiGames)
		{
			if( this.multiGames[game].player1id === playerId)
			{
				return this.multiGames[game];
			}
			if( this.multiGames[game].player2id === playerId )
			{
				return this.multiGames[game];
			}
		}
		
		//check the name of players
		for( var game in this.multiGames)
		{
			if( this.multiGames[game].player1Name === playerId)
			{
				return this.multiGames[game];
			}
			if( this.multiGames[game].player2Name === playerId )
			{
				return this.multiGames[game];
			}
		}
		return null;
	};
	
	this.findSingleGame = function( playerId )
	{
		//check the id of the players
		for( var game in this.singleGames)
		{
			if( this.singleGames[game].player1id === playerId)
			{
				return this.singleGames[game];
			}
		}
		
		//checks the names of the players
		for( var game in this.singleGames)
		{
			if( this.singleGames[game].player1Name === playerId)
			{
				return this.singleGames[game];
			}
		}
		return null;
	};
	
	//go through all of the game to see if someone has the same username
	this.isPlayerPlaying = function ( playerName )
	{
		if( this.findSingleGame( playerName ) !== null )
		{
			return true;
		}
		if( this.findMultiGame( playerName ) !== null )
		{
			return true;
		}
		return false;
	};
	
	this.removeLoginUser = function( id )
	{
		var index; 
		for( var player in this.currentlyLogin)
		{
			if( this.currentlyLogin[player].id === id )
			{
				index = this.currentlyLogin.indexOf( this.currentlyLogin[player] );
				this.currentlyLogin.splice(index, 1);
			}
			
		}
	};
	
	this.removeMultiGame = function( playerID ) {
		var index;
		for( var game in this.multiGames)
		{
			if( this.multiGames[game].player1id === playerID)
			{
				index = this.multiGames.indexOf( this.multiGames[game] );
				this.multiGames.splice(index, 1);
			}
			else if( this.multiGames[game].player2id === playerID )
			{
				index = this.multiGames.indexOf( this.multiGames[game] );
				this.multiGames.splice(index, 1);
			}
		}
	};
	
	this.removeSingleGame = function( playerID )
	{
		var index;
		for( var game in this.singleGames)
		{
			if( this.singleGames[game].player1id === playerID)
			{
				index = this.singleGames.indexOf( this.singleGames[game] );
				this.singleGames.splice(index, 1);
			}
		}
	};
};


// Class for storing a waiting player
// This allows for easy notification when an opponent is found
function waitingPlayer() {
	
	this.userName = "";
	this.userID = "";
	this.isWaiting = false;
	
}

waitingPlayer.prototype.setWaitingPlayer = function(name, id) {
	this.userName = name;
	this.userID = id;
	this.isWaiting = true;
}

waitingPlayer.prototype.clear = function() {
	this.userName = "";
	this.userID = "";
	this.isWaiting = false;
}

	
// ---------------------------------Main---------------------------------------

// The node.js HTTP server.
//var http = require('http');
var express = require('express');
var app = express();
app.use( express.static( __dirname) );
var server = app.listen(10268);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(server);

var path = require("path")

var url = require("url")

// Allows access to local file system.
var fs = require('fs')

//var players = []; // array of all the players
//var highScores = []; // array for the high scores -- moved above the player.js part

var waitingOnRace = new waitingPlayer(); // stores players waiting for multiplayer race mode
var waitingOnChallenge = new waitingPlayer(); // stores players waiting for multiplayer challenge mode

var gameManager = new GameManager();

//reading all data for the previous players
fs.readFileSync('./data.txt').toString().split('\n').forEach(function (line) { 
    //console.log(line);
	if (line != "") {
		var newPlayer = JSON.parse(line);
		players[players.length] = new Player(newPlayer.user_name);
		
		for ( var i = 0; i < newPlayer.bestEasyTimes.length; ++i) {
			players[players.length - 1 ].addNewEasyTime( new Time( newPlayer.bestEasyTimes[i].min, 
				newPlayer.bestEasyTimes[i].sec, newPlayer.bestEasyTimes[i].tenth, 
				newPlayer.bestEasyTimes[i].player ) ); 
		}
		for ( var i = 0; i < newPlayer.bestMedTimes.length; ++i) {
			players[players.length - 1 ].addNewMedTime( new Time( newPlayer.bestMedTimes[i].min, 
				newPlayer.bestMedTimes[i].sec, newPlayer.bestMedTimes[i].tenth, 
				newPlayer.bestMedTimes[i].player ) ); 
		}
		for ( var i = 0; i < newPlayer.bestHardTimes.length; ++i) {
			players[players.length - 1 ].addNewHardTime( new Time( newPlayer.bestHardTimes[i].min, 
				newPlayer.bestHardTimes[i].sec, newPlayer.bestHardTimes[i].tenth, 
				newPlayer.bestHardTimes[i].player ) ); 
		}
		for ( var i = 0; i < newPlayer.bestRaceTimes.length; ++i) {
			players[players.length - 1 ].addNewRaceTime( new Time( newPlayer.bestRaceTimes[i].min, 
				newPlayer.bestRaceTimes[i].sec, newPlayer.bestRaceTimes[i].tenth, 
				newPlayer.bestRaceTimes[i].player ) ); 
		}
		for ( var i = 0; i < newPlayer.bestDistances.length; ++i) {
			players[players.length - 1 ].addNewDistance( new Distance( 
				newPlayer.bestDistances[i].playerName, newPlayer.bestDistances[i].dist ) ); 
		}
		players[players.length - 1 ].multiplayerRating = newPlayer.multiplayerRating;
	}
	
});

// read all of the overall high score stuff
fs.readFileSync("./highscores.txt").toString().split('\n').forEach(function (line) {
	if (line != "") {
		var newHighScore = JSON.parse(line);
		highScores = new HighScores();
		// highScores[highScores.length - 1] = newHighScore;
		for (var i = 0; i < newHighScore.overallBestEasyTimes.length; ++i) {
			highScores.addNewEasyTime(new Time(newHighScore.overallBestEasyTimes[i].min, 
				newHighScore.overallBestEasyTimes[i].sec, newHighScore.overallBestEasyTimes[i].tenth, 
				newHighScore.overallBestEasyTimes[i].player));
		}
		for (var i = 0; i < newHighScore.overallBestMedTimes.length; ++i) {
			highScores.addNewMedTime(new Time(newHighScore.overallBestMedTimes[i].min, 
				newHighScore.overallBestMedTimes[i].sec, newHighScore.overallBestMedTimes[i].tenth, 
				newHighScore.overallBestMedTimes[i].player));
		}
		for (var i = 0; i < newHighScore.overallBestHardTimes.length; ++i) {
			highScores.addNewHardTime(new Time(newHighScore.overallBestHardTimes[i].min, 
				newHighScore.overallBestHardTimes[i].sec, newHighScore.overallBestHardTimes[i].tenth, 
				newHighScore.overallBestHardTimes[i].player));
		}
		for (var i = 0; i < newHighScore.overallBestRaceTimes.length; ++i) {
			highScores.addNewRaceTime(new Time(newHighScore.overallBestRaceTimes[i].min, 
				newHighScore.overallBestRaceTimes[i].sec, newHighScore.overallBestRaceTimes[i].tenth, 
				newHighScore.overallBestRaceTimes[i].player));
		}
		for (var i = 0; i < newHighScore.overallBestDistances.length; ++i) {
			highScores.addNewDistance(new Distance(newHighScore.overallBestDistances[i].playerName, 
				newHighScore.overallBestDistances[i].dist));
		}
		for (var i = 0; i < newHighScore.playerRatings.length; ++i) {
			highScores.addNewRating(new RatingItem(newHighScore.playerRatings[i].playerName, 
				newHighScore.playerRatings[i].rating));
		}
		
	}
});

// Update the high score ratings so that they are good to go initially
highScores.updateRatings();


// ------------- HELPER FUNCTIONS ---------------------------------------------

// takes in a player name and returns that player's index in the
// array of players
function findPlayerIndex(playerName) {
	var playerIndex = -1;
	for (var i = 0; i < players.length; ++i) {
		if (players[i].userName == playerName) {
			playerIndex = i;
			break;
		}
	}
	return playerIndex;
}


// this function will check to see if this player is waiting in either MP queue
// and if so will remove them from that waiting list. this is called when the
// player decides to quit waiting and play SP instead
function clearAllWaiting(playerName) {
	if (waitingOnRace.userName == playerName) {
		waitingOnRace.clear();
	}
	if (waitingOnChallenge.userName == playerName) {
		waitingOnChallenge.clear();
	}
}

// -------------SOCKET EVENTS -------------------------------------------------

// What to do with a new client
io.sockets.on(
  'connection',
  function(client) {

    // Welcome message.
    client.emit('welcome', 'Welcome to Space Escape!');

    // Handle client login - might wanna make the login stuff better in the future
    client.on(
      'login',
      function(message) {

      	console.log('got login' );
      	console.log(message.user_name);

        // This function extracts the user name from the login message, stores
        // it to the client object, sends a login_ok message to the client, and
        // sends notifications to other clients.
        if ( message.user_name && !gameManager.isPlayerLogin(message.user_name)) {
			var player = new currenlyLoginPlayer( client.id, message.user_name);
			gameManager.addLoginUser(player);
          client.set('user_name', message.user_name);
          client.emit('login_ok');
          // client.broadcast.emits() will send to all clients except the
          // current client. See socket.io FAQ for more examples.
          // client.broadcast.emit('notification',
                                // message.user_name + ' joined the game.'); // might wanna remove this
			console.log(message.user_name + ' joined the game.');
			var playerIndex = findPlayerIndex(message.user_name);
					
			if (playerIndex == -1) {
					players[players.length] = new Player(message.user_name);
			}			
			else{ //this is a return player
			//not sure what goes here
			}
			fs.appendFileSync(message.user_name + ".txt", message.user_name + " logged in.\n");
          return;
        }
        // When something is wrong, send a login_failed message to the client.
        client.emit('login_failed');
      });

	// Listen for game mode choice events 

	// SINGLE PLAYER Messages
	  
	// single player time trial message
	client.on(
		'sp_tt',
		function(msg) {
			if ( msg && msg.user_name ) {
				console.log(msg.user_name);
				var playerIndex = findPlayerIndex(msg.user_name);
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(1);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('sp_tt_msg', 'You have selected SinglePlayer Time Trial!' );
				
				fs.appendFileSync(msg.user_name + ".txt", msg.user_name + " started a single player time trial game.\n");
				
				var newGame = new activeSingleGame( client.id, msg.user_name, 1);
				gameManager.addSingleGame( newGame );
				
				// need to make sure that this player was not waiting for a MP mode,
				// if they were then they need to be removed from that queue.
				clearAllWaiting(msg.user_name);
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
	});	  
	
	// single player challenge message
	client.on(
		'sp_ch',
		function(msg) {
			if ( msg && msg.user_name ) {
				console.log(msg.user_name);
				
				// find player
				var playerIndex = findPlayerIndex(msg.user_name);
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				
				players[playerIndex].setGameMode(2);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('sp_ch_msg', 'You have selected SinglePlayer Challenge!');
				
				fs.appendFileSync(msg.user_name + ".txt", msg.user_name + " started a single player challenge game.\n");
				
				var newGame = new activeSingleGame( client.id, msg.user_name, 2);
				gameManager.addSingleGame( newGame );
				
				// need to make sure that this player was not waiting for a MP mode,
				// if they were then they need to be removed from that queue.
				clearAllWaiting(msg.user_name);
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
			
			
	});		
	  
	// MULTI PLAYER Messages  
	
	// multiplayer race message
	client.on(
		'mp_race',
		function(msg) {
			if ( msg && msg.user_name ) {
				console.log(msg.user_name);
				
				// find player
				var playerIndex = findPlayerIndex(msg.user_name);
				
				// make sure player was found
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				// set player's gamemode choice and send confirmation message
				players[playerIndex].setGameMode(3);
				console.log(msg.user_name + ' wants to race.');
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('mp_race_msg', 'You have selected MultiPlayer Race!' );
				
				// if there is not then set this client as waiting
				
				//io.sockets.sockets[ waitingOnRace[ waitingOnRace.length ] ].emit( "hello" );
				
				//waitingonRace can be an object set to either null or client.id
				if (waitingOnRace.isWaiting == false) {
					waitingOnRace.setWaitingPlayer(msg.user_name, client.id);
					// waitingOnRace[0] = msg.user_name;
					io.sockets.socket( waitingOnRace.userID ).emit('waitForRace', 'Waiting for other player.');
				 }
				
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					// make sure the same client didn't send the same signal twice
					if (client.id == waitingOnRace.userID) {
						return;
					}
					var waitingId = waitingOnRace.userID;
					
					// clear the waiting on race array
					waitingOnRace.isWaiting = false;
					
					var newGame = new activeGame( waitingId, waitingOnRace.userName, client.id, msg.user_name, 3);
					gameManager.addMultiGame( newGame );
					
					//emit to both players to play
					io.sockets.socket( waitingId ).emit( 'opponentForRace', 'Opponent found, get ready to race.');
					io.sockets.socket( client.id ).emit( 'opponentForRace', 'Opponent found, get ready to race.');
				}
				fs.appendFileSync(msg.user_name + ".txt", msg.user_name + " started a multiplayer race game.\n");
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
	});	
	
	// multiplayer challenge message
	client.on(
		'mp_ch',
		function(msg) {
			if ( msg && msg.user_name ) {
				console.log(msg.user_name);
				// find player
				var playerIndex = findPlayerIndex(msg.user_name);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				// set game mode and send confirmation message
				players[playerIndex].setGameMode(4);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('mp_ch_msg', 'You have selected MultiPlayer Challenge!' );
				
				// if the user is also waiting for race then remove them from that
				// waiting list. this also handles the case where the same client clicks
				// MP challenge twice in a row
				
				// check to see if there is an opponent waiting
				// if there is not then set this client as waiting
				if (waitingOnChallenge.isWaiting == false) {
					waitingOnChallenge.setWaitingPlayer(msg.user_name, client.id);
					// waitingOnChallenge[0] = msg.user_name;
					io.sockets.socket( waitingOnChallenge.userID ).emit('waitForChallenge', 'Waiting for other player.');
				 }
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					// make sure the same client didn't send both requests
					if (client.id == waitingOnChallenge.userID) {
						return;
					}
					// else we assume there is an opponent so it is race time
					var waitingChallengeId = waitingOnChallenge.userID;
					// clear the waiting on race array
					waitingOnChallenge.isWaiting = false;
					var newGame = new activeGame( waitingChallengeId, waitingOnChallenge.userName, client.id, msg.user_name, 4);
					gameManager.addMultiGame( newGame );
					
					//emit to both players to play
					io.sockets.socket( waitingChallengeId ).emit( 'opponentForChallenge', 'Opponent found, get ready to race.');
					io.sockets.socket( client.id ).emit( 'opponentForChallenge', 'Opponent found, get ready to race.');
				}
				fs.appendFileSync(msg.user_name + ".txt", msg.user_name + " started a multiplayer challenge game.\n");
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
			
			
	});	

	// Message sent by the client saying that they give up on
	// waiting for an opponent. It removes them from the waiting
	// queue
	client.on(
		'stopWaiting',
		function(stopWaiting) {
			if(stopWaiting && stopWaiting.userName) {
				clearAllWaiting(stopWaiting.userName);
			}
	});	
	
	// client died by hitting an obstacle
	client.on(
		'deathByWall',
		function(died) {
		if( died.progress !== 0 ) {
			fs.appendFileSync(died.user_name + ".txt", died.user_name + " died because they hit an obstacle with " + died.progress + "% progress.\n");
		}
	});	
	
	// client died by hitting a bullet
	client.on(
		'deathByBullet',
		function(died) {
		if( died.progress !== 0 ) {
			fs.appendFileSync(died.user_name + ".txt", died.user_name + " died because they hit a bullet with " + died.progress + "% progress.\n");
		}
	});	
	
	// message received if client disconnects
	client.on(
		'disconnect',
		function() {
			console.log("Lost connection with the client");
			if( gameManager.findMultiGame( client.id ) !== null )
			{
				emitOtherPlayer( client.id , 'opponentLeftGame', 'opponentLeftGame' );
				gameManager.removeMultiGame(client.id);
			}
			if( gameManager.findSingleGame( client.id ) !== null)
			{
				gameManager.removeSingleGame(client.id);
			}
			gameManager.removeLoginUser(client.id);
			
	});
	
	// HIGH SCORE Messages
	// high scores request - returns the players best times, best distances, 
	// or MP rating depending on the score type requested
	client.on(
		'highScoresRequest',
		// the highScoreRequest object should contain the player's userName
		function(highScoresRequest) {
			// var playerIndex = findPlayerIndex(highScoreRequest.userName);
			// //var highScores = players[playerIndex].getHighScores();
			console.log(highScoresRequest.scoreType);
			console.log(highScoresRequest.isOverall);
			console.log(highScoresRequest.userName);
			//console.log("length is: " + highScores.overallBestDistances.length);
			
			// Look at the score type of the request and return the appropriate top 10 values
			// Overall
			if (highScoresRequest.isOverall == true) {
				if (highScoresRequest.scoreType == TT_EASY) {
					var times = [];
					for (var i = 0; i < highScores.overallBestEasyTimes.length; ++i) {
						console.log("Min: " + highScores.overallBestEasyTimes[i].min);
						console.log("Sec: " + highScores.overallBestEasyTimes[i].sec);
						var temp = new StringTime(highScores.overallBestEasyTimes[i].player, highScores.overallBestEasyTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == TT_MEDIUM) {
					var times = [];
					for (var i = 0; i < highScores.overallBestMedTimes.length; ++i) {
						console.log("Min: " + highScores.overallBestMedTimes[i].min);
						console.log("Sec: " + highScores.overallBestMedTimes[i].sec);
						var temp = new StringTime(highScores.overallBestMedTimes[i].player, highScores.overallBestMedTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == TT_HARD) {
					var times = [];
					for (var i = 0; i < highScores.overallBestHardTimes.length; ++i) {
						console.log("Min: " + highScores.overallBestHardTimes[i].min);
						console.log("Sec: " + highScores.overallBestHardTimes[i].sec);
						var temp = new StringTime(highScores.overallBestHardTimes[i].player, highScores.overallBestHardTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == CHALLENGE) {
					for (var i = 0; i < highScores.overallBestDistances.length; ++i) {
						console.log(highScores.overallBestDistances[i].dist);
					}
					client.emit('highScoresResponse', {scores: highScores.overallBestDistances });
				}
				else if (highScoresRequest.scoreType == RATING) {
					for (var i = 0; i < highScores.playerRatings.length; ++i) {
						console.log(highScores.playerRatings[i].rating);
					}
					highScores.updateRatings();
					client.emit('highScoresResponse', { scores: highScores.playerRatings } );
				}
				else if (highScoresRequest.scoreType == RACE) {
					var times = [];
					for (var i = 0; i < highScores.overallBestRaceTimes.length; ++i) {
						console.log("Min: " + highScores.overallBestRaceTimes[i].min);
						console.log("Sec: " + highScores.overallBestRaceTimes[i].sec);
						var temp = new StringTime(highScores.overallBestRaceTimes[i].player, highScores.overallBestRaceTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else {
					console.log("Somehow there was an invalid scoreType in a highScoresRequest");
				}
			}
			// else the user wants individual (personal) data
			else {
				// find player
				var playerIndex = findPlayerIndex(highScoresRequest.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				
				if (highScoresRequest.scoreType == TT_EASY) {
					var times = [];
					for (var i = 0; i < players[playerIndex].bestEasyTimes.length; ++i) {
						var temp = new StringTime(players[playerIndex].bestEasyTimes[i].player, players[playerIndex].bestEasyTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == TT_MEDIUM) {
					var times = [];
					for (var i = 0; i < players[playerIndex].bestMedTimes.length; ++i) {
						var temp = new StringTime(players[playerIndex].bestMedTimes[i].player, players[playerIndex].bestMedTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == TT_HARD) {
					var times = [];
					for (var i = 0; i < players[playerIndex].bestHardTimes.length; ++i) {
						var temp = new StringTime(players[playerIndex].bestHardTimes[i].player, players[playerIndex].bestHardTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else if (highScoresRequest.scoreType == CHALLENGE) {
					client.emit('highScoresResponse', {scores: players[playerIndex].bestDistances});
				}
				else if (highScoresRequest.scoreType == RATING) {
					var rating = [];
					rating[ rating.length ] = new RatingItem( players[playerIndex].userName ,players[playerIndex].multiplayerRating );
					console.log("Rating: " + rating[0].rating);
					client.emit('highScoresResponse', { scores: rating } );
				}
				else if (highScoresRequest.scoreType == RACE) {
					var times = [];
					for (var i = 0; i < players[playerIndex].bestRaceTimes.length; ++i) {
						var temp = new StringTime(players[playerIndex].bestRaceTimes[i].player, players[playerIndex].bestRaceTimes[i].convertToString());
						times[times.length] = temp;
					}
					client.emit('highScoresResponse', {scores: times});
				}
				else {
					console.log("Somehow there was an invalid scoreType in a highScoreRequest");
				}
			}
	
	});		
	
		
	// new time
	client.on(
		'newTime',
		// timeObject should contain the user name (userName) and 
		// a new time (time);
		function(timeObject) {
			if (timeObject) {
				console.log("Got the timeObject");
				console.log("name: " + timeObject.userName);
				console.log("min: " + timeObject.min);
				console.log("sec: " + timeObject.sec);
				console.log("tenth: " + timeObject.tenth);
				// find player
				var playerIndex = findPlayerIndex(timeObject.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					console.log('User name not found!');
					return;
				}
				// add the new time
				// players[playerIndex].addNewTime(timeObject.time);
				var time = new Time(timeObject.min, timeObject.sec, timeObject.tenth, timeObject.userName);
				if (timeObject.difficulty == 1) {
					players[playerIndex].addNewEasyTime(time);
				}
				else if (timeObject.difficulty == 2) {
					players[playerIndex].addNewMedTime(time);
				}
				else if (timeObject.difficulty == 3) {
					players[playerIndex].addNewHardTime(time);
				}
				else if (timeObject.difficulty == 6) {
					players[playerIndex].addNewRaceTime(time);
				}
				else {
					console.log('error setting new time');
				}
				
			}
			else {
				console.log('error setting new time'); //debug check
			}
	});	
	
	// new distance
	client.on(
		'newDistance',
		// distanceObject should contain the user name (userName) and 
		// a new distance (distance);
		function(distanceObject) {
			if (distanceObject) {
				// find player
				var playerIndex = findPlayerIndex(distanceObject.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					console.log('User name not found!');
					return;
				}
				// add the new distance
				console.log("Distance: " + distanceObject.distance);
				var dist = new Distance(distanceObject.userName, distanceObject.distance);
				players[playerIndex].addNewDistance(dist);
			}
			else {
				console.log('error setting new distance'); //debug check
			}
	});	
	
	// this probably won't be used
	client.on(
		'ratingUpdate',
		// ratingObject should contain the user name (userName) and the
		// data for updating the rating (rating). rating should be either
		// "win" or "loss"
		function(ratingObject) {
			if (ratingObject) {
				// find player
				var playerIndex = findPlayerIndex(ratingObject.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					console.log('User name not found!');
					return;
				}
				// update rating
				players[playerIndex].updateMPRating(ratingObject.rating);
			}
			else {
				console.log('error updating MP rating');
			}
	});	
	
	// UPDATE
	// the update message relayed to the opponent so that they can
	// accurately draw the opponent
	client.on(
		'update',
		function(updateObject) {
			//emit to the opponent
			// client.broadcast.emit('newUpdate', updateObject);
			emitOtherPlayer( client.id, 'newUpdate', updateObject);

	});	
	
	// emitted by the host of online challenge to the other player so that
	// the other player knows which level to generate next
	client.on(
		'newCL',
		function(level){
				emitOtherPlayer( client.id, 'newChallengeLevel', level );
		});
	
	
	// GAME ENDING Messages 
	// receive a signal that a client has won their game
	// this is sent by a client when they win a race (the loser of the 
	// race does not send a win/loss message)
	client.on(
		'wonGame',
		// winObject should have the user name of the player that has won
		// (userName)
		function(winObject) {
			//emit to the opponent
			//client.broadcast.emit('opponentWon', { name : "" } ); 
			emitOtherPlayer( client.id, 'opponentWon', { name : "" } );
			
			// find player
			// update the winning player so that it gains rating
			var playerIndex = findPlayerIndex(winObject.userName);
			
			// make sure player exists
			if (playerIndex == -1) {
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[playerIndex].updateMPRating(10);
			
			// update the losing player so that it loses rating

			var game = gameManager.findMultiGame(client.id);
			var oppName = game.otherPlayerName(winObject.userName);
			
			var otherPlayerIndex = findPlayerIndex(oppName);
			
			// make sure player exists
			if (otherPlayerIndex == -1) {P
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[otherPlayerIndex].updateMPRating(-10);	
			
			// remove the game from the games array
			console.log('Remove game');
			//gameManager.removeMultiGame(client.id);

	});
	
	// receive a signal that a client in online challenge has lost their game
	client.on(
		'lostGame',
		// lostObject should have the user name of the player that has lost
		// (userName)
		function(lostObject) {
					//emit to the opponent
			//client.broadcast.emit('opponentLost', { name : "" } ); 
			emitOtherPlayer( client.id, 'opponentLost', { name : "" } ); 
			
			// find and update the winning player so that it gains rating
			var playerIndex = findPlayerIndex(lostObject.userName);
			
			// make sure player exists
			if (playerIndex == -1) {
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[playerIndex].updateMPRating(-10);
			
			// update the losing player so that it loses rating

			var game = gameManager.findMultiGame(client.id);
			var oppName = game.otherPlayerName(lostObject.userName);
			
			var otherPlayerIndex = findPlayerIndex(oppName);
			
			// make sure player exists
			if (otherPlayerIndex == -1) {
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[otherPlayerIndex].updateMPRating(10);
			
			// remove the game from the games array
			console.log('Remove game');
			gameManager.removeMultiGame(client.id);

	});
	
	//the client is done now write his stuff to the file
	client.on('endgame', function(name)
	{		
			clearAllWaiting(name.user_name);
			fs.appendFileSync(name.user_name + ".txt", name.user_name + " quit.\n");
			console.log("Wrote to data.txt file\n");
			// Write all of the player data to the right file
			fs.writeFileSync("./data.txt","");
			var player;
			for ( var j = 0; j < players.length; ++j)
			{
				player = players[ j ];
				var json = { user_name: player.userName, bestEasyTimes: player.bestEasyTimes, 
					bestMedTimes: player.bestMedTimes, bestHardTimes: player.bestHardTimes, 
					bestRaceTimes: player.bestRaceTimes, bestDistances: player.bestDistances, 
					multiplayerRating: player.multiplayerRating };
				var line = JSON.stringify(json);	
				fs.appendFileSync("./data.txt", line.toString() + "\n");
			}
			
			// write the overall high scores to the file
			var highScoreJSON = { overallBestEasyTimes: highScores.overallBestEasyTimes, 
				overallBestMedTimes: highScores.overallBestMedTimes, 
				overallBestHardTimes: highScores.overallBestHardTimes, 
				overallBestRaceTimes: highScores.overallBestRaceTimes, 
				overallBestDistances: highScores.overallBestDistances, 
				playerRatings: highScores.playerRatings };
			var line2 = JSON.stringify(highScoreJSON);
			fs.writeFileSync("./highscores.txt", line2.toString());
	});

  });

