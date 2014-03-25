// This node.js program implements our game server.

/*
	TODO:
	-make TODO list...
*/
// ---------------need to make into modules if possible------------------------	

function Player(name) {
	this.userName = name;
	this.gameMode = -1;
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
	}
	// else there are already 5 scores, so we need to remove the lowest
	else {
		var indexOfLowest = 0;
		for ( var i = 1; i < this.highScores.length; ++i ) {
			if ( this.highScores[i] < this.highScores[indexOfLowest] ) {
				indexOfLowest = i;
			}
		}
		this.highScores[indexOfLowest] = score;
	}
}
	
// ----------------------------------------------------------------------------

// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(10001);

var players = [];

// Handles HTTP requests.
function handler(request, response) {
  // This will read the file 'index.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
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

// Tells socket.io to listen to an event called 'connection'.
// This is a built-in event that is triggered when a client connects to the
// server. At that time, the function (the 2nd argument) will be called with an
// object representing the client.
io.sockets.on(
  'connection',
  function(client) {
	
    // Send a welcome message first.
    client.emit('welcome', 'Welcome to the game!');

    // Listen to an event called 'login'. The client should emit this event when
    // it wants to log in to the game.
    client.on(
      'login',
      function(message) {
        // This function extracts the user name from the login message, stores
        // it to the client object, sends a login_ok message to the client, and
        // sends notifications to other clients.
        if (message && message.user_name) {
          client.set('user_name', message.user_name);
          client.emit('login_ok');
          // client.broadcast.emits() will send to all clients except the
          // current client. See socket.io FAQ for more examples.
          client.broadcast.emit('notification',
                                message.user_name + ' joined the game.');
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
				var playerIndex = -1;
				for (var i = 0; i < players.length; ++i) {
					if (players[i].userName == msg.user_name) {
						playerIndex = i;
						break;
					}
				}
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(0);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('sp_tt_msg', 'You have selected SinglePlayer Time Trial!' );
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
				var playerIndex = -1;
				for (var i = 0; i < players.length; ++i) {
					if (players[i].userName == msg.user_name) {
						playerIndex = i;
						break;
					}
				}
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(1);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('sp_ch_msg', 'You have selected SinglePlayer Challenge!');
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
				var playerIndex = -1;
				for (var i = 0; i < players.length; ++i) {
					if (players[i].userName == msg.user_name) {
						playerIndex = i;
						break;
					}
				}
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(2);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('mp_race_msg', 'You have selected MultiPlayer Race!' );
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
				var playerIndex = -1;
				for (var i = 0; i < players.length; ++i) {
					if (players[i].userName == msg.user_name) {
						playerIndex = i;
						break;
					}
				}
				if (playerIndex == -1) {
					client.emit('error', 'User name not found!');
					return;
				}
				players[playerIndex].setGameMode(3);
				console.log('Player game mode is: ' + players[playerIndex].gameMode);
				client.emit('mp_ch_msg', 'You have selected MultiPlayer Challenge!' );
			}
			else {
				client.emit('error', 'Invalid user name!'); // for debugging
			}	
			
			
	});	
	
	// high scores request
	client.on(
		'highScoresRequest',
		function() {
			client.emit('highScoresResponse', 'High Score Placeholder');
	});		
	
	// update
	client.on(
		'update',
		function() {
			// action goes here
	});	

  });
