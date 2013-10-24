var assert = require('assert');
var shell = require('shelljs/global');


describe('bin/rci', function() {
  testExec('');
  testExec('-i test/files/no-include.txt');
  testExec('-i test/files/include-file.txt -o test/files/_test_1.txt');
  testExec('-i https://raw.github.com/subtub/RecursiveContentInclude/master/test/files/include-file.txt');
  testExec('-i https://raw.github.com/subtub/RecursiveContentInclude/master/test/files/include-file.txt -o test/files/_test_2.txt');
});

/**
 * Small execution test helper.
 * Check if the exec code equals 0.
 */
function testExec(cmd) {
  it('execute bin/rci '+cmd, function() {
    var tmpCode = exec('node bin/rci '+cmd, {silent:true}).code;
    assert.equal( 0, tmpCode);
  });
}
