var assert = require('assert');
var rci = require('../lib');


describe('samples/basic.md', function() {
  it('test with "samples/basic.md"', function() {
    var data = rci.readFileSync('./samples/basic.md');
    var expected = '# Usage:\n'+
                   '\n'+
                   'Run `rci -i sample/basic.md` to print the result to console.\n'+
                   '\n\n'+
                   '# Files:\n'+
                   '\n'+
                   'Included content of file1.md  \n'+
                   '# file1.md\n'+
                   '\n'+
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n'+
                   'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n'+
                   'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n'+
                   'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n'+
                   'cillum dolore eu fugiat nulla pariatur.\n'+
                   '\n\n'+
                   'Yep, an other included file.  \n'+
                   '# file2.md\n'+
                   '\n'+
                   'Excepteur sint occaecat cupidatat non\n'+
                   'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'+
                   '\n'+
                   'At this file we also include the `file1.md`  \n'+
                   '# file1.md\n'+
                   '\n'+
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n'+
                   'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n'+
                   'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n'+
                   'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n'+
                   'cillum dolore eu fugiat nulla pariatur.\n'+
                   '\n'+
                   '\n';
    assert.equal(expected, data);
  });
});
