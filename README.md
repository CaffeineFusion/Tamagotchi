#Tamagotchi
A simple Tamagotchi simulator.

Built by Owen Smith

## Requirements
### Necessary
- Capable of being fed
- Capable of being put to bed
- Capable of going to sleep on its own, losing health from hunger and pooping on its own without prompting
- Capable of aging from birth through to death

### Out-of-scope
- Add decimal-safe numbers

## Backlog
- Set up handling for conflicting writes (eg. Update routine overwriting a new command)
- Add error handling and prompts
- Enforce return in server.js
- Name the Tamagotchi
- Handle DB Promise messages and resolution within Tamagotchi
- Create Set function
- Refactor Ternary operators in Tamagotchi
- Name propagation.
- Rewrite Tamagotchi state management to ensure that death terminates state update flow.
- Add Put To Bed functionality.
- Fix feeding whilst asleep and not hungry bug.
- "losing health from hunger!"
- Age states
- Move config to config.json.
- Update Architecture diagram with DBFacade
- Update DB with death note.


### Wishlist
- Persistent state storage
- Idempotency
- Rework base data structure for future extensibility

## Introduction
Javascript - Node.JS 
(Note: I've made liberal use of arrow functions, lambdas and Promises)

### Running the Code

`npm start`

On creation, the Tamagotchi runs on a 1 second timer. 
Three main functions are provided: feed(), putToBed(), and getStatus()
There is currently no persistent storage. Your furry pet's existence will, sadly, be terminated when the application is closed - but surely you'd never do that, right?

The default status update cycle is arbitrarily high for demo purposes.

Rates of change can be found in internal_modules/Tamagotchi.js
```
const __updateModifiers = {
	'hunger':2,
	'tiredness':10,
	'bladder':2,
	'age':0.5
};

const __sleepModifier = {
	'tiredness':-5
};
```

Tiredness is fast (+10 p/s), to quickly demonstrate the sleep cycle.
Decreasing age (eg. to 0.2) would run into the limitations of javascript's inbuilt numeric system. It will likely still work, just with odd rounding behaviours. A more flexible approach is out-of-scope for this PoC.



### Testing the Code

```
npm install
npm test
```

## Design

![Architecture](/doc_assets/architecture.png)

### REPL Server
To handle the user interaction, the built in REPL server seemed like a rapid way to get our CLI up and running.
The server is somewhat overpowered for our purposes (eg. allowing any old Javascript to be written) but reduced the amount of custom code required for event and input handlers.

### Tamagotchi
Tamagotchi is a class that encapsulates our Tamagotchi's functionality, business logic, and communication to DB layer.

### MockDB
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
