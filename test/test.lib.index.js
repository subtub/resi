var assert = require('assert');
var rci = require('../lib');


describe('lib/index.js', function() {

  describe('#readFileSync()', function() {
    it('test with no-include.txt', function() {
      var data = rci.readFileSync('./test/files/no-include.txt');
      var expected = 'no include at this file.';
      assert.equal(expected, data);
    });

    it('test with include-file.txt', function() {
      var data = rci.readFileSync('./test/files/include-file.txt');
      var expected = 'hello world\n\nno include at this file.\n';
      assert.equal(expected, data);
    });

    it('test with include-files.txt', function() {
      var data = rci.readFileSync('./test/files/include-files.txt');
      var expected = 'hello world\n\nno include at this file.\nno include at this file.\n';
      assert.equal(expected, data);
    });
  });
  
  describe('#lexer()', function() {
    it('lex "hello world".', function() {
      var result = rci.lexer('hello world','<%>', '</%>');
      var expected = [ {type:'text', content:'hello world'} ];
      assert.deepEqual(expected, result);
    });
    
    it('lex "<%>path/to/file.txt</%>".', function() {
      var result = rci.lexer('<%>path/to/file.txt</%>','<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'} ];
      assert.deepEqual(expected, result);
    });

    it('lex "<%>http://link.to.url</%>".', function() {
      var result = rci.lexer('<%>http://link.to.url</%>','<%>', '</%>');
      var expected = [ {type:'url', content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('lex "hello world <%>path/to/file.txt</%>".', function() {
      var result = rci.lexer('hello world <%>path/to/file.txt</%>','<%>', '</%>');
      var expected = [ {type:'text', content:'hello world '},
                       {type:'file', content:'path/to/file.txt'} ];
      assert.deepEqual(expected, result);
    });

    it('lex "hello world <%>http://link.to.url</%>".', function() {
      var result = rci.lexer('hello world <%>http://link.to.url</%>','<%>', '</%>');
      var expected = [ {type:'text', content:'hello world '},
                       {type:'url',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });
    
    it('lex "hello world <%>http://link.to.url</%> more text here...".', function() {
      var result = rci.lexer('hello world <%>http://link.to.url</%> more text here...','<%>', '</%>');
      var expected = [ {type:'text', content: 'hello world '},
                       {type:'url',  content: 'http://link.to.url'},
                       {type:'text', content:' more text here...'} ];
      assert.deepEqual(expected, result);
    });
    
    it('lex "<%>path/to/file.txt</%> <%>http://link.to.url</%>".', function() {
      var result = rci.lexer('<%>path/to/file.txt</%> <%>http://link.to.url</%>','<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'},
                       {type:'text', content: ' '},
                       {type:'url',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });
  });

  describe('#process()', function() {
    it('content: "hello world"', function() {
      var expected = 'hello world';
      var result = rci.process('hello world', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "<%>test/files/no-include.txt</%>"', function() {
      var expected = 'no include at this file.';
      var result = rci.process('<%>test/files/no-include.txt</%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "<%>https://raw.github.com/WrongEntertainment/RecursiveContentInclude/master/test/files/no-include.txt</%>"', function() {
      var expected = 'no include at this file';
      var result = rci.process('<%>https://raw.github.com/WrongEntertainment/RecursiveContentInclude/master/test/files/no-include.txt</%></%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%>"', function() {
      var expected = 'hello world, no include at this file.';
      var result = rci.process('hello world, <%>test/files/no-include.txt</%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>https://raw.github.com/WrongEntertainment/RecursiveContentInclude/master/test/files/no-include.txt</%></%>"', function() {
      var expected = 'hello world, no include at this file';
      var result = rci.process('hello world, <%>https://raw.github.com/WrongEntertainment/RecursiveContentInclude/master/test/files/no-include.txt</%></%>', '<%>', '</%>');
      assert.deepEqual(expected, result);
    });

    it('content: "hello world, <%>test/files/no-include.txt</%> more text..."', function() {
      var expected = 'hello world, no include at this file. more text...';
      var result = rci.process('hello world, <%>test/files/no-include.txt</%> more text...', '<%>', '</%>');
      assert.deepEqual(expected, result);
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
