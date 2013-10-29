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

  describe('#killLinebreaks()', function() {
    it('should return the string without line breaks.', function() {
      assert.equal('foo', utils.killLinebreaks('\nfoo\n\n'));
      assert.equal('foobar', utils.killLinebreaks('\nfoo\nbar\n'));
    });
  });

});
