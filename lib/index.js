/**
 * Module dependencies.
 */
var fs = require('fs');
var execSync = require('exec-sync');
//var util = require('util');


var resi = {

  /**
   * Read a file and run the include process.
   *
   * @param {String} path The filepath.
   * @param {Object} [options] beginTag String, default: `<%>`, endTag String, default: `</%>`
   * @returns {String} The processed content.
   */
  readFileSync: function(path, options) {
    var beginTag = '<%>';
    var endTag = '</%>';
    if (options !== undefined) {
      if (options.beginTag !== undefined) beginTag = options.beginTag;
      if (options.endTag !== undefined) endTag = options.endTag;
    }

    var data = fs.readFileSync(path, 'utf8');
    var result = this.process(data, beginTag, endTag);
    return result;
  },

  /**
   * Parse the file and return a tokens array.
   *
   * @param {String} content The content we want to parse.
   * @param {String} beginTag The begin tag.
   * @param {String} endTag The end tag.
   * @returns {Array} The tokens.
   */
  lexer: function(content, beginTag, endTag) {
    // The object we want to return later...
    var obj = [];
    
    // Split the string
    var contentBeginTagArray = content.split(beginTag);

    // If only one element exist, there is no tag at this content.
    if (contentBeginTagArray.length === 1) {
      obj.push( {type: 'text', content: contentBeginTagArray[0]} );
    }
    // if more than one elements exist, min. one tag is at the content.
    else {
      for (var i=0; i<contentBeginTagArray.length; i++) {
        var contentArray = contentBeginTagArray[i].split(endTag);
        
        // if the content array object contains text...
        if (contentArray.length === 1) {
          if (contentArray[0] !== '') obj.push( {type: 'text', content: contentArray[0]} );
        }
        // if there is a tag...
        else {
          // check if it is an url, set the type to "url".
          if (this.isHttp(contentArray[0])) {
            obj.push( {type: 'weburl', content: contentArray[0]} );
          }
          // check if it is a script, set the type to "script".
          else if (this.isScript(contentArray[0])) {
            var scriptContent = contentArray[0].split('script: ');
            obj.push( {type: 'script', content: scriptContent[1]} );
          }
          // set the type to "file".
          else {
            obj.push( {type: 'file', content: contentArray[0]} );
          }
          if (contentArray[1] !== '') obj.push( {type: 'text', content: contentArray[1]} );
        }
      }
    }
    return obj;
  },

  /**
   * Process the content string and return the result.
   *
   * @param {String} content The content we want to parse.
   * @param {String} beginTag The begin tag.
   * @param {String} endTag The end tag
   * @returns {String} The processed content.
   */
  process: function(content, beginTag, endTag) {
    var lexed = this.lexer(content, beginTag, endTag);
    // console.log('\nLEXER --------------------------');
    // console.log(util.inspect(lexed, false, null));
    // console.log('--------------------------------');

    var tmp = '';

    // if the lexer array contains only one object, check the type.
    // If the type is "file" or "url", load/request the file we want to include.
    if (lexed.length === 1) {
      if (lexed[0].type === 'text') {
        tmp = lexed[0].content;
      }
      else if (lexed[0].type === 'file') {
        tmp = this.readFileSync(lexed[0].content, {beginTag: beginTag, endTag: endTag});
      }
      else if (lexed[0].type === 'weburl') {
        var data = execSync('curl -s '+lexed[0].content);
        tmp = this.process(data, beginTag, endTag);
      }
      else if (lexed[0].type === 'script') {
        tmp = execSync(lexed[0].content);
      }
    }
    // If there are more than one object...
    else {
      for (var i=0; i<lexed.length; i++) {
        if (lexed[i].type === 'text') {
          tmp += lexed[i].content;
        }
        else if (lexed[i].type === 'file') {
          tmp += this.readFileSync(lexed[i].content, {beginTag: beginTag, endTag: endTag});
        }
        else if (lexed[i].type === 'weburl') {
          var curlData = execSync('curl -s '+lexed[i].content);
          tmp += this.process(curlData, beginTag, endTag);
        }
        else if (lexed[i].type === 'script') {
          tmp += execSync(lexed[i].content);
        }
      }
    }

    return tmp;
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
  }

};

module.exports = resi;
