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

module.exports.onFeed = (event) => {
	if(event.success != true) {
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
		console.log('Omnomnomnom!');

	}
};


module.exports.onWake = (event) => {
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
}; // ascii adapted from https://www.asciiart.eu/nature/sun

module.exports.onSleep = (event) => {
	console.log(' \n\
                             Z \n\
                       Z \n\
                    z \n\
                  z \n\
	');
};

// Callback that connects event handlers to custom triggers
module.exports.cb = (event) => {
	switch(event.type) {
		case 'poop':
			module.exports.onPoop(event);
			break;
		case 'death':
			module.exports.onDeath(event);
			break;
		case 'feed':
			module.exports.onFeed(event);
			break;
		case 'sleep':
			module.exports.onSleep(event);
			break;
		case 'wake':
			module.exports.onWake(event);
			break;
	}
};