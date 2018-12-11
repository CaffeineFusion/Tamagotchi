'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var jsonHelpers = require("../../../internal_modules/helpers/jsonHelpers.js");

chai.should();

describe('incrementJSON', function() {

});

describe('deepCloneJSON', function() {

	it('Should deep replicate an existing object', function() {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};

		return expect(jsonHelpers.deepCloneJSON(input).should.deep.equal(expectedOutput));
	});

	it('Created object should not be affected by updates to the predecessor', function() {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let output = jsonHelpers.deepCloneJSON(input);
		input.test = 2;

		return expect(output.should.deep.equal(expectedOutput));
	});

	it('Changes to created object should not affect predecessor', function () {
		let input = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let expectedOutput = {'test':1, 'sample':-1, 'nulltype':null, 'string':'string'};
		let output = jsonHelpers.deepCloneJSON(input);
		output.test = 2;

		return expect(input.should.deep.equal(expectedOutput));
	});
});


