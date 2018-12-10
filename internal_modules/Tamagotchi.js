'use strict';

// var fs = require('fs');

/**
* Primary class. Instantiating creates a Tamagotchi object
* 
* Note on promises -> Because this implementation is synchronous, the promises are not technically required. 
*    These are included with a view for async server implementation.
**/



/**
* Privately scoped Functions
**/ 
function update() {

}

function sleep() {

}

function die() {
	return new Promise((resolve, reject) => {
		if(__state.heartbeat !== null) {
			__state.heartbeat = null;
			clearInterval(__state.heartbeat);
			resolve({message:__state.name + ' has died!'});
		}
		else 
			reject({message:__state.name + ' was already dead!'});
	}
}


/**
* Privately scoped state
**/
var __state = {
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'name':'',
	'heartbeat':null
};



module.exports = class Tamagotchi {

	constructor() {
		__state.heartbeat = setInterval( () => { update();}, 1000 );
	}

	feed() {
		return new Promise((resolve, reject) => {

		});
	}

	putToBed() {

	}

	murder() {
		die();
	}
}