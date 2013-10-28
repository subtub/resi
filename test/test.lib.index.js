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
      var expected = [ {type:'weburl', content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('lex "<%>script: whoami</%>".', function() {
      var result = rci.lexer('<%>script: whoami</%>','<%>', '</%>');
      var expected = [ {type:'script', content:'whoami'} ];
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
                       {type:'weburl',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });
    
    it('lex "hello world <%>http://link.to.url</%> more text here...".', function() {
      var result = rci.lexer('hello world <%>http://link.to.url</%> more text here...','<%>', '</%>');
      var expected = [ {type:'text', content: 'hello world '},
                       {type:'weburl',  content: 'http://link.to.url'},
                       {type:'text', content:' more text here...'} ];
      assert.deepEqual(expected, result);
    });
    
    it('lex "<%>path/to/file.txt</%> <%>http://link.to.url</%>".', function() {
      var result = rci.lexer('<%>path/to/file.txt</%> <%>http://link.to.url</%>','<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'},
                       {type:'text', content: ' '},
                       {type:'weburl',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('lex "<%>path/to/file.txt</%> <%>http://link.to.url</%> <%>script: whoami</%>".', function() {
      var result = rci.lexer('<%>path/to/file.txt</%> <%>http://link.to.url</%> <%>script: whoami</%>','<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'},
                       {type:'text', content: ' '},
                       {type:'weburl',  content:'http://link.to.url'},
                       {type:'text', content: ' '},
                       {type:'script',  content:'whoami'} ];
      assert.deepEqual(expected, result);
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

  describe('#isHttp()', function() {
    it('should return true if it is a http url.', function() {
      assert.equal(true, rci.isHttp('http://www.subtub.io/'));
    });
    it('should return true if it is a https url.', function() {
      assert.equal(true, rci.isHttp('https://www.subtub.io/'));
    });
    it('should return false if it is not a url.', function() {
      assert.equal(false, rci.isHttp('foo/bar'));
    });
  });

  describe('#isScript()', function() {
    it('should return true if the parameter begin with "sh ".', function() {
      var result = rci.isScript('script: whoami');
      assert.equal(true, result);
    });
    it('should return false if it is no script.', function() {
      var result = rci.isScript('path/to/file.txt');
      assert.equal(false, result);
    });
  });

});
