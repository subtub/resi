/**
 * Some constant variables we use over and over.
 */
module.exports = CONSTANTS = {
  /**
   * The keywords used by resi.
   * 
   * @type {Object}
   */
  SYNTAX: {
    SCRIPT: 'script: ',
    COMMENT: 'comment: ',
    LOG: 'log: '
  },

	/**
	 * The different token types.
   *
   * @type {Object} 
	 */
  TOKEN_TYPE: {
    TEXT: 'text',
    FILE: 'file',
    WEBURL: 'weburl',
    SCRIPT: 'script',
    COMMENT: 'comment',
    LOG: 'log'
  },

  /**
   * The console begin messages.
   *
   * @type {Object}
   */
  CONSOLE: {
    BEGIN_LOG: 'resi-log: ',
    BEGIN_ERROR: 'resi-error: '
  }
};
