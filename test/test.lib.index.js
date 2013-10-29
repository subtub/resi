var assert = require('assert');
var Resi = require('../lib');
var resi = new Resi('<%>', '</%>');


describe('lib/index.js', function() {

  describe('#readFileSync()', function() {
    it('test with "no-include.txt"', function() {
      var data = resi.readFileSync('./test/files/no-include.txt');
      var expected = 'no include at this file.';
      assert.equal(data, expected);
    });

    it('test with "include-file.txt"', function() {
      var data = resi.readFileSync('./test/files/include-file.txt');
      var expected = 'hello world\n\nno include at this file.\n';
      assert.equal(data, expected);
    });

    it('test with "include-files.txt"', function() {
      var data = resi.readFileSync('./test/files/include-files.txt');
      var expected = 'hello world\n\nno include at this file.\nno include at this file.\n';
      assert.equal(data, expected);
    });

    it('test with "include-url.txt"', function() {
      var data = resi.readFileSync('./test/files/include-url.txt');
      var expected = 'hello world\n\nno include at this file.\n';
      assert.equal(data, expected);
    });

    it('test with "include-script.txt"', function() {
      var data = resi.readFileSync('./test/files/include-script.txt');
      var expected = 'hello world\n\nhello resi\n';
      assert.equal(data, expected);
    });
  });
  
  describe('#assembly()', function() {
    it('content: "hello world"', function() {
      var tokens = [
        {type:'text', content:'hello world'}
      ];
      var result = resi.assembly(tokens);
      var expected = 'hello world';
      assert.deepEqual(result, expected);
    });
  });

  describe('#compile()', function() {
    it('content: "hello world"', function() {
      var result = resi.compile('hello world');
      var expected = 'hello world';
      assert.deepEqual(result, expected);
    });

    it('content: "<%>test/files/no-include.txt</%>"', function() {
      var result = resi.compile('<%>test/files/no-include.txt</%>');
      var expected = 'no include at this file.';
      assert.deepEqual(result, expected);
    });

    it('content: "<%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%>"', function() {
      var result = resi.compile('<%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>');
      var expected = 'no include at this file.';
      assert.deepEqual(result, expected);
    });

    it('content: "<%>script: cat test/files/no-include.txt</%>"', function() {
      var result = resi.compile('<%>script: cat test/files/no-include.txt</%>');
      var expected = 'no include at this file.';
      assert.deepEqual(result, expected);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%>"', function() {
      var result = resi.compile('hello world, <%>test/files/no-include.txt</%>');
      var expected = 'hello world, no include at this file.';
      assert.deepEqual(result, expected);
    });

    it('content: "hello world, <%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>"', function() {
      var result = resi.compile('hello world, <%>https://raw.github.com/subtub/resi/master/test/files/no-include.txt</%></%>');
      var expected = 'hello world, no include at this file.';
      assert.deepEqual(result, expected);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%> more text..."', function() {
      var result = resi.compile('hello world, <%>test/files/no-include.txt</%> more text...');
      var expected = 'hello world, no include at this file. more text...';
      assert.deepEqual(result, expected);
    });
  });

});
