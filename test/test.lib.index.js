var assert = require('assert');
var rci = require('../lib');


describe('lib/index.js', function() {

  describe('#readFile()', function() {
    it('test with no-include.txt', function() {
      var data = rci.readFileSync('./test/files/no-include.txt', '<%>', '</%>');
      var expected = 'no include at this file\n';
      assert.equal(expected, data);
    });
  });
  
  describe('#lexer()', function() {
    it('lex "hello world".', function() {
      var result = rci.lexer('hello world','<%>', '</%>');
      var expected = [
        { content: 'hello world' }
      ];
      assert.deepEqual(expected, result);
    });
    it('lex "hello world <%>path/to/file.txt</%>".', function() {
      var result = rci.lexer('hello world <%>path/to/file.txt</%>','<%>', '</%>');
      var expected = [
        { content: 'hello world ' },
        { file: 'path/to/file.txt' },
      ];
      assert.deepEqual(expected, result);
    });
    it('lex "hello world <%>http://link.to.url</%>".', function() {
      var result = rci.lexer('hello world <%>http://link.to.url</%>','<%>', '</%>');
      var expected = [
        { content: 'hello world ' },
        { url: 'http://link.to.url' },
      ];
      assert.deepEqual(expected, result);
    });
  });

  describe('#include()', function() {
    it('should return the content without include other files.', function() {
      var data = rci.include('hello world', '<%>', '</%>');
      assert.equal('hello world', data);
    });
    it('should return the content with a file content include.', function() {
      var data = rci.include('hello world <%>test/files/no-include.txt</%>', '<%>', '</%>');
      assert.equal('hello world no include at this file\n', data);
    });
    // it('should return the content with an url content include.', function() {
    //   var data = rci.include('hello world <%>https://raw.github.com/WrongEntertainment/RecursiveContentInclude/master/test/files/no-include.txt</%>', '<%>', '</%>');
    //   assert.equal('hello world no include at this file\n', data);
    // });
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
