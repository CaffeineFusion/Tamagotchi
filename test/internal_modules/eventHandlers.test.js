'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var eventHandlers = require("../../internal_modules/eventHandlers.js");

chai.should();


describe('eventHandlers - requires refactor to pure functions to test effectively.', function() {
	
	it('Refactor EventHandlers into pure functions to allow unit testing.', function() {
		return assert(true == false); // Todo item. Throw error.
	});

});