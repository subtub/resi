var assert = require('assert');
var shell = require('shelljs/global');


describe('bin/rci', function() {
  testExec('');
  testExec('-i test/files/hello-world.txt');
  testExec('-i test/files/hello-world.txt -o test/files/_test.txt');
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
