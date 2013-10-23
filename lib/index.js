/**
 * Module dependencies.
 */
var fs = require('fs');
var execSync = require('exec-sync');
//var util = require('util');


var RecursiveContentInclude = {

  /**
   * Read a file.
   *
   * @param {String} The filepath.
   * @param {Object}
   *   beginTag String
   *   endTag String
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
   * Parse the file and return an array.
   *
   * @param {String} The content.
   * @param {String} The begin tag.
   * @param {String} The end tag
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
          if (this.isUrl(contentArray[0])) {
            obj.push( {type: 'url', content: contentArray[0]} );
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
   * process
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
      else if (lexed[0].type === 'url') {
        var data = execSync('curl -s '+lexed[0].content);
        tmp = this.process(data, beginTag, endTag);
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
        else if (lexed[i].type === 'url') {
          var curlData = execSync('curl -s '+lexed[i].content);
          tmp += this.process(curlData, beginTag, endTag);
        }
      }
    }

    return tmp;
  },

  /**
   * Check if the tag is a http or https url.
   *
   * @param {String} str The tag content.
   * @return true or false.
   */
  isUrl: function(str) {
    //console.log('isUrl: '+str);
    var isHttp = str.indexOf('http://');
    var isHttps = str.indexOf('https://');
    if (isHttp === 0 || isHttps === 0) {
      return true;
    }
    else {
      return false;
    }
  }

};

module.exports = RecursiveContentInclude;
