/**
 * Module dependencies.
 */
var fs = require('fs');
var execSync = require('exec-sync');
var CONSTANTS = require('./constants');
var lexer = require('./lexer');
//var util = require('util');


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
  assembly: function() {
    console.log('TODO');
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
    var lexed = lexer.tokenize(content, openTag, closeTag);
    // console.log('\nLEXER --------------------------');
    // console.log(util.inspect(lexed, false, null));
    // console.log('--------------------------------');

    var tmp = '';

    // if the lexer array contains only one object, check the type.
    // If the type is "file" or "url", load/request the file we want to include.
    if (lexed.length === 1) {
      if (lexed[0].type === CONSTANTS.TOKEN_TYPE.TEXT) {
        tmp = lexed[0].content;
      }
      else if (lexed[0].type === CONSTANTS.TOKEN_TYPE.FILE) {
        tmp = this.readFileSync(lexed[0].content, openTag, closeTag);
      }
      else if (lexed[0].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
        var data = execSync('curl -s '+lexed[0].content);
        tmp = this.compile(data, openTag, closeTag);
      }
      else if (lexed[0].type === CONSTANTS.TOKEN_TYPE.SCRIPT) {
        tmp = execSync(lexed[0].content);
      }
    }
    // If there are more than one object...
    else {
      for (var i=0; i<lexed.length; i++) {
        if (lexed[i].type === CONSTANTS.TOKEN_TYPE.TEXT) {
          tmp += lexed[i].content;
        }
        else if (lexed[i].type === CONSTANTS.TOKEN_TYPE.FILE) {
          tmp += this.readFileSync(lexed[i].content, openTag, closeTag);
        }
        else if (lexed[i].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
          var curlData = execSync('curl -s '+lexed[i].content);
          tmp += this.compile(curlData, openTag, closeTag);
        }
        else if (lexed[i].type === CONSTANTS.TOKEN_TYPE.SCRIPT) {
          tmp += execSync(lexed[i].content);
        }
      }
    }

    return tmp;
  }

};
