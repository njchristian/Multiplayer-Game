// This node.js program implements our game server.

/*
	TODO:
	-make TODO list...
	-maybe the client menu should highlight or somehow indicate a player's choice if it is a MP
	mode and they are having to wait, therefore they for sure know what they selected
	-should scores be stored separately for each game mode?
*/
// ---------------need to make into modules if possible------------------------	

function Player(name) {
	this.userName = name;
	this.gameMode = 0; // 0 signifies no game mode selected yet
	this.highScores = [];
}

Player.prototype.setName = function(name) {
	this.userName = name;
}

Player.prototype.setGameMode = function(mode) {
	this.gameMode = mode;
}

Player.prototype.addHighScore = function(score) { // probably want to change this to store the scores in order
	// Stores the top 5 scores
	
	// So if there are less than 5 scores, just store it
	if (this.highScores.length < 5) {
		this.highScores[this.highScores.length] = score;
		// sort in descending order
		this.highScore.sort(function(a, b) {return b-a});
	}
	// else there are already 5 scores, so we need to remove the lowest
	// else {
		// var indexOfLowest = 0;
		// for ( var i = 1; i < this.highScores.length; ++i ) {
			// if ( this.highScores[i] < this.highScores[indexOfLowest] ) {
				// indexOfLowest = i;
			// }
		// }
		// this.highScores[indexOfLowest] = score;
	// }
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
	
// ----------------------------------------------------------------------------

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

/*
// Handles HTTP requests.
function handler(request, response) {
  // This will read the file 'index.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
   // var url_request = url.parse(request.url).pathname;      
    // var tmp  = url_request.lastIndexOf(".");
    // var extension  = url_request.substring((tmp + 1));
	
	// file_path = url_request.replace("/", "");
  
  // fs.readFile(
    // __dirname + '/index.html',
    // function(err, content) {
      // if (err) {
        // // If an error happened when loading 'index.html', return a 500 error.
        // response.writeHead(500);
        // return response.end('Error loading ' + file_path);
      // }
      // // If no error happened, return the content of 'index.html'
	  // if (extension === 'js') {
			// response.writeHead(200, {'Content-Type': 'text/javascript'});
	  // }
	  // else {
		// response.writeHead(200, {'Content-Type': 'text/html'});
	  // }
      // response.end(content);
    // });
	 fs.readFile(
    __dirname + '/index.html',
    function(err, content) {
      if (err) {
        // If an error happened when loading 'index.html', return a 500 error.
        response.writeHead(500);
        return response.end('Error loading index.html!');
      }
      // If no error happened, return the content of 'index.html'
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    });
}
*/

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
			players[players.length] = new Player(message.user_name);
			for ( var i = 0; i < players.length; ++i) {
				console.log(players[i].userName);
			}	
          return
        }
        // When something is wrong, send a login_failed message to the client.
        client.emit('login_failed');
      });

	// Listen for game mode choice events  
	  
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
				var playerIndex = findPlayerIndex(msg.user_name);
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(2);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('sp_ch_msg', 'You have selected SinglePlayer Challenge!');
				
				// need to make sure that this player was not waiting for a MP mode,
				// if they were then they need to be removed from that queue.
				clearAllWaiting(msg.user_name);
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
			
			
	});		
	  
	// multiplayer race message
	client.on(
		'mp_race',
		function(msg) {
			if ( msg && msg.user_name ) {
				console.log(msg.user_name);
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
				if (waitingOnRace.length == 0) {
					// // check to make sure this client isn't also waiting for challenge,
					// // if so then remove the client from that waiting list
					// if (waitingOnChallenge.length != 0) {
						// if (waitingOnChallenge[0] == msg.user_name) {
							// waitingOnChallenge.length = 0;
						// }
					// }
					waitingOnRace[0] = msg.user_name;
					client.emit('waitForRace', 'Waiting for other player.');
				}
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					// check to make sure the same player hasn't hit the same button again
					// if so then just exit this function
					// if (msg.user_name == waitingOnRace[0]) {
						// return;
					// }
					
					// else we assume there is an opponent so it is race time
					client.emit('opponentForRace', 'Opponent found, get ready to race.');
					client.broadcast.emit('opponentForRace', 'Opponent found, get ready to race.');
					// clear the waiting on race array
					waitingOnRace.length = 0;
				}
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
				
				clearAllWaiting(msg.user_name);
				// check to see if there is an opponent waiting
				// if there is not then set this client as waiting
				if (waitingOnChallenge.length == 0) {
					// check to make sure this client isn't also waiting for race,
					// if so then remove the client from that waiting list
					// if (waitingOnRace.length != 0) {
						// if (waitingOnRace[0] == msg.user_name) {
							// waitingOnRace.length = 0;
						// }
					// }
				
					waitingOnChallenge[0] = msg.user_name;
					client.emit('waitForChallenge', 'Waiting for other player.');
				}
				// if there is an opponent waiting, signal that client that another
				// player has been found
				else {
					// check to make sure the same player hasn't hit the same button again
					// if so then just exit this function
					// if (msg.user_name == waitingOnChallenge[0]) {
						// return;
					// }
					
					// else we assume there is an opponent so it is race time
					client.emit('opponentForChallenge', 'Opponent found, get ready for challenge mode.');
					client.broadcast.emit('opponentForChallenge', 'Opponent found, get ready for challenge mode.');
					// clear the waiting on challenge array
					waitingOnChallenge.length = 0;
				}
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
			
			
	});	
	
	// High score stuff
	// high scores request
	client.on(
		'highScoresRequest',
		function() {
			client.emit('highScoresResponse', 'High Score Placeholder');
	});		
	
	// new high score
	client.on(
		'newHighScore',
		// highScoreObject should contain the user name (userName) and 
		// a new high score (highScore);
		function(highScoreObject) {
			if (highScoreObject) {
				var playerIndex = -1;
				// find player
				for (var i = 0; i < players.length; ++i) {
					if (players[i].userName == highScoreObject.userName) {
						playerIndex = i;
						break;
					}
				}
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
	
	// update - right now it just broadcasts the update to other client
	// only works for a single multiplayer game at the moment
	client.on(
		'update',
		function(updateObject) {
			client.broadcast.emit('newUpdate', updateObject);
	});	

  });

