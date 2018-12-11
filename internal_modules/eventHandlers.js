'use strict';
//Event Handlers
module.exports.onPoop = () => {
	console.log('\n\
         (   )\n\
      (   ) (\n\
       ) _   )\n\
        ( \\_\n\
      _(_\\ \\)__\n\
     (____\\___)) \n');
}; // ascii adapted from http://ascii.co.uk/art/shit

module.exports.onDeath = () => {
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

// Callback that connects event handlers to custom triggers
module.exports.cb = (event) => {
	switch(event.type) {
		case 'poop':
			module.exports.onPoop(event);
			break;
		case 'death':
			module.exports.onDeath(event);
			break;
	}
};