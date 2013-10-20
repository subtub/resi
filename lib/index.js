/**
 * Module dependencies.
 */
var fs = require('fs');
var request = require('request');

/**
 *
 */
function readFileSync(file, beginTag, endTag) {
  var data = fs.readFileSync(file, 'utf8');
  return include(data, beginTag, endTag);
}

exports.readFileSync = readFileSync;

/**
 *
 */
function include(content, beginTag, endTag) {
  var includeArray = content.split(beginTag);
  console.log('includeArray: '+includeArray);

  // Check if a tag exist
  if (includeArray.length > 1) {
    
    // A temporary content variable. This variable we will return later.
    var tmpContent = includeArray[0];
    console.log('tmpContent: '+tmpContent);

    for (var i=1; i<includeArray.length; i++) {
      // Get the tag content
      var tmp = includeArray[i].split(endTag);
      var tagContent = tmp[0]
      console.log('tagContent['+i+']: '+tagContent);

      // If the tag content is not empty...
      if (tagContent !== '') {
        // If the tag content is a url...
        if (isUrl(tagContent)) {
          console.log('TODO: implement...');
          // At the last loop, return the content
          if (i === includeArray.length-1) return tmpContent;
        }
        // else, load the file...
        else {
          var newData = readFileSync(tagContent, 'utf8');
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
}

exports.include = include;

/**
 * Check if the tag is a http or https url.
 *
 * @param {String} str The tag content.
 * @return true or false.
 */
function isUrl(str) {
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

exports.isUrl = isUrl;
