var assert = require('assert');
var rci = require('../lib');


describe('lib/index.js', function() {

  describe('#readFileSync()', function() {
    it('test with "no-include.txt"', function() {
      var data = rci.readFileSync('./test/files/no-include.txt', '<%>', '</%>');
      var expected = 'no include at this file.';
      assert.equal(expected, data);
    });

    it('test with "include-file.txt"', function() {
      var data = rci.readFileSync('./test/files/include-file.txt', '<%>', '</%>');
      var expected = 'hello world\n\nno include at this file.\n';
      assert.equal(expected, data);
    });

    it('test with "include-files.txt"', function() {
      var data = rci.readFileSync('./test/files/include-files.txt', '<%>', '</%>');
      var expected = 'hello world\n\nno include at this file.\nno include at this file.\n';
      assert.equal(expected, data);
    });

    it('test with "include-url.txt"', function() {
      var data = rci.readFileSync('./test/files/include-url.txt', '<%>', '</%>');
      var expected = 'hello world\n\nno include at this file.\n';
      assert.equal(expected, data);
    });

    it('test with "include-script.txt"', function() {
      var data = rci.readFileSync('./test/files/include-script.txt', '<%>', '</%>');
      var expected = 'hello world\n\nhello resi\n';
      assert.equal(expected, data);
    });
  });

  describe('#compile()', function() {
    it('content: "hello world"', function() {
      var expected = 'hello world';
      var result = rci.compile('hello world', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "<%>test/files/no-include.txt</%>"', function() {
      var expected = 'no include at this file.';
      var result = rci.compile('<%>test/files/no-include.txt</%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "<%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%>"', function() {
      var expected = 'no include at this file.';
      var result = rci.compile('<%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "<%>script: cat test/files/no-include.txt</%>"', function() {
      var expected = 'no include at this file.';
      var result = rci.compile('<%>script: cat test/files/no-include.txt</%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%>"', function() {
      var expected = 'hello world, no include at this file.';
      var result = rci.compile('hello world, <%>test/files/no-include.txt</%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>"', function() {
      var expected = 'hello world, no include at this file.';
      var result = rci.compile('hello world, <%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%> more text..."', function() {
      var expected = 'hello world, no include at this file. more text...';
      var result = rci.compile('hello world, <%>test/files/no-include.txt</%> more text...', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });
  });

});
