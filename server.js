'use strict';

// Load custom libraries
var Tamagotchi = require('./internal_modules/Tamagotchi.js');
var eventHandlers = require('./internal_modules/eventHandlers.js');
var repl = require('repl');

var t = {};

// Loading message
// ascii art generated via: http://patorjk.com/software/taag/#p=display&f=Ogre&t=Tamagotchi
console.log(' \n\
 _____                                  _       _     _ \n\
/__   \\__ _ _ __ ___   __ _  __ _  ___ | |_ ___| |__ (_)\n\
  / /\\/ _` | \'_ ` _ \\ / _` |/ _` |/ _ \\| __/ __| \'_ \\| |\n\
 / / | (_| | | | | | | (_| | (_| | (_) | || (__| | | | |\n\
 \\/   \\__,_|_| |_| |_|\\__,_|\\__, |\\___/ \\__\\___|_| |_|_|\n\
                            |___/                       \n\
');

const instructions = '\n\
Welcome to your new Tamagotchi. It has begun to grow even as we speak. \n\
You can interact with your Tamagotchi by typing the following commands: \n\
\n\
feed() : This feeds your Tamagotchi a random item of food (-25 hunger) \n\
putToBed() : This puts your Tamagotchi to bed allowing it recover energy (-5 tiredness p/s) \n\
getStatus() : This shows you all the current information about your Tamagotchi \n\
\n\
Pressing Ctrl+C will exit the application, putting your Tamagotchi up for adoption.\n\
Have fun!\n\
';

/**
 * welcome(tamagotchi) - display initial
 * @param  {object} tamagotchi [description]
 */
function welcome(tamagotchi) {
	return tamagotchi.getStats().then(console.log)
		.then(() => { console.log(instructions); } );
}

function initTamagotchi() {
	return new Tamagotchi(eventHandlers.cb);
}


t = initTamagotchi();
welcome(t);

function terminate() {
	t.murder();
}

var replServer = repl.start({ prompt: 'Tamagotchi > ' })
	.rli.on('close', terminate); //"Adopting it out" - Make sure to terminate Tamagotchi heartbeat callback on close.



/**
* Attach commands to REPL context.
* TODO: Add Error handling and prompts.
**/
replServer.context.feed = () => {t.feed(eventHandlers.cb);};
replServer.context.getStatus = () => {t.getStats().then(console.log);};
replServer.context.putToBed = () => {t.putToBed().then(console.log);};
replServer.context.murder = () => {t.murder(); console.log('How could you?!?');};     //not for the faint of heart
replServer.context.adoptNew = () => {t = initTamagotchi(); welcome(t);};

