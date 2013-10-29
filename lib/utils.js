/**
 * Remove whitespace from a string.
 */
exports.killWhitespace = function(str) {
  return str.replace(/\s/g, '');
};

/**
 * Remove line breaks from a string.
 */
exports.killLinebreaks = function(str) {
  return str.replace(/\n|\r/g, '');
};
