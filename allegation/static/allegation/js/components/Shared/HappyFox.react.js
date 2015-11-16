var React = require('react');
global.jQuery = require('jquery');

var AppConstants = require('constants/AppConstants');

var HappyFox = React.createClass({
  render: function() {
    return (<div></div>);
  },

  componentDidMount: function () {
    this.initialize();
  },


  initialize: function () {
    if (global.DJANGO_ENV == 'test') {
      return;
    }

    if (jQuery("#happyfox-js").size()) {
      return;
    }
    window.HFCHAT_CONFIG = AppConstants.HAPPYFOX_CONF;

    var scriptTag = document.createElement('script');
    scriptTag.id = 'happyfox-js'
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = window.HFCHAT_CONFIG.ASSETS_URL + '/js/widget-loader.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptTag, s);
  }
});

module.exports = HappyFox;
