'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var Tamagotchi = require("../../internal_modules/Tamagotchi.js");
//var tamagotchi = new Tamagotchi();

chai.use(chaiAsPromised);
chai.should();

const statusTemplate = {'hunger':0.5,
	'tiredness':0.5,
	'bladder':0.5,
	'age':0.01
}
const defaultTamagotchi = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true 
};



describe('Tamagotchi.update()', function() {

	it('Should update the Tamagotchi state by a given amount', function() {
		var expectedOutput = {'id':1,
			'name':'Tammy',
			'health':100,
			'hunger':0.5,
			'tiredness':0.5,
			'bladder':0.5,
			'age':0.01,
			'awake':true };

		return expect(Tamagotchi.update().should.eventually.deep.equal(expectedOutput));
	});
});
