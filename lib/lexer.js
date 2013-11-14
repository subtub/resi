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
            var scriptContent = contentArray[0].split(CONSTANTS.SYNTAX.SCRIPT);
            tokens.addScript(scriptContent[1]);
          }
          else if (this.isComment(contentArray[0])) {
            var commentContent = contentArray[0].split(CONSTANTS.SYNTAX.COMMENT);
            tokens.addComment(commentContent[1]);
          }
          else if (this.isLog(contentArray[0])) {
            var logContent = contentArray[0].split(CONSTANTS.SYNTAX.LOG);
            tokens.addLog(logContent[1]);
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
   * Check the tag content syntax.
   * This is a small helper for the isScript, isComment etc. functions.
   * 
   * @param  {String} str The tag content
   * @param  {CONSTANTS.SYNTAX} syntax The syntax type.
   * @return {Boolean} true if the str is the valid syntax.
   */
  isSyntax: function(str, syntax) {
    var tmp = str.indexOf(syntax);
    return (tmp === 0) ? true : false;
  },

  /**
   * Check if the tag is a script.
   *
   * @param {String} str The script content.
   * @returns {Boolean} true or false.
   */
  isScript: function(str) {
    return this.isSyntax(str, CONSTANTS.SYNTAX.SCRIPT);
  },

  /**
   * Check if the tag is a comment.
   * 
   * @param  {String} str The comment.
   * @return {Boolean} true or false.
   */
  isComment: function(str) {
    return this.isSyntax(str, CONSTANTS.SYNTAX.COMMENT);
  },

  /**
   * Check if the tag is a log message.
   * 
   * @param  {String} str The log message.
   * @return {Boolean} true or false.
   */
  isLog: function(str) {
    return this.isSyntax(str, CONSTANTS.SYNTAX.LOG);
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
 * Add a token item (used by the addText, addFile etc. functions).
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

Tokens.prototype.addComment = function(comment) {
  this.add(CONSTANTS.TOKEN_TYPE.COMMENT, comment);
};

Tokens.prototype.addLog = function(log) {
  this.add(CONSTANTS.TOKEN_TYPE.LOG, log);
};
