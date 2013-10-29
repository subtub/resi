/**
 * Module dependencies.
 */
var CONSTANTS = require('./constants');
var utils = require('./utils');

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
    var tokens = new Tokens();
    
    // Split the string
    var contentOpenTagArray = content.split(openTag);

    // If only one element exist, there is no tag at this content.
    if (contentOpenTagArray.length === 1) {
      tokens.addText(contentOpenTagArray[0]);
    }
    // if more than one elements exist, min. one tag is at the content.
    else {
      for (var i=0; i<contentOpenTagArray.length; i++) {
        var contentArray = contentOpenTagArray[i].split(closeTag);
        
        // if the content array object contains text...
        if (contentArray.length === 1) {
          if (contentArray[0] !== '') tokens.addText(contentArray[0]);
        }
        // if there is a tag...
        else {

          // check if it is an url, set the type to "url".
          if (this.isHttp(contentArray[0])) {
            var noLB = utils.killLinebreaks(contentArray[0]);
            var noWS = utils.killWhitespace(noLB);
            tokens.addWeburl(noWS);
          }
          // check if it is a script, set the type to "script".
          else if (this.isScript(contentArray[0])) {
            var scriptContent = contentArray[0].split('script: ');
            tokens.addScript(scriptContent[1]);
          }
          // set the type to "file".
          else {
            tokens.addFile(contentArray[0]);
          }
          if (contentArray[1] !== '') tokens.addText(contentArray[1]);
        }
      }
    }
    return tokens.storage;
  },

  /**
   * semanticParsing
   */
  semanticParsing: function(tokens) {
    console.log(tokens);
  },

  /**
   * Check if the tag is a http or https url.
   *
   * @param {String} str The tag content.
   * @returns {Boolean} true or false.
   */
  isHttp: function(str) {
    var isHttp = str.indexOf('http://');
    var isHttps = str.indexOf('https://');
    return (isHttp !== -1 || isHttps !== -1) ? true : false;
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
    return (script === 0) ? true : false;
  }

};


/**
 * The tokens Oject.
 */
function Tokens() {
  // The Aray to store the token objects.
  this.storage = [];
}

/**
 * Add a token item.
 * {type: 'the-type', content: 'the-content'}
 *
 * @returns {Object}
 */
Tokens.prototype.add = function(type, content) {
  var obj = {type: type, content: content};
  this.storage.push(obj);
  return obj;
};

Tokens.prototype.addText = function(text) {
  this.add(CONSTANTS.TOKEN_TYPE.TEXT, text);
};

Tokens.prototype.addFile = function(file) {
  this.add(CONSTANTS.TOKEN_TYPE.FILE, file);
};

Tokens.prototype.addWeburl = function(weburl) {
  this.add(CONSTANTS.TOKEN_TYPE.WEBURL, weburl);
};

Tokens.prototype.addScript = function(script) {
  this.add(CONSTANTS.TOKEN_TYPE.SCRIPT, script);
};
