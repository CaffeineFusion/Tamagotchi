'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var MockDB = require("../../internal_modules/MockDB.js");
var dbFacade = new MockDB();

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



describe('MockDB.get()', function() {

    it('Should return our Tamigotchi internal state', function() {
        var expectedOutput = {'id':1,
			'name':'Tammy',
			'health':100,
			'hunger':0,
			'tiredness':0,
			'bladder':0,
			'age':0,
			'awake':true};

        return expect(dbFacade.get().should.eventually.deep.equal(expectedOutput));
    });
});

describe('MockDB.set()', function() {
    it('Need to write tests', function() {
        return assert.equal(1,2);
    });
});

