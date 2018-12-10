

## TODO
- Set up handling for conflicting writes (eg. Update routine overwriting a new command)
- Add error handling and prompts

### Wishlist
- Persistent state storage
- Idempotency


## Introduction
Javascript - Node.JS 
[Note: I've made liberal use of arrow functions, lambdas and Promises]

### Running the Code
```
npm start
```
On creation, the Tamagotchi runs on a 1 second timer. 
Commands are run through invoking three functions 

### Testing the Code
```
npm test
```

## Design

![Architecture](/doc_assets/architecture.png)

### REPL Server
To handle the user interaction, the built in REPL server seemed like a rapid way to get our CLI up and running.
The server is somewhat overpowered for our purposes (eg. allowing any old Javascript to be written) but reduced the amount of custom code required for event and input handlers.

### Tamagotchi
Tamagotchi is a class that encapsulates our Tamagotchis functionality, business logic, and communicates to our DB layer.

### MockDB
An actual DB seemed like overkill for this demo. Instead, I've pulled the Tamagotchi state into a single JSON object (the "DB") and created a facade that interacts with it. This would significantly reduce the effort for porting this application to an actual database and persistent storage.
The downside is that the Tamagotchi only exists so long as the service exists, and is terminated at the end. 
We could read and write to an external JSON object, thereby persisting state, if time permits. Or go the full hog and spin up a simple Mongo instance.

## Testing
Chai + Mocha

## Caveats
The data updates are not currently idempotent. 