var assert = require('assert');
var rci = require('../lib');


describe('lib/index.js', function() {

  it('test with no-include.txt', function() {
    rci('./test/files/no-include.txt', '<%>', '</%>', function(data) {
      var expected = 'no include at this file\n';
      assert.equal(expected, data);
    });
  });


  describe('#isUrl()', function() {
    it('should return true if it is a http url.', function() {
      assert.equal(true, rci.isUrl('http://www.subtub.io/'));
    });
    it('should return true if it is a https url.', function() {
      assert.equal(true, rci.isUrl('https://www.subtub.io/'));
    });
    it('should return false if it is not a url.', function() {
      assert.equal(false, rci.isUrl('foo/bar'));
    });
  });
});
