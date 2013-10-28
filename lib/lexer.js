/**
 * The different token types.
 */
var TEXT = 'text';
var FILE = 'file';
var WEBURL = 'weburl';
var SCRIPT = 'script';

/**
 * The Lexer
 */
module.exports = Lexer = {

  /**
   * Parse the file and return a tokens array.
   *
   * @param {String} content The content we want to parse.
   * @param {String} openTag The begin tag.
   * @param {String} closeTag The end tag.
   * @returns {Array} The tokens.
   */
  tokenize: function(content, openTag, closeTag) {
    // The object we want to return later...
    var tokens = [];
    
    // Split the string
    var contentOpenTagArray = content.split(openTag);

    // If only one element exist, there is no tag at this content.
    if (contentOpenTagArray.length === 1) {
      //tokens.push( {type: 'text', content: contentOpenTagArray[0]} );
      tokens.push( this.tokenObject(TEXT, contentOpenTagArray[0]) );
    }
    // if more than one elements exist, min. one tag is at the content.
    else {
      for (var i=0; i<contentOpenTagArray.length; i++) {
        var contentArray = contentOpenTagArray[i].split(closeTag);
        
        // if the content array object contains text...
        if (contentArray.length === 1) {
          if (contentArray[0] !== '') tokens.push( this.tokenObject(TEXT, contentArray[0]) );
        }
        // if there is a tag...
        else {
          // check if it is an url, set the type to "url".
          if (this.isHttp(contentArray[0])) {
            tokens.push( this.tokenObject(WEBURL, contentArray[0]) );
          }
          // check if it is a script, set the type to "script".
          else if (this.isScript(contentArray[0])) {
            var scriptContent = contentArray[0].split('script: ');
            tokens.push( this.tokenObject(SCRIPT, scriptContent[1]) );
          }
          // set the type to "file".
          else {
            tokens.push( this.tokenObject(FILE, contentArray[0]) );
          }
          if (contentArray[1] !== '') tokens.push( this.tokenObject(TEXT, contentArray[1]) );
        }
      }
    }
    return tokens;
  },

  /**
   * Check if the tag is a http or https url.
   *
   * @param {String} str The tag content.
   * @returns {Boolean} true or false.
   */
  isHttp: function(str) {
    //console.log('isHttp: '+str);
    var isHttp = str.indexOf('http://');
    var isHttps = str.indexOf('https://');
    if (isHttp === 0 || isHttps === 0) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * Check if the tag is a script.
   * The script tag begin with "script: ".
   *
   * @param {String} str The script content.
   * @returns {Boolean} true or false.
   */
  isScript: function(str) {
    //console.log('isScript: '+str);
    var script = str.indexOf('script: ');
    if (script === 0) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * Model of a token item.
   * {type: 'the-type', content: 'the-content'}
   *
   * @returns {Object}
   */
  tokenObject: function(type, content) {
    return {type: type, content: content};
  }

};
