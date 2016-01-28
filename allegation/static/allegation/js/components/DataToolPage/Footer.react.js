var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var DisclaimerActions = require('actions/DisclaimerActions');
var EmbedAction = require('actions/EmbedActions');
var Base = require('components/Base.react');
var Download = require('components/DataToolPage/Download.react');
var EmbedStore = require('stores/EmbedStore');
var jQuery = require('utils/jQuery');


var Footer = React.createClass(_.assign(Base(EmbedStore), {
  componentDidUpdate: function () {
    if (this.state.embedMode) {
      jQuery('body').addClass('embedding');
    } else {
      jQuery('body').removeClass('embedding');
    }
  },

  toggleEmbedMode: function (e) {
    e.preventDefault();
    var currentScrollTop = jQuery(window).scrollTop();
    var currentBodyHeight = jQuery(document).height();

    if (this.state.embedMode) {
      EmbedAction.leaveEmbedMode();
    } else {
      EmbedAction.enterEmbedMode();
    }
    jQuery(window).scrollTop(currentScrollTop - currentBodyHeight + jQuery(document).height());
  },

  showDisclaimer: function() {
    DisclaimerActions.show();
  },

  smoothScroll: function (event) {
    var target = $(event.currentTarget).data('target');
    var top = $(target).offset().top - 100;
    $('html, body').animate({scrollTop: top}, 500);
  },

  render: function () {
    var exitClassName = classnames({
      'hidden': !this.state.embedMode
    });
    var embedClassName = classnames('embed-button', {
      'active': this.state.embedMode,
    });
    var footerClassName = classnames('row', {
      'hide-embed-button': !this.props.withEmbedBar
    });

    return (
      <footer>
        <div className={ footerClassName }>
          <div className="col-lg-12">
            <div className="container">
              <ul className="list-unstyled pull-right" id="EmbedBar">
                <li className="embed-button">
                  <Download />
                </li>
                <li className={ embedClassName }>
                  <a href="javascript: void()" onClick={ this.toggleEmbedMode }>
                    <i className="fa fa-code"></i> Embed Mode
                  </a>
                </li>
                <li className="embed-button">
                  <div className='smooth-scroll pointer' data-target='body' onClick={ this.smoothScroll }>
                    <i className='fa fa-chevron-up' ></i> Back to top
                  </div>
                </li>
                <li>
                  <a className='btn btn-transparent disclaimer-btn' onClick={ this.showDisclaimer }>
                    <i className='fa fa-warning'></i> About the data
                  </a>
                </li>
              </ul>
              <ul className="list-unstyled pull-left">
                <li id="powered-by">
                  <a href="/">
                    <img className="rackspace-logo" src="/static/img/rackspace.svg" />
                  </a>
                </li>
                <li className="embed-button">
                  <a href="javascript: void()" onClick={ this.toggleEmbedMode } className={ exitClassName }>
                    <i className="fa fa-times"></i> Exit mode
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}));

module.exports = Footer;
