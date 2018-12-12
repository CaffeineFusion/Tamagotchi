'use strict';

var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

var stateHandlers = require("../../internal_modules/stateHandlers.js");


describe('cb', function() {
	
	it('Write tests for stateHandlers', function() {
		return assert(true == false); // Todo item. Throw error.
	});

});