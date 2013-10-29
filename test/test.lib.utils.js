var assert = require('assert');
var utils = require('../lib/utils');


describe('lib/utils.js', function() {
	
	describe('#killWhitespace()', function() {
    it('should return the string without whitespace.', function() {
      assert.equal('foo', utils.killWhitespace('foo'));
      assert.equal('foo', utils.killWhitespace('  foo'));
      assert.equal('foo', utils.killWhitespace('  foo    '));
    });
  });

});
