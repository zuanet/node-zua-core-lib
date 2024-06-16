"use strict";

var should = require('chai').should();
var zuacore = require('../');

describe('#versionGuard', function() {
  it('global._zuacoreLibVersion should be defined', function() {
    should.equal(global._zuacoreLibVersion, zuacore.version);
  });

  it('throw an error if version is already defined', function() {
    (function() {
      zuacore.versionGuard('version');
    }).should.throw('More than one instance of bitcore');
  });
});
