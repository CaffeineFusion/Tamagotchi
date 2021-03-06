'use strict';
//Event Handlers
/**
 * Collection of commandline output in response to certain events.
 * Seperates out IO from the Business Logic of Tamagotchi.
 * Events are triaged via the cb function at the bottom.
 * 
 *  TODO: Refactor: Convert to pure functions. Return string output rather than outputting directly to console (IO).
 */

module.exports.onPoop = (event) => {
	console.log('\n\
         (   )\n\
      (   ) (\n\
       ) _   )\n\
        ( \\_\n\
      _(_\\ \\)__\n\
     (____\\___)) \n');
}; // ascii adapted from http://ascii.co.uk/art/shit

module.exports.onDeath = (event) => {
	console.log('\n\
                  \\__|=\n\
                 (    )\n\
                 __)(__\n\
           _____/      \\_____\n\
          |  _     ___   _   ||\n\
          | | \\     |   | \\  ||\n\
          | |  |    |   |  | ||\n\
          | |_/     |   |_/  ||\n\
          | | \\     |   |    ||\n\
          | |  \\    |   |    ||\n\
          | |   \\. _|_. | .  ||\n\
          |                  ||\n\
          |                  ||\n\
  *       | *   **    * **   |**      **\n');

	console.log('Your Tamagotchi has died :\'(');
	console.log('To adopt a new Tamagotchi, use the command adoptNew()');
}; // ascii adapted from http://ascii.co.uk/art/tombstone

module.exports.onDying = (event) => {
	console.log('Ohno! Your Tamagotchi is losing health, quick - feed it!');
}; 

module.exports.onFeed = (event) => {
	if(event.success == false) {
		console.log(event.message);
	}
	else {
		console.log(' \n\
                     (\n\
                      )\n\
                 __..---..__\n\
             ,-=\'  /  |  \\  `=-.\n\
            :--..___________..--;\n\
             \\.,_____________,./\n');
		console.log('Omnomnomnom! -25 hunger');

	}
}; // ascii adapted from https://www.asciiart.eu/food-and-drinks/other - credit to Riitta Rasimus

module.exports.onMurder = (event) => {
	console.log('Ohno! How could you?');
}; 

module.exports.onWake = (event) => {
	if(event.success == false) {
		console.log(event.message);
	}
	else {
		console.log(' \n\
         \'\n\
        \\  ,  /\n\
    \' ,___/_\\___, \'\n\
       \\ /o.o\\ /\n\
   -=   > \\_/ <   =-\n\
       /_\\___/_\\\n\
    . `   \\ /   ` .\n\
        /  `  \\\n\
           .\n\
		');
		console.log(event.message);
	}
}; // ascii adapted from https://www.asciiart.eu/nature/sun

module.exports.onSleep = (event) => {
	if(event.success == false) {
		console.log(event.message);
	}
	else {
		console.log(' \n\
                             Z \n\
                       Z \n\
                    z \n\
                  z \n\
		');
		console.log(event.message);
	}
};

/**
 * cb - a switching function which which redirects event triggers to supporting functions
 * TODO: rename
 * @param  {obj} event    an object describing the event
 */
module.exports.cb = (event) => {
	switch(event.type) {
		case 'death':
			module.exports.onDeath(event);
			break;
		case 'dying':
			module.exports.onDying(event);
			break;
		case 'feed':
			module.exports.onFeed(event);
			break;
		case 'murder':
			module.exports.onMurder(event);
			break;
		case 'poop':
			module.exports.onPoop(event);
			break;
		case 'putToBed':
			module.exports.onSleep(event);
			break;
		case 'sleep':
			module.exports.onSleep(event);
			break;
		case 'wake':
			module.exports.onWake(event);
			break;
	}
};