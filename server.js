'use strict';

// Load custom libraries
var Tamagotchi = require('./internal_modules/Tamagotchi.js');
var t = new Tamagotchi();
console.log(t);

var repl = require('repl');
var replServer = repl.start({ prompt: "Tamagotchi > " })
	.rli.on('close', () => { t.murder(); }); //Make sure to terminate Tamagotchi heartbeat on service end.

/**
* Attach commands to REPL context.
* TODO: Fix Ctrl-C exit cycle. Add Error handling and prompts.
**/
replServer.context.feed = () => {t.feed().then(console.log)};
replServer.context.status = () => {t.getStats().then(console.log)};
replServer.context.putToBed = () => {t.putToBed().then(console.log)};

//var io = process.stdin; //Deprecated method. REPL more straightforward.





/**
* onEnter responds to keyboard return triggering event
**/
/**
// Deprecated
function onEnter(input, tamagotchi) {
	return new Promise((resolve, reject) => {
		switch(input) {
			case 'feed':
				console.log('Let\'s feed your Tamagotchi!');
				resolve().then(tamagotchi.feed);
				break;
			case 'putToBed':
				console.log('You\'ve put your Tamagotchi to bed');
				resolve().then(tamagotchi.putToBed);
				break;
			default:
				reject({message:'I\'m sorry, your Tamagotchi didn\'t understand that command'});
				console.log('error: invalid input');
				break;
		}
	});
}

**/


/**
* Create Input Handlers
**/
/**
// Deprecated
io.setRawMode( true );

io.resume();
io.setEncoding('utf8'); //alt. ascii

var __input = '';
// Create IO listeners
io.on( 'data', function(key){

	// Exit: Kill Tamagotchi on Ctrl+C
	if ( key === '\u0003' ) {
		process.exit();
	}
	__input += key;
	//io.write(key);
});

io.on("end", function () {
	io.write(__input);
	console.log('data feed ended.... ');
});
**/





