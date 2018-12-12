'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var MockDB = require("../../internal_modules/MockDB.js");
var objHelpers = require('../../internal_modules/helpers/objHelpers.js');

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
const alternateTamagotchi = {'id':1,
	'name':'Fred',
	'health':50,
	'hunger':50,
	'tiredness':50,
	'bladder':50,
	'age':50,
	'awake':false 
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

		it('Check Default Tamagotchi retention', function() {
			let db = new MockDB();
			return expect(db.create(defaultTamagotchi).should.eventually.deep.equal(defaultTamagotchi));
		});

		it('Database should permit overwrite', function() {
			let db = new MockDB();
			db.create(defaultTamagotchi)
				.then(() => {
					return expect(db.create(alternateTamagotchi).should.eventually.deep.equal(alternateTamagotchi));
				});
		});

		it('Deep cloning should break connection with origin object state', function() {
			let db = new MockDB();
			let temp = objHelpers.deepClone(defaultTamagotchi); 
			db.create(temp)
				.then((obj) => {
					temp.name = 'cheese';	// Update original object. Incorrect cloning would also update db object.
					return assert(obj.should.eventually.deep.equal(defaultTamagotchi));
				});
		});

		it('Deep cloning should break connection database object and returned value', function() {
			let db = new MockDB();
			db.create(defaultTamagotchi)
				.then((obj) => {
					obj.name = 'cheese';	// Update returned object. Incorrect cloning would also update db object
					return expect(db.get(1).should.eventually.deep.equal(defaultTamagotchi));
				});
		});
	});


	describe('update()', function() {

		it('Empty object should not throw an error.', function() {
			let db = new MockDB();
			return expect(db.update({}).should.eventually.deep.equal({}));
		});

		it('Check Default Tamagotchi retention', function() {
			let db = new MockDB();
			return expect(db.update(defaultTamagotchi).should.eventually.deep.equal(defaultTamagotchi));
		});

		it('Database should permit overwrite', function() {
			let db = new MockDB();
			db.update(defaultTamagotchi)
				.then(() => {
					return expect(db.update(alternateTamagotchi).should.eventually.deep.equal(alternateTamagotchi));
				});
		});

		it('Deep cloning should break connection with origin object state', function() {
			let db = new MockDB();
			let temp = objHelpers.deepClone(defaultTamagotchi); 
			db.update(temp)
				.then((obj) => {
					temp.name = 'cheese';	// Update original object. Incorrect cloning would also update db object.
					return assert(obj.should.eventually.deep.equal(defaultTamagotchi));
				});
		});

		it('Deep cloning should break connection database object and returned value', function() {
			let db = new MockDB();
			db.update(defaultTamagotchi)
				.then((obj) => {
					obj.name = 'cheese';	// Update returned object. Incorrect cloning would also update db object
					return expect(db.get(1).should.eventually.deep.equal(defaultTamagotchi));
				});
		});
	});
});


