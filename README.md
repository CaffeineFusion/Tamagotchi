#Tamagotchi
A simple Tamagotchi simulator.

Built by Owen Smith


## Introduction
Javascript - Node.JS 
(Note: I've made liberal use of arrow functions, lambdas and Promises)



### System Requirements
- node.js

### Running the Code

`npm start`

On creation, the Tamagotchi runs on a 1 second timer.   
Three main functions are provided: feed(), putToBed(), and getStatus()  
There is currently no persistent storage. Your furry pet's existence will, sadly, be terminated when the application is closed - but surely you'd never do that, right?

The default status update cycle is arbitrarily high for demo purposes.

Rates of change can be found in internal_modules/Tamagotchi.js
```
const modifiers = {
	update: {
		'hunger':2,
		'tiredness':5,
		'bladder':2,
		'age':0.5
	},
	sleep: {
		'tiredness':-5
	},
	dying: {
		'health':-5
	}
};
```

Tiredness is fast (+10 p/s), to quickly demonstrate the sleep cycle.  
Decreasing age rate (eg. to 0.2) would run into the limitations of javascript's inbuilt numeric system. It will likely still work, just with odd rounding behaviours. A more flexible approach is out-of-scope for this PoC.


State change rules can also be found in internal_modules/Tamagotchi.js
```
var rules = {
	death: 		(state) => { return (state.health <= 0 || state.age >= 100); },
	dying: 		(state) => { return (state.hunger >= 100); },
	exhaustion: (state) => { return (state.tiredness >= 80 && state.awake == true); },
	poop: 		(state) => { return (state.awake == true && state.bladder > 20); },
	wake: 		(state) => { return (state.awake == false && (state.tiredness <= 0 || state.bladder > 80)); },
	notHungry:	(state) => { return (state.hunger <= 25 ); }
};
```

The Tamagotchi:
1) dies when it reaches 0 health or age 100.  
2) starts losing health when its hunger hits or exceeds 100.  
3) keeps trying to sleep when its exhaustion reaches 80. (currently no penalty for being over tired)  
4) will poop while awake and bladder exceeds 20.   
5) will wake up if tiredness reaches 0, or bladder exceeds 80. (currently no penalty for bladder exceeding 100)  
6) will refuse to eat if its hunger is not above 25. (a lazy counter to over-feeding)  



### Testing the Code
Test Coverage is incomplete.  
Tests can be found in the test folder.  
For good examples, please see MockDB.test.js, jsonHelpers.test.js and Tamagotchi.test.js  

!Note: Areas where there is currently no test coverage have been marked with an assertion error in the Mocha output. This was intentional.  

```
npm install
npm test
```

## Design

### Project Specifications
#### Necessary
- Capable of being fed
- Capable of being put to bed
- Capable of going to sleep on its own, losing health from hunger and pooping on its own without prompting
- Capable of aging from birth through to death

#### Out-of-scope
- Persistent state storage
- Entertain/play with Tamagotchi

### Backlog
- Concurrency: Set up handling for conflicting writes (eg. Update routine overwriting a new command)
- Name the Tamagotchi
- Update put to bed function to include an error when Tamagotchi is already awake
- Age states
- Move config to config.json.
- Update Architecture diagram with DBFacade
- Update DB with death note.
- Decimal safe numbers.
- Fix unhandled Promises in test script.  (stateHandlers.js)
- Update Documentation
- Additional commentary in MockDB.js
- Add more behaviorally specific update tests for DB. (MockDB.test.js)
- Add sinon tests in stateHandlers
- Fix pause idiosyncracy


### Architecture
![Architecture](/doc_assets/architecture.png)


#### REPL Server
To handle the user interaction, the built in REPL server seemed like a rapid way to get our CLI up and running.  
The server is somewhat overpowered for our purposes (eg. allowing any old Javascript to be written) but reduced the amount of custom code required for event and input handlers.

#### Tamagotchi
Tamagotchi is a class that encapsulates our Tamagotchi's functionality, business logic, and communication to DB layer.  

#### MockDB
An actual DB seemed like overkill for this demo. Instead, I've pulled the Tamagotchi state into a single JSON object (the "DB") and created a facade that interacts with it. This would significantly reduce the effort for porting this application to an actual database and persistent storage.  
The downside is that the Tamagotchi only exists so long as the service exists, and is terminated at the end.   
We could read and write to an external JSON object, thereby persisting state, if time permits. Or go the full hog and spin up a simple Mongo instance.   
  
(Note: this is not intended as a full DB mockup)  

## Testing
Chai + Mocha  

Where further tests remain to be written, a placeholder has been added to indicate test coverage. This will be listed as a failed test in the testing output.

## Caveats
The data updates are not currently idempotent.   

## Naming Conventions
.js files returning a class are capitalised.  
.js files returning a function/collection of functions are standard camel case.  
Folders a lowercase with underscores.  
