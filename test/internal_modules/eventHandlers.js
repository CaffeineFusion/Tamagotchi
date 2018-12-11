'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;

var eventHandlers = require("../../internal_modules/eventHandlers.js");

chai.use(chaiAsPromised);
chai.should();
