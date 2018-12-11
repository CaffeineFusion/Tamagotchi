'use strict'
//Event Handlers
module.exports.onPoop = () => {
	console.log('\n\
	     (   )\n\
	  (   ) (\n\
	   ) _   )\n\
	    ( \\_\n\
	  _(_\\ \\)__\n\
	 (____\\___)) \n');
} // adapted from http://ascii.co.uk/art/shit

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
          |  name goes here  ||\n\
          |                  ||\n\
  *       | *   **    * **   |**      **\n');
}

// Callback that connects event handlers to custom triggers
module.exports.cb = (event) => {
	switch(event.type) {
		case 'poop':
			onPoop();
			break;
		case 'death':
			onDeath();
			break;
	}
};