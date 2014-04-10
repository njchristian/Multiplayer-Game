// This node.js program implements our game server.

/*
	TODO:
	-maybe the client menu should highlight or somehow indicate a player's choice if it is a MP
	mode and they are having to wait, therefore they for sure know what they selected
	-should scores be stored separately for each game mode?
	-make log in better and require password
	-file IO with player data
*/
// need to make into modules if possible
// ------------------------Player.js-----------------------------	

function Player(name) {
	this.userName = name;
	this.gameMode = 0; // 0 signifies no game mode selected yet
	this.highScores = [];
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


Player.prototype.addHighScore = function(score) {
	// Stores the top 5 scores
	
	// So if there are less than 5 scores, just store it
	if (this.highScores.length < 5) {
		this.highScores[this.highScores.length] = score;
		// sort in descending order
		this.highScore.sort(function(a, b) {return b-a});
	}
	// else there are already 5 scores, so we need to remove the lowest
	else {
		// assume it is sorted in descending order, therefore the lowest score is the last one
		if (score > this.highScores[this.highScores.length - 1]) {
			// replace the lowest score with the new score
			this.highScores[this.highScores.length - 1] = score;
			// sort in descending order
			this.highScore.sort(function(a, b) {return b-a});
		}
		// else the new score isn't as high as any of the saved high scores
	}
}

Player.prototype.addNewTime = function(time) {
	// Stores the top 5 times
	
	// So if there are less than 5 times, just store it
	if (this.bestTimes.length < 5) {
		this.bestTimes[this.bestTimes.length] = time;
		// sort in descending order
		this.bestTimes.sort(function(a, b) {return b-a});
	}
	else {
		// assume it is sorted in descending order, therefore the slowest time 
		// is the last one
		if (time > this.bestTimes[this.bestTimes.length - 1]) {
			// replace the slowest time with the new time
			this.bestTimes[this.bestTimes.length - 1] = time;
			// sort in descending order
			this.bestTimes.sort(function(a, b) {return b-a});
		}
		// else the new time isn't as fast as any of the saved times
	}
}


Player.prototype.addNewDistance = function(distance) {
	// Stores the top 5 longest distances in challenge mode
	
	// So if there are less than 5 top distances, just store it
	if (this.bestDistances.length < 5) {
		this.bestDistances[this.bestDistances.length] = distance;
		// sort in descending order
		this.bestDistances.sort(function(a, b) {return b-a});
	}
	else {
		// assume it is sorted in descending order, therefore the smallest 
		// distance is the last one
		if (distance > this.bestDistances[this.bestDistances.length - 1]) {
			// replace the smallest distance with the new distance
			this.bestDistances[this.bestDistances.length - 1] = distance;
			// sort in descending order
			this.bestDistances.sort(function(a, b) {return b-a});
		}
		// else the new distance isn't as far as any of the saved distances
	}
}


Player.prototype.updateMPRating = function(rating) {
	if (rating == "win") {
		this.multiplayerRating += 10;
	}
	else if (rating == "loss") {
		this.multiplayerRating -= 10;
	}
	else
		console.log('updateMPRating was called with something other than win or loss');
}

//takes cliend.id and sends a value to the oppopent
function emitOtherPlayer( myid , msg, value )
{
	var game = gameManager.findGame( myid );
	var otherPlayer = game.otherPlayer( myid );
	io.sockets.socket( otherPlayer ).emit( msg, value );
};

//class to hold games
function activeGame(player1, player2, gameMode)
{
	this.player1id = player1;
	this.player2id = player2;
	this.gameMode = gameMode;
	
	this.otherPlayer = function(myid)
	{
		if ( this.player1id == myid )
			return this.player2id;
		else
			return this.player1id;
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

var waitingOnRace = []; // stores players waiting for multiplayer race mode
var waitingOnChallenge = []; // stores players waiting for multiplayer challenge mode

var gameManager = new GameManager();


//reading all data for the previous players
fs.readFileSync('./data.txt').toString().split('\n').forEach(function (line) { 

	if (line != "")
	{
		var newPlayer = JSON.parse(line);
		players[players.length] = new Player(newPlayer.user_name);
		for ( var i = 0; i < newPlayer.highScores.length; ++i) {
					players[players.length - 1 ].addHighScore( newPlayer.highScores[i]); 
		}
		for ( var i = 0; i < newPlayer.bestTimes.length; ++i) {
					players[players.length - 1 ].addNewTime( newPlayer.bestTimes[i]); 
		}
		for ( var i = 0; i < newPlayer.bestDistances.length; ++i) {
					players[players.length - 1 ].addNewDistance( newPlayer.bestDistances[i]); 
		}
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
				
				// if the user is also waiting for challenge then remove them from that
				// waiting list. this also handles the case where the same client clicks
				// MP race twice in a row
				clearAllWaiting(msg.user_name);
				// check to see if there is an opponent waiting
				// if there is not then set this client as waiting
				
				//io.sockets.sockets[ waitingOnRace[ waitingOnRace.length ] ].emit( "hello" );
				
				//waitingonRace can be an object set to either null or client.id
				if (waitingOnRace.length == 0) {
					waitingOnRace[0] = client.id;
					// waitingOnRace[0] = msg.user_name;
					io.sockets.socket( waitingOnRace[0] ).emit('waitForRace', 'Waiting for other player.');
				 }
				
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					var waitingId = waitingOnRace[0];
					// clear the waiting on race array
					waitingOnRace.length = 0;
					var newGame = new activeGame( waitingId, client.id , 3);
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
				clearAllWaiting(msg.user_name);
				// check to see if there is an opponent waiting
				// if there is not then set this client as waiting
				if (waitingOnChallenge.length == 0) {				
					waitingOnChallenge[0] = msg.user_name;
					client.emit('waitForChallenge', 'Waiting for other player.');
				}
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					// else we assume there is an opponent so it is race time
					client.emit('opponentForChallenge', 'Opponent found, get ready for challenge mode.');
					client.broadcast.emit('opponentForChallenge', 'Opponent found, get ready for challenge mode.');
					// clear the waiting on challenge array
					waitingOnChallenge.length = 0;
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
		function(highScoreRequest) {
			var playerIndex = findPlayerIndex(highScoreRequest.userName);
			//var highScores = players[playerIndex].getHighScores();
			client.emit('highScoresResponse', { playerTimes : players[playerIndex].bestTimes, 
				playerDistances : players[playerIndex].bestDistances, 
				playerMPRating : players[playersIndex].multiplayerRating } );
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
				// find player
				var playerIndex = findPlayerIndex(timeObject.userName);
				
				// make sure player exists
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					console.log('User name not found!');
					return;
				}
				// add the new time
				players[playerIndex].addNewTime(timeObject.time);
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
				players[playerIndex].addNewDistance(distanceObject.distance);
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
	client.on(
		'wonGame',
		// winObject should have the user name of the player that has won
		// (userName)
		function() {
		//emit to the opponent
			//client.broadcast.emit('opponentWon', { name : "" } ); 
			emitOtherPlayer( client.id, 'opponentWon', { name : "" } ); 
	});
	
	// receive a signal that a client has lost their game
	client.on(
		'lostGame',
		// lostObject should have the user name of the player that has lost
		// (userName)
		function() {
			//emit to the opponent
			//client.broadcast.emit('opponentLost', { name : "" } ); 
			emitOtherPlayer( client.id, 'opponentLost', { name : "" } ); 
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
			
	});

  });

