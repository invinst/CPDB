var React = require('react');
var DisclaimerActions = require('actions/DisclaimerActions');

var Footer = React.createClass({
  showDisclaimer: function() {
    DisclaimerActions.show();
  },

  render: function () {
    return (
      <footer>
        <div className="row">
            <div className="col-lg-12">
              <div className="container">
                <ul className="list-unstyled">
                    <li className="pull-right">
                      <a className='btn btn-transparent disclaimer-btn' onClick={this.showDisclaimer}>
                        <i className='fa fa-warning'></i> About the data
                      </a>
                    </li>
                </ul>
                <div id="powered-by">
                  <a href="/">
                    <img className="rackspace-logo" src="/static/img/rackspace.svg" />
                  </a>
                </div>
              </div>
            </div>
        </div>
    </footer>
    );
  }
});

module.exports = Footer;
