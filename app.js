// imports

var fs = require('fs'),
    sys = require('sys'),
    http = require('http'),
    path = require('path'),
    redis = require('redis'),
    sio = require('socket.io'),
    express = require('express');

// get the configuration
var configPath = path.join(__dirname, "config.json");
var config = JSON.parse(fs.readFileSync(configPath));
var app = module.exports = express.createServer();
var requestCount = 0;


// get the wikipedia shortnames sorted by their longname

var wikisSorted = [];
for (var chan in config.wikipedias) wikisSorted.push(chan);
wikisSorted.sort(function(a, b) {
  w1 = config.wikipedias[a].long;
  w2 = config.wikipedias[b].long;
  if (w1 == w2) return 0;
  else if (w1 < w2) return -1;
  else if (w1 > w2) return 1;
});


app.listen(3000);

// set up the socket.io update stream
var io = sio.listen(app);

io.sockets.on('connection', function(socket) {
	// A client has connected, emit the 'requestingRegistration' event.
	socket.emit('requestingRegistration');
	// When a browser/client receives the 'requestingRegistration' event, it
	// should emit a corresponding 'sendingRegistration' event. Listen for it.
	socket.on('sendingRegistration', function(data){
		// connect to redis
		var updates = redis.createClient();
		// subscribe to the page channel
		updates.subscribe(data.title);
		// when a page has been updated, notify the client
		updates.on("message", function(channel, message){
				   
			// Note that message contains information about the 
			// update. We are not using it here, but it might
			// be useful if the application is further developed.
			
			// At this point we know the page has been updated.
			// Fetch the updated version.
			// TODO: change options.headers['User-Agent'] to something unique
			var options = {
				host: 'en.wikipedia.org',
				port: 80,
				path: '/w/index.php?action=render&title=' + encodeURI(data.title.replace('/wiki/','')),
				headers: {'User-Agent': 'magicRootBot/0.1'}
			}

			// get the updated version
			http.get(options, function(res){
				var data = '';
				res.setEncoding('utf8');
				res.on('data', function(chunk){
					// data aggregation
					data += chunk;
				});
					 
				// Once we receive all the data, send it to the client.
				res.on('end', function(){
					   socket.send(JSON.stringify({html: data}));
			   });
			}).on('error', function(e){
				// something went wrong.
				console.log('got error ' + e.message);
			}); 
		}); // end message
	}); // end sendingRegistration
}); // end connection
