/**
 * Module dependencies.
 */
var fs = require('fs');
var request = require('request');

/**
 *
 */
module.exports = function(file, beginTag, endTag, callback) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    else {
      while((i = data.indexOf(beginTag)) != -1){
        var j = data.indexOf(endTag, i + beginTag.length); 
        var importFileName = data.substring(i + beginTag.length, j);
        var newData = fs.readFileSync(importFileName, 'utf8');
        if(newData){
          var before = data.substring(0, i-1);
          var after = data.substring(j + endTag.length);
          data = before + newData + after;
        }
      }
      callback(data);
    }
  });
}
