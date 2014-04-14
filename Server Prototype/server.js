// This node.js program implements our game server.

/*
	TODO:
	-maybe the client menu should highlight or somehow indicate a player's choice if it is a MP
	mode and they are having to wait, therefore they for sure know what they selected
	-should scores be stored separately for each game mode?
	-make log in better and require password
	-file IO with player data
	-rethink addPlayerRating function of HighScores.js
	-need a way to delete games
	-timer keeps counting after player wins
*/

var TT_EASY = 1;
var TT_MEDIUM = 2;
var TT_HARD = 3;
var CHALLENGE = 4;

// var fs = require('fs');
// var vm = require('vm');
// var includeInThisContext = function(path) {
    // var code = fs.readFileSync(path);
    // vm.runInThisContext(code, path);
// }.bind(this);
// includeInThisContext(__dirname+"/HighScoreItem.js");

// need to make into modules if possible
// ----------------------StringTime.js-----------------------------------------

function StringTime(name, t) {
	this.playerName = name;
	this.time = t;
}

// ------------------------Time.js---------------------------------------------

function Time(minutes, seconds, tenths, playerName) {
	this.min = minutes;
	this.sec = seconds;
	this.tenth = tenths;
	this.player = playerName;
}


Time.prototype.toString = function () {
	return this.min.toString() + ':' + this.sec.toString() + '.' + this.tenth.toString();
}

// returns true if time1 is less than time 2 or false if time2 is less
function timeCompareLessThan(time1, time2) {
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

// return true if dist1 is larger, else return false
function distCompareLessThan(dist1, dist2) {
	if (dist1.dist < dist2.dist) {
		return true;
	}
	return false;
}

// ----------------------RatingItem.js----------------------------------------

function RatingItem(pName, r) {
	this.playerName = pName;
	this.rating = r;
}

function ratingCompareGreaterThan(r1, r2) {
	if (r1 > r2) {
		return true;
	}
	return false;
}

// ---------------------HighScores.js------------------------------------------

function HighScores() {
	this.overallBestTimes = [];
	this.overallBestDistances = [];
	this.playerRatings = [];
}

HighScores.prototype.addNewTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.overallBestTimes.length < 10) {
		this.overallBestTimes[this.overallBestTimes.length] = time;
		// sort in descending order
		this.overallBestTimes.sort(function(a, b) {return timeCompareLessThan(a, b)});
		console.log("added a new time");
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareLessThan(time, this.overallBestTimes[this.overallBestTimes.length - 1])) {
			// replace the slowest time with the new time
			this.overallBestTimes[this.overallBestTimes.length - 1] = time;
			
			// sort in descending order
			this.overallBestTimes.sort(function(a, b) {return timeCompareLessThan(a, b)});
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

HighScores.prototype.addNewRating = function(playerName, rating) { 
	// Stores the top 10 ratings
	
	// So if there are less than 10 top ratings, just store it
	if (this.playerRatings.length < 10) {
		this.playerRatings[this.playerRatings.length] = new RatingItem(playerName, rating);
		// sort in descending order
		this.playerRatings.sort(function(a, b) {return ratingCompareGreaterThan(a, b)});
	}
	else {
		// assume the ratings array is sorted in descending order, therefore, the
		// lowest rating is in the last slot
		if (rating > this.playerRatings[this.playerRatings.length - 1].rating) {
			// replace the lowest rating with the new one
			this.playerRatings[this.playerRatings.length - 1] = new RatingItem(playerName, rating);
			// sort in descending order
			this.playerRatings.sort(function(a, b) {return ratingCompareGreaterThan(a, b)});
		}
	}
}
//-----------------------------------------------------------------------------
// Semi-random global variable in order to reference in Player.js:

var highScores = new HighScores(); // array for the high scores

// ------------------------Player.js-------------------------------------------	

function Player(name) {
	this.userName = name;
	this.gameMode = 0; // 0 signifies no game mode selected yet
	//this.highScores = [];
	// potential alternative to highScores
	this.bestTimes = []; // best times from time trial
	this.bestDistances = []; // furtherest distances from challenge mode
	this.multiplayerRating = 0;
}

Player.prototype.setName = function(name) {
	this.userName = name;
}

Player.prototype.setGameMode = function(mode) {
	this.gameMode = mode;
}


// Player.prototype.addHighScore = function(score) {
	// // Stores the top 5 scores
	
	// // So if there are less than 5 scores, just store it
	// if (this.highScores.length < 5) {
		// this.highScores[this.highScores.length] = score;
		// // sort in descending order
		// this.highScore.sort(function(a, b) {return b-a});
	// }
	// // else there are already 5 scores, so we need to remove the lowest
	// else {
		// // assume it is sorted in descending order, therefore the lowest score is the last one
		// if (score > this.highScores[this.highScores.length - 1]) {
			// // replace the lowest score with the new score
			// this.highScores[this.highScores.length - 1] = score;
			// // sort in descending order
			// this.highScore.sort(function(a, b) {return b-a});
		// }
		// // else the new score isn't as high as any of the saved high scores
	// }
// }

Player.prototype.addNewTime = function(time) {
	// Stores the top 10 times
	
	// So if there are less than 10 times, just store it
	if (this.bestTimes.length < 10) {
		this.bestTimes[this.bestTimes.length] = time;
		// sort in descending order
		this.bestTimes.sort(function(a, b) {return timeCompareLessThan(a, b)});
		highScores.addNewTime(time);
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (timeCompareLessThan(time, this.bestTimes[this.bestTimes.length - 1])) {
			// replace the slowest time with the new time
			this.bestTimes[this.bestTimes.length - 1] = time;
			// sort in descending order
			this.bestTimes.sort(function(a, b) {return timeCompareLessThan(a, b)});
			
			highScores.addNewTime(time);
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
	highScores.addNewRating(this.userName, rating);	
}

// -----------------------GameManager.js---------------------------------------

//takes cliend.id and sends a value to the oppopent
function emitOtherPlayer( myid , msg, value )
{
	var game = gameManager.findGame( myid );
	var otherPlayer = game.otherPlayer( myid );
	io.sockets.socket( otherPlayer ).emit( msg, value );
};

//class to hold games
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
}

//manages all of the active games
function GameManager()
{
	this.allGames = [];
	
	this.addGame = function( game )
	{
		this.allGames[ this.allGames.length ] = game;
	};
	
	this.findGame = function( playerId )
	{
		for( var game in this.allGames)
		{
			if( this.allGames[game].player1id === playerId)
			{
				return this.allGames[game];
			}
			if( this.allGames[game].player2id === playerId )
			{
				return this.allGames[game];
			}
		}
	}
}


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

var players = []; // array of all the players
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
		// for ( var i = 0; i < newPlayer.highScores.length; ++i) {
			// players[players.length - 1 ].addHighScore( newPlayer.highScores[i]); // i think this wrong
		// }
		for ( var i = 0; i < newPlayer.bestTimes.length; ++i) {
			players[players.length - 1 ].addNewTime( newPlayer.bestTimes[i]); // i think this wrong
		}
		for ( var i = 0; i < newPlayer.bestDistances.length; ++i) {
			players[players.length - 1 ].addNewDistance( newPlayer.bestDistances[i]); // i think this wrong
		}
	}
	//adds to the file
	//var line = JSON.stringify(newPlayer);
   // fs.appendFileSync("./data.txt", line.toString() + "\n");
});

fs.readFileSync("./highscores.txt").toString().split('\n').forEach(function (line) {
	if (line != "") {
		var newHighScore = JSON.parse(line);
		highScores[highScores.length] = new HighScores();
		highScores[highScores.length - 1] = newHighScore;
		// for ( var i = 0; i < newHighScore.overallBestTimes.length; ++i) {
			// highScores[highScores.length - 1] = newHighScore.
		// }
	}
});


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
	if (waitingOnRace.length != 0) {
		if (waitingOnRace[0] == playerName) {
			waitingOnRace.length = 0;
		}
	}
	if (waitingOnChallenge.length != 0) {
		if (waitingOnChallenge[0] == playerName) {
			waitingOnChallenge.length = 0;
		}
	}
}

// -------------SOCKET EVENTS -------------------------------------------------

// What to do with a new client
io.sockets.on(
  'connection',
  function(client) {

    // Welcome message.
    client.emit('welcome', 'Welcome to the game!');

    // Handle client login - might wanna make the login stuff better in the future
    client.on(
      'login',
      function(message) {

      	console.log('got login' );
      	console.log(message.user_name);

        // This function extracts the user name from the login message, stores
        // it to the client object, sends a login_ok message to the client, and
        // sends notifications to other clients.
        if (message && message.user_name) {
          client.set('user_name', message.user_name);
          client.emit('login_ok');
          // client.broadcast.emits() will send to all clients except the
          // current client. See socket.io FAQ for more examples.
          client.broadcast.emit('notification',
                                message.user_name + ' joined the game.'); // might wanna remove this
			console.log(message.user_name + ' joined the game.');
			var playerIndex = findPlayerIndex(message.user_name);
					
			if (playerIndex == -1) {
					players[players.length] = new Player(message.user_name);
			}			
			else{ //this is a return player
			//not sure what goes here
			}
			fs.appendFileSync(message.user_name + ".txt", message.user_name + " logged in.\n");
          return
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
					gameManager.addGame( newGame );
					
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
				//clearAllWaiting(msg.user_name);
				// check to see if there is an opponent waiting
				// if there is not then set this client as waiting
				if (waitingOnChallenge.isWaiting == false) {
					waitingOnChallenge.setWaitingPlayer(msg.user_name, client.id);
					// waitingOnChallenge[0] = msg.user_name;
					io.sockets.socket( waitingOnChallenge.userID ).emit('waitForRace', 'Waiting for other player.');
					// -----------------------------------------------SHOULDNT THIS BE waitForChallenge?!?!?!?!?!?
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
					gameManager.addGame( newGame );
					
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

	
	client.on(
		'deathByWall',
		function(died) {
		if( died.progress !== 0 ) {
			fs.appendFileSync(died.user_name + ".txt", died.user_name + " died because they hit an obstacle with " + died.progress + "% progress.\n");
		}
	});	
	
	client.on(
		'deathByBullet',
		function(died) {
		if( died.progress !== 0 ) {
			fs.appendFileSync(died.user_name + ".txt", died.user_name + " died because they hit a bullet with " + died.progress + "% progress.\n");
		}
	});	
	
	// HIGH SCORE Messages
	// high scores request - returns the players best times, best distances, 
	// and MP rating
	client.on(
		'highScoresRequest',
		// the highScoreRequest object should contain the player's userName
		function(highScoresRequest) {
			// var playerIndex = findPlayerIndex(highScoreRequest.userName);
			// //var highScores = players[playerIndex].getHighScores();
			console.log(highScoresRequest.scoreType);
			console.log("length is: " + highScores.overallBestDistances.length);
			if (highScoresRequest.scoreType == CHALLENGE) {
				for (var i = 0; i < highScores.overallBestDistances.length; ++i) {
					console.log(highScores.overallBestDistances[i].dist);
				}
				client.emit('highScoresResponse', {scores: highScores.overallBestDistances });
			}
			else {
				var times = [];
				for (var i = 0; i < highScores.overallBestTimes.length; ++i) {
					var temp = new StringTime(highScores.overallBestTimes[i].player, highScores.overallBestTimes[i].toString());
					times[times.length] = temp;
				}
				client.emit('highScoresResponse', {scores: times});
			}
				// playerDistances : players[playerIndex].bestDistances, 
				// playerMPRating : players[playersIndex].multiplayerRating } );
	});		
	
	// new high score
	client.on(
		'newHighScore',
		// highScoreObject should contain the user name (userName) and 
		// a new high score (highScore);
		function(highScoreObject) {
			if (highScoreObject) {
				// find player
				var playerIndex = findPlayerIndex(highScoreObject.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					console.log('User name not found!');
					return;
				}
				players[playerIndex].addHighScore(highScoreObject.highScore);
			}
			else {
				console.log('error setting new high score');
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
				players[playerIndex].addNewTime(time);
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
	// update - right now it just broadcasts the update to other client
	// only works for a single multiplayer game at the moment
	client.on(
		'update',
		function(updateObject) {
			//emit to the opponent
			// client.broadcast.emit('newUpdate', updateObject);
			emitOtherPlayer( client.id, 'newUpdate', updateObject);

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

			var game = gameManager.findGame(client.id);
			var oppName = game.otherPlayerName(winObject.userName);
			
			var otherPlayerIndex = findPlayerIndex(oppName);
			
			// make sure player exists
			if (otherPlayerIndex == -1) {P
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[otherPlayerIndex].updateMPRating(-10);	

	});
	
	// receive a signal that a client has lost their game
	client.on(
		'lostGame',
		// lostObject should have the user name of the player that has lost
		// (userName)
		function(lostObject) {
					//emit to the opponent
			//client.broadcast.emit('opponentLost', { name : "" } ); 
			emitOtherPlayer( client.id, 'opponentLost', { name : "" } ); 
			
			// update the winning player so that it gains rating
			var playerIndex = findPlayerIndex(lostObject.userName);
			
			// make sure player exists
			if (playerIndex == -1) {
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[playerIndex].updateMPRating(-10);
			
			// update the losing player so that it loses rating

			var game = gameManager.findGame(client.id);
			var oppName = game.otherPlayerName(lostObject.userName);
			
			var otherPlayerIndex = findPlayerIndex(oppName);
			
			// make sure player exists
			if (otherPlayerIndex == -1) {
				client.emit('error', 'User name not found!');
				console.log('User name not found!');
				return;
			}	

			players[otherPlayerIndex].updateMPRating(10);

	});
	
	//the client is done now write his stuff to the file
	client.on('endgame', function(name)
	{			
			fs.appendFileSync(name.user_name + ".txt", name.user_name + " quit.\n");
			console.log("Wrote to data.txt file\n");
			fs.writeFileSync("./data.txt","");
			var player;
			for ( var j = 0; j < players.length; ++j)
			{
				player = players[ j ];
				var json = { user_name: player.userName, highScores: player.highScores, bestTimes: player.bestTimes, bestDistances: player.bestDistances };
				var line = JSON.stringify(json);	
				fs.appendFileSync("./data.txt", line.toString() + "\n");
			}
			
			var highScoreJSON = { overallBestTimes: highScores.overallBestTimes, overallBestDistances: highScores.overallBestDistances, playerRatings: highScores.playerRatings };
			var line2 = JSON.stringify(highScoreJSON);
			fs.writeFileSync("./highscores.txt", line2.toString());
	});

  });

