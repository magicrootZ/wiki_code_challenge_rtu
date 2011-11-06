/*
 Copyright (C) 2011 Omar Ziranhua <oziranhua@gmail.com>
 
 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program; if not, write to
 
 Free Software Foundation, Inc.
 51 Franklin Street, Fifth Floor
 Boston, MA   02110-1301, USA.
 */



// Activate real time update only under these conditions
if(window.location.pathname !== '/w/index.php' && mw.config.get('wgAction') === 'view'){
	alert('real time update activated');
	// scope in the socket library
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
							// defaults to that domain at connection time.
							var socket = io.connect('http://localhost:3000/');
							
							// Once a connection is established, the server application that listens for updates
							// (running in your localhost or in the same domain as this page) will
							// emit a 'requestingRegistration' event. Listen for this.
							// Once we receive this emission, emit a 'sendingRegistration' event.
							socket.on("requestingRegistration", function(){
									  // send the pathname of this page to the server application.
									  socket.emit('sendingRegistration', {title: pathname});
									  alert('page has been registered');
									  });
							
							// A message has been sent from the server application 
							socket.on("updatePage", function(data){
									  alert('page has been updated');
									  // extract the payload
									  var updated_html = data.html;
									  
									  // TODO: Here we can perform a diff between the updated markup and
									  // the current markup in the page. To extract the current html
									  // we can do something like: var current_html = jQuery("div.mw-content-ltr").html();
									  // once we have both versions, we need an algorithm that does specialized type of diff.
									  // One that takes into consideration that the diff being performed is being performed
									  // on html. This is necessary because when removing or adding pieces of the content 
									  // in the resulting html, the algorithm must be aware if the content changed, is content visible to the 
									  // user, so that it may add the necessary visible markers that signal the user 
									  // that the content has changed.
									  //	  
									  // Example of when the algorithm should not add markers:
									  // current html = '<a href="http://somelink/">My Link</a>'
									  // updated html = '<a href="http://someotherlink/">My Link</a>'
									  // result html =  '<a href="http://someotherlink/">My Link</a>'
									  //
									  // Example of when the algorithm should add markers (addition):
									  // current html = '<a href="http://somelink/">My Link</a>'
									  // updated html = '<a href="http://someotherlink/">My New Link</a>'
									  // result html  = '<a href="http://someotherlink/">My <ins>New</ins> Link</a>'
									  //
									  // Example of when the algorithm should add markers (deletion):
									  // current html = '<div>Too much text here</div>'
									  // updated html = '<div>text here<div>'
									  // result html  = '<div><del>Too much </del>text here</div>'
									  
									  // Once we have markers in place, we can use jquery to perform visual actions
									  // that will make the user see the changes (such as remove all <del> tags 
									  // from the content div one second after the html is inserted so that the user
									  // may witness the deletion).
									  
									  // A good starting point would be http://code.google.com/p/google-diff-match-patch/
									  // A derivative of this work seems feasible.
									  
									  // perform the update
									  jQuery("div.mw-content-ltr").html(updated_html);
									  
									  // peform diff animation after a certain timeout
									  });
							});
					 });
}