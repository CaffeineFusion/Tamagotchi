var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var MockDB = require("../../internal_modules/MockDB.js");

var assert = chai.assert;
var expect = chai.expect;

chai.use(chaiAsPromised);

describe('mockDB.get()', function() {

    it('Should return our Tamigotchi internal state', function() {
        var expectedOutput = {'id':1,
			'name':'',
			'health':100,
			'hunger':0,
			'tiredness':0,
			'bladder':0,
			'age':0 }

        return expect(MockDB.get()).to.eventually.deep.equal(expectedOutput);
    });
});
