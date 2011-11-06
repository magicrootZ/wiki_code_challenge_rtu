wiki_code_challenge_rtu (forked from the wikistream project) updates a wikipedia page 
in real time while a user is viewing the page (without having to reload the page). 
It is heavily based on wikistream's methodology of adding a robot (because robots are cool)
in the wikimedia IRC channels to listen for updates. The channels it listens to is defined
in the config.json file. This application is meant to solve the challenge posed by

http://www.mediawiki.org/wiki/October_2011_Coding_Challenge/Real-Time

The application solves only the trivial case and is more of a proof of concept.
Additional features can be added on top of the core functionality (such as 
the visual presentation of a page update). Like wikistream, it also requires
node.js socket.io and redis. This application only works for wikipedia logged in users.


Installation:

* install [redis](http://redis.io)
* install [node](http://node.io)
* install [npm](http://npmjs.org/)
* npm install

This project was developed under an OS X environment. npm versions might differ depending on
environments. I had trouble installing the express dependency in a linux box (Ubuntu 11.10)
due to the differences in npm.

Configuration:

The config.json file only lists the en.wikipedia irc channel, hence only
http://en.wikipedia.org pages will be listened to for updates. This file
can be modified to listen to more channels; take a look at the config.json.example
(inherited from the fork, thank you Ed Summers) file for the possible channels. 
It should be noted that the config.json file needs to be modified before running the application.
Change the following properties to prevent namespace clashing (be kind to your fellows):

    "ircNick": "magicRootbot", 
    "ircUserName": "magicRootbot", 
    "ircRealName": "magicRootbot", 

  Example:

    "ircNick": "magicRootbot2", 
    "ircUserName": "magicRootbot2", 
    "ircRealName": "magicRootbot2", 



The app.js file also needs to be modified before running. Change the following line (61?):

    headers: {'User-Agent': 'magicRootBot/0.1'}

To something unique, for example:

    headers: {'User-Agent': 'magicRootBot2/0.1'}


Add The contents of the vector.js file to YOUR vector.js file in your wikimedia account.


Execution:

Run redis (through the terminal).
  
    redis-server

If you do not want to view any output from the redis-server and run it as a background process, run:
 
    redis-server > /dev/null &

To run the app you'll first need to fetch wikipedia updates from IRC and 
feed them to redis. After some trial and error, in order to stably execute
updates.js, it needs to be executed under the web user, for example:
  
    sudo -u _www `which node` /<your path to wiki_code_challenge_rtu>/updates.js
  
The web user varies depending on the Operating System and/or server, in this case '_www'.
In order to just view output relevant to this project you can do:

    sudo -u _www `which node` /<your path to wiki_code_challenge_rtu>/updates.js | grep OZKEY
	
If you dont want to view any output and run the updates.js as a background process run:
 
    sudo -u _www `which node` /<your path to wiki_code_challenge_rtu>/updates.js > /dev/null &


next, start the webapp; this also should be run as the web user, for example:

    sudo -u _www `which node` /<your path to wiki_code_challenge_rtu>/app.js

You can append the same ' | grep OZKEY' and ' >/dev/null &' to this one depending on want you want.

=== Begin Legacy README.md content ===

License: Public Domain

=== End Legacy README.md content ===

wiki_code_challenge_rtu Author:

* Omar Ziranhua
