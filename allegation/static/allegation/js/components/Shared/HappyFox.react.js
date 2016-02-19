var React = require('react');

var AppConstants = require('constants/AppConstants');

var HappyFox = React.createClass({
  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {
    var scriptTag, s;

    if (global.DJANGO_ENV == 'test') {
      return;
    }

    if (jQuery('#happyfox-js').size()) {
      return;
    }
    window.HFCHAT_CONFIG = AppConstants.HAPPYFOX_CONF;

    scriptTag = document.createElement('script');
    scriptTag.id = 'happyfox-js';
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = window.HFCHAT_CONFIG.ASSETS_URL + '/js/widget-loader.js';

    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptTag, s);
  },


  render: function () {
    return (<div></div>);
  }
});

module.exports = HappyFox;
