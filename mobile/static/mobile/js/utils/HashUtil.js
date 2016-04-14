var Hashids = require('hashids');

var AppConstants = require('constants/AppConstants');


module.exports = (new Hashids(AppConstants.SALT, 8));
