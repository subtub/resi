/**
 * Module dependencies.
 */
var fs = require('fs');
var execSync = require('exec-sync');
var CONSTANTS = require('./constants');
var lexer = require('./lexer');

module.exports = Resi = {

  lexer: lexer,

  /**
   * Read a file and compile it.
   *
   * @param {String} path The filepath.
   * @param {String} openTag The begin tag.
   * @param {String} closeTag The end tag.
   * @returns {String} The compiled result.
   */
  readFileSync: function(path, openTag, closeTag) {
    var data = fs.readFileSync(path, 'utf8');
    var result = this.compile(data, openTag, closeTag);
    return result;
  },

  /**
   * assembly
   */
  assembly: function(tokens, openTag, closeTag) {
    var tmp = '';

    // if the lexer array contains only one object, check the type.
    // If the type is "file" or "url", load/request the file we want to include.
    if (tokens.length === 1) {
      if (tokens[0].type === CONSTANTS.TOKEN_TYPE.TEXT) {
        tmp = tokens[0].content;
      }
      else if (tokens[0].type === CONSTANTS.TOKEN_TYPE.FILE) {
        tmp = this.readFileSync(tokens[0].content, openTag, closeTag);
      }
      else if (tokens[0].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
        var data = execSync('curl -s '+tokens[0].content);
        tmp = this.compile(data, openTag, closeTag);
      }
      else if (tokens[0].type === CONSTANTS.TOKEN_TYPE.SCRIPT) {
        tmp = execSync(tokens[0].content);
      }
    }
    // If there are more than one object...
    else {
      for (var i=0; i<tokens.length; i++) {
        if (tokens[i].type === CONSTANTS.TOKEN_TYPE.TEXT) {
          tmp += tokens[i].content;
        }
        else if (tokens[i].type === CONSTANTS.TOKEN_TYPE.FILE) {
          tmp += this.readFileSync(tokens[i].content, openTag, closeTag);
        }
        else if (tokens[i].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
          var curlData = execSync('curl -s '+tokens[i].content);
          tmp += this.compile(curlData, openTag, closeTag);
        }
        else if (tokens[i].type === CONSTANTS.TOKEN_TYPE.SCRIPT) {
          tmp += execSync(tokens[i].content);
        }
      }
    }

    return tmp;
  },

  /**
   * Complie the content string and return the result.
   *
   * @param {String} content The content we want to parse.
   * @param {String} openTag The begin tag.
   * @param {String} closeTag The end tag
   * @returns {String} The compiled result.
   */
  compile: function(content, openTag, closeTag) {
    var tokens = lexer.tokenize(content, openTag, closeTag);
    var assembled = this.assembly(tokens, openTag, closeTag);
    return assembled;
  }

};
