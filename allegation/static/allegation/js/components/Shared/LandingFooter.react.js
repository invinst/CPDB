var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var Base = require('components/Base.react');
var AppStore = require('stores/AppStore');


var LandingFooter = React.createClass(_.assign(Base(AppStore), {
  render: function () {
    var updateUrl = '//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=8dfb7bdd4b';
    var subscribeUrl = '//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=dee1a647b0';

    return (
      <div className="footer">
        <div className="container">
          <div className="col-sm-4">
            <a className="btn" href="/static/img/complaint_process.png" target="_blank">Complaints Process</a>
            <a className="btn" href="http://cpdb.datamade.us/glossary.html" target="_blank">Glossary of Terms</a>
            <a href="#disclaimer" className="btn" data-toggle="modal" data-target="#disclaimer">Legal Disclaimer</a><br />
          </div>
          <div className="col-sm-4">
            <h4>
              Get updates
            </h4>
            <p>
            </p><form action={ updateUrl } method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate={ true }>
              <div id="mc_embed_signup_scroll">
                <div className="mc-field-group">
                  <input type="email" placeholder="Email Address" name="EMAIL" className="required email" id="mce-EMAIL" />
                </div>
                <div id="mce-responses" className="clear">
                  <div className="response" id="mce-error-response" style={ {display: 'none'} } />
                  <div className="response" id="mce-success-response" style={ {display: 'none'} } />
                </div>      {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                <div style={ {position: 'absolute', left: '-5000px'} }><input type="text" name="b_5c80c1740c24b198f0f284cd3_8dfb7bdd4b" tabIndex={ -1 } /></div>
                <div className="clear"><input type="submit" defaultValue="Sign up" name="subscribe" id="mc-embedded-subscribe" className="btn" /></div>
              </div>
            </form>
            <p />
          </div>
          <div className="col-sm-4">
            <h4>
              Work the data
            </h4>
            <p>
              Are you a researcher, journalist, data professional or community member interested in analyzing the data? Sign up with your name and email address to request access to the full dataset within the Citizens Police Data Project.
              {/* Begin MailChimp Download Data Form */}
            </p><form action={ subscribeUrl } method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate={ true }>
              <div id="mc_embed_signup_scroll">
                <div className="mc-field-group">
                  <input placeholder="Full Name" type="text" name="FNAME" className={ true } id="mce-FNAME" />
                </div>
                <div className="mc-field-group">
                  <input placeholder="Email Address" type="email" name="EMAIL" className="required email" id="mce-EMAIL" />
                </div>
                <div id="mce-responses" className="clear">
                  <div className="response" id="mce-error-response" style={ {display: 'none'} } />
                  <div className="response" id="mce-success-response" style={ {display: 'none'} } />
                </div>      {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                <div style={ {position: 'absolute', left: '-5000px'} }><input type="text" name="b_5c80c1740c24b198f0f284cd3_dee1a647b0" tabIndex={ -1 } /></div>
                <div className="clear"><input type="submit" defaultValue="Collaborate" name="subscribe" id="mc-embedded-subscribe" className="btn" /></div>
              </div>
            </form>
            <p />
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = LandingFooter;
