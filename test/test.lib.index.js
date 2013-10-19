var assert = require('assert');
var rci = require('../lib');


describe('lib/index.js', function() {

  it('test with no-include.txt', function() {
    rci('./test/files/no-include.txt', '<%>', '</%>', function(data) {
      var expected = 'no include at this file\n';
      assert.equal(expected, data);
    });
  });

});
