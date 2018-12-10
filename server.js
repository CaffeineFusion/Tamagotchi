'use strict';

var io = process.stdin;

// Load custom libraries
var Tamagotchi = require('./internal_modules/Tamagotchi.js');




io.setRawMode( true );

io.resume();
io.setEncoding('utf8'); //alt. ascii

var __input = '';
// Create IO listeners
io.on( 'data', function(key){

	console.log('logging data.... ', key);
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