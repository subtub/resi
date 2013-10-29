var assert = require('assert');
var lexer = require('../lib/lexer');


describe('lib/lexer.js', function() {
  
  describe('#tokenize()', function() {
    it('tokenize "hello world".', function() {
      var result = lexer.tokenize('hello world', '<%>', '</%>');
      var expected = [ {type:'text', content:'hello world'} ];
      assert.deepEqual(expected, result);
    });
    
    it('tokenize "<%>path/to/file.txt</%>".', function() {
      var result = lexer.tokenize('<%>path/to/file.txt</%>', '<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "<%>http://link.to.url</%>".', function() {
      var result = lexer.tokenize('<%>http://link.to.url</%>', '<%>', '</%>');
      var expected = [ {type:'weburl', content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "<%>script: whoami</%>".', function() {
      var result = lexer.tokenize('<%>script: whoami</%>', '<%>', '</%>');
      var expected = [ {type:'script', content:'whoami'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "hello world <%>path/to/file.txt</%>".', function() {
      var result = lexer.tokenize('hello world <%>path/to/file.txt</%>', '<%>', '</%>');
      var expected = [ {type:'text', content:'hello world '},
                       {type:'file', content:'path/to/file.txt'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "hello world <%>http://link.to.url</%>".', function() {
      var result = lexer.tokenize('hello world <%>http://link.to.url</%>', '<%>', '</%>');
      var expected = [ {type:'text', content:'hello world '},
                       {type:'weburl',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "hello world <%>script: whoami</%>".', function() {
      var result = lexer.tokenize('hello world <%>script: whoami</%>', '<%>', '</%>');
      var expected = [ {type:'text', content:'hello world '},
                       {type:'script',  content:'whoami'} ];
      assert.deepEqual(expected, result);
    });
    
    it('tokenize "hello world <%>http://link.to.url</%> more text here...".', function() {
      var result = lexer.tokenize('hello world <%>http://link.to.url</%> more text here...', '<%>', '</%>');
      var expected = [ {type:'text', content: 'hello world '},
                       {type:'weburl',  content: 'http://link.to.url'},
                       {type:'text', content:' more text here...'} ];
      assert.deepEqual(expected, result);
    });
    
    it('tokenize "<%>path/to/file.txt</%> <%>http://link.to.url</%>".', function() {
      var result = lexer.tokenize('<%>path/to/file.txt</%> <%>http://link.to.url</%>', '<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'},
                       {type:'text', content: ' '},
                       {type:'weburl',  content:'http://link.to.url'} ];
      assert.deepEqual(expected, result);
    });

    it('tokenize "<%>path/to/file.txt</%> <%>http://link.to.url</%> <%>script: whoami</%>".', function() {
      var result = lexer.tokenize('<%>path/to/file.txt</%> <%>http://link.to.url</%> <%>script: whoami</%>', '<%>', '</%>');
      var expected = [ {type:'file', content:'path/to/file.txt'},
                       {type:'text', content: ' '},
                       {type:'weburl',  content:'http://link.to.url'},
                       {type:'text', content: ' '},
                       {type:'script',  content:'whoami'} ];
      assert.deepEqual(expected, result);
    });
  });
  
  // describe('#semanticParsing()', function() {
  //   it('shoult...', function() {
  //     var tokens = [
  //     {type:'text', content:'hello world'}
  //     ];

  //     var result = lexer.semanticParsing(tokens);
  //     var expected = 'hello world';
  //     //assert.deepEqual(expected, result);
  //   });
  // });

  describe('#isHttp()', function() {
    describe('should return true if input string is a http url.', function() {
      it('without whitespace.', function() {
        assert.equal(true, lexer.isHttp('http://www.subtub.io/'));
      });
      it('whitespace at the beginning.', function() {
        assert.equal(true, lexer.isHttp('     http://www.subtub.io/'));
      });
      it('whitespace at the end.', function() {
        assert.equal(true, lexer.isHttp('http://www.subtub.io/    '));
      });
      it('whitespace at the beginning and end.', function() {
        assert.equal(true, lexer.isHttp('         http://www.subtub.io/       '));
      });
    });

    describe('should return true if input string is a https url.', function() {
      it('without whitespace.', function() {
        assert.equal(true, lexer.isHttp('https://www.subtub.io/'));
      });
      it('whitespace at the beginning.', function() {
        assert.equal(true, lexer.isHttp('  https://www.subtub.io/'));
      });
      it('whitespace at the end.', function() {
        assert.equal(true, lexer.isHttp('https://www.subtub.io/           '));
      });
      it('whitespace at the beginning and end.', function() {
        assert.equal(true, lexer.isHttp('          https://www.subtub.io/  '));
      });
    });
    
    describe('should return false if input string is not a http(s) url.', function() {
      it('without whitespace.', function() {
        assert.equal(false, lexer.isHttp('foo/bar'));
      });
      it('whitespace at the beginning.', function() {
        assert.equal(false, lexer.isHttp('                foo/bar'));
      });
      it('whitespace at the end.', function() {
        assert.equal(false, lexer.isHttp('foo/bar            '));
      });
      it('whitespace at the beginning and end.', function() {
        assert.equal(false, lexer.isHttp(' foo/bar                        '));
      });
    });
  });

  describe('#isScript()', function() {
    it('should return true if the parameter begin with "script: ".', function() {
      var result = lexer.isScript('script: whoami');
      assert.equal(true, result);
    });
    
    it('should return false if input string is not a script.', function() {
      var result = lexer.isScript('path/to/file.txt');
      assert.equal(false, result);
    });
  });

  // describe('#Tokens()', function() {
  //   it('should return false if it is no script.', function() {
  //     var tokens = new Tokens();
  //     tokens.addText('hello world');
  //     tokens.addFile('path/to/file');
  //     tokens.addWeburl('http://subtool.io');
  //     tokens.addScript('whoami');
  //     var expected = [ {type:'text', content:'hello world'},
  //                      {type:'file', content:'path/to/file'},
  //                      {type:'weburl', content:'http://subtub.io'},
  //                      {type:'script', content:'whoami'} ];
  //     assert.deepEqual(expected, result);
  //   });
  // });

});
