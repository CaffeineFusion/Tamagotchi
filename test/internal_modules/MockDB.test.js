'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var MockDB = require("../../internal_modules/MockDB.js");

chai.use(chaiAsPromised);
chai.should();


const statusTemplate = {'hunger':0.5,
	'tiredness':0.5,
	'bladder':0.5,
	'age':0.01
};
const defaultTamagotchi = {'id':1,
	'name':'Tammy',
	'health':100,
	'hunger':0,
	'tiredness':0,
	'bladder':0,
	'age':0,
	'awake':true 
};

// Exposed methods for testing: constructor(), get(id), update(id, d), create(d)




describe('MockDB', function() {
	describe('constructor()', function() {
		let db = new MockDB();
		it('New DB should be empty.', function() {
			return expect(db.get(1).should.eventually.deep.equal({}));
		});
	});

	describe('create()', function() {

		it('Empty object should not throw an error.', function() {
			let db = new MockDB();
			return expect(db.create({}).should.eventually.deep.equal({}));
		});

		it('Empty object should not throw an error.', function() {
			let db = new MockDB();
			return expect(db.create({}).should.eventually.deep.equal({}));
		});
	});


	describe('update()', function() {

	});

   /* it('Should return our Tamigotchi internal state', function() {
        var expectedOutput = {'id':1,
			'name':'Tammy',
			'health':100,
			'hunger':0,
			'tiredness':0,
			'bladder':0,
			'age':0,
			'awake':true};

        return expect(dbFacade.get().should.eventually.deep.equal(expectedOutput));
    });*/
});


