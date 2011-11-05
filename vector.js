// Activate real time update only under these conditions
if(window.location.pathname !== '/w/index.php' && mw.config.get('wgAction') === 'view'){
	// scope in the tracking library
	jQuery.getScript('http://inkdroid.org:3000/socket.io/socket.io.js', function(){
		// At all systems go...
		jQuery( function() {
			// where are we?
			var pathname = window.location.pathname;
							
			// Connect to the application that listens for updates.
			// The application that does this can be run in your
			// localhost or in the server that serves the page your are
			// viewing. If the application is running in the
			// same server that served the page, remove the 
			// string literal argument 'http://localhost:3000/';
			// from the docs, it seems that the socket library
			// defaults to that domain.
			var socket = io.connect('http://localhost:3000/');

			// Once a connection is established, the server application that listens for updates
			// (running in your localhost or in the same domain as this page) will
			// emit a 'requestingRegistration' event. Listen for this.
			// Once we receive this emission, emit a 'sendingRegistration' event.
			socket.on("requestingRegistration", function(){
				// send the pathname of this page to the server application.
				socket.emit('sendingRegistration', {title: pathname});
			});

			// A message has been sent from the server application 
			socket.on("message", function(data){
				// Do a little parsing
				var msg = jQuery.parseJSON(data);
				// extract the payload
				var updated_html = msg.html;
				// perform the update
				jQuery("div.mw-content-ltr").html(updated_html);
			});
		});
	});
}
