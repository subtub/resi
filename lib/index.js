/**
 * Module dependencies.
 */
var fs = require('fs');
var execSync = require('exec-sync');
var CONSTANTS = require('./constants');
var lexer = require('./lexer');

/**
 * The constructor.
 *
 * @param {String} openTag The begin tag.
 * @param {String} closeTag The end tag.
 */
function Resi(openTag, closeTag) {
  this.openTag = openTag;
  this.closeTag = closeTag;
  this.lexer = lexer;
}

module.exports = exports = Resi;

/**
 * Read a file and compile it.
 *
 * @param {String} path The filepath.
 * @returns {String} The compiled result.
 */
Resi.prototype.readFileSync = function(path) {
  var data = fs.readFileSync(path, 'utf8');
  var result = this.compile(data);
  return result;
};

/**
 * Assembly the content.
 *
 * @param {Array} tokens The tokens array.
 * @returns {String} The assembled content.
 */
Resi.prototype.assembly = function(tokens) {
  var tmp = '';

  // if the lexer array contains only one object, check the type.
  // If the type is "file" or "url", load/request the file we want to include.
  if (tokens.length === 1) {
    if (tokens[0].type === CONSTANTS.TOKEN_TYPE.TEXT) {
      tmp = tokens[0].content;
    }
    else if (tokens[0].type === CONSTANTS.TOKEN_TYPE.FILE) {
      tmp = this.readFileSync(tokens[0].content, this.openTag, this.closeTag);
    }
    else if (tokens[0].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
      var data = execSync('curl -s '+tokens[0].content);
      tmp = this.compile(data, this.openTag, this.closeTag);
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
        tmp += this.readFileSync(tokens[i].content, this.openTag, this.closeTag);
      }
      else if (tokens[i].type === CONSTANTS.TOKEN_TYPE.WEBURL) {
        var curlData = execSync('curl -s '+tokens[i].content);
        tmp += this.compile(curlData, this.openTag, this.closeTag);
      }
      else if (tokens[i].type === CONSTANTS.TOKEN_TYPE.SCRIPT) {
        tmp += execSync(tokens[i].content);
      }
    }
  }

  return tmp;
};

/**
 * Complie the content string and return the result.
 *
 * @param {String} content The content we want to parse.
 * @returns {String} The compiled result.
 */
Resi.prototype.compile = function(content) {
  var tokens = lexer.tokenize(content, this.openTag, this.closeTag);
  var assembled = this.assembly(tokens);
  return assembled;
};
