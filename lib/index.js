/**
 * Module dependencies.
 */
var fs = require('fs');


var RecursiveContentInclude = {
  /**
   *
   */
  readFileSync: function(file, beginTag, endTag) {
    var data = fs.readFileSync(file, 'utf8');
    return this.include(data, beginTag, endTag);
  },

  /**
   * Parse the file and return an array.
   */
  lexer: function(content, beginTag, endTag) {
    // console.log('CONTENT: '+content);
    // console.log('BEGIN TAG: '+beginTag);
    // console.log('END TAG:   '+endTag);

    // The object we want to return later...
    var obj = [];
    
    // Split the string
    var includeArray = content.split(beginTag);

    for (var i=0; i<includeArray.length; i++) {
      var tmp = includeArray[i].split(endTag);
      
      // if at the string was an end tag.
      if (tmp.length === 1) {
        if (tmp[0] !== '') obj.push( {content: tmp[0]} );
      }
      else {
        // check if it is an url, set the object parameter name to url.
        if (this.isUrl(tmp[0])) {
          obj.push( {url: tmp[0]} );
        }
        // set the object parameter name to file.
        else {
          obj.push( {file: tmp[0]} );
        }
        if (tmp[1] !== '') obj.push( {content: tmp[1]} );
      }
    }

    return obj;
  },

  /**
   *
   */
  include: function(content, beginTag, endTag) {
    var includeArray = content.split(beginTag);
    //console.log('includeArray: '+includeArray);

    // Check if a tag exist
    if (includeArray.length > 1) {
      
      // A temporary content variable. This variable we will return later.
      var tmpContent = includeArray[0];
      //console.log('tmpContent: '+tmpContent);

      for (var i=1; i<includeArray.length; i++) {
        // Get the tag content
        var tmp = includeArray[i].split(endTag);
        var tagContent = tmp[0]
        //console.log('tagContent['+i+']: '+tagContent);

        // If the tag content is not empty...
        if (tagContent !== '') {
          // If the tag content is a url...
          if (this.isUrl(tagContent)) {
            console.log('TODO: implement...');
            // At the last loop, return the content
            if (i === includeArray.length-1) return tmpContent;
          }
          // else, load the file...
          else {
            var newData = this.readFileSync(tagContent, 'utf8');
            tmpContent += newData;
            // At the last loop, return the content
            if (i === includeArray.length-1) return tmpContent;
          }
        }
      }
    }
    // if to tag exist, return the content without including other content.
    else {
      return content;
    }
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

}

module.exports = RecursiveContentInclude;
