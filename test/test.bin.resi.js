var assert = require('assert');
var shell = require('shelljs/global');


describe('bin/resi', function() {
  testExec('');
  testExec('-i test/files/no-include.txt');
  testExec('-i test/files/no-include-with-comment.txt');
  testExec('-i test/files/include-file.txt -o test/files/_test_1.txt');
  testExec('-i https://raw.github.com/subtub/resi/master/test/files/include-file.txt');
  testExec('-i https://raw.github.com/subtub/resi/master/test/files/include-file.txt -o test/files/_test_2.txt');
  testExec('-e "hello world"');
  testExec('-e "hello world" -t');
});

/**
 * Small execution test helper.
 * Check if the exec code equals 0.
 */
function testExec(cmd) {
  it('execute bin/resi '+cmd, function() {
    var tmpCode = exec('node bin/resi '+cmd, {silent:true}).code;
    assert.equal(tmpCode, 0);
  });
}
