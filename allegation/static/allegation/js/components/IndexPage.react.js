var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var DisclaimerActions = require('actions/DisclaimerActions');


var IndexPage = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function() {
    window.$welcome = $('.welcome');
    window.$subNav = $('.sub-nav');
    window.scrollValue = 243;

    function toggleShow() {
      var cond = $(window).scrollTop() >= scrollValue;
      $('.landing-nav').toggleClass('fixed-nav', cond);
      $('.main').toggleClass('margin-top-90', cond);
      $subNav.toggleClass('hidden', !cond);
    }

    $(window).on('scroll', toggleShow);

    // $(document).on('click', '.story-nav a', function() {
    //   $element = $($(this).data('target'));
    //   $('html, body').animate({
    //       scrollTop: $element.offset().top - 90
    //   }, 1000);
    //   return false;
    // });

  //   $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //     if ($(e.target).attr('href') == '#story-page') {
  //       $welcome.hide();
  //       $subNav.html($('.story-nav').clone());
  //       scrollValue = 0;
  //     } else {
  //       $welcome.show();
  //       $subNav.html('');
  //       scrollValue = 243;
  //     }
  //     toggleShow();
  //   })

  //   $('.tab-navigate').on('click', function() {
  //     var tab = $(this).attr('tab-navigate');
  //     $('a[aria-controls=' + tab + ']').trigger('click');
  //     $('html, body').animate({
  //         scrollTop: 0
  //     }, 1000);
  //     return false;
  //   });
  // },
  },

  render: function () {
   return (
      <div id='landing-page'>
        <div className="welcome">
          <div className="page-logo">
            <img src="/static/img/ii-logo.svg" alt="logo" />
          </div>
          <div className="page-banner">
            <p>Welcome to the <a href="#">Citizens Police Data Project</a>.</p>
            <p>After years of litigation by the <a href="#">Invisible institute</a>, more than 56,000 records of police misconduct complaints have been released to the public.</p>
          </div>
        </div>
        <nav className="landing-nav">
          <div className="items clearfix">
            <img className="pull-left" src="/static/img/cpdp-logo.svg" />
            <ul className="pull-right" role="tablist">
              <li><a href="/#!/data-tools">Data</a></li>
              <li><a href="#story-page" aria-controls="story-page" role="tab" data-toggle="tab">Stories</a></li>
              <li className="active"><a href="#find-page" aria-controls="find-page" role="tab" data-toggle="tab">Findings</a></li>
            </ul>
          </div>
          <div className="sub-nav hidden">
          </div>
        </nav>
        <div className="main">
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="find-page">
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/findings-main-1.png" alt />
                  </div>
                  <div className="col-sm-6">
                    <p>
                      Currently, the Chicago Police Department does not analyze its own misconduct complaint data for patterns among problem officers. While a high number of complaints does not necessarily indicate an abusive officer, it should merit internal inquiry.
                    </p>
                    <p>
                      In the absence of a universal tracking system across each of the department’s investigatory units,  this database aims to demonstrate what a system of police accountability could look like.
                    </p>
                    <p>
                      The Citizens Police Data Project, and the stories told from it, provide a model for public input and oversight.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/graph-1.svg" alt />
                    <p>
                      26,787 allegations of a were filed against Chicago Police Department officers between March 2011 and March 2015. Of those, _____(%) involved an encounter with a citizen.
                    </p>
                    <p>
                      Less than 2% of all complaints resulted in any discipline.
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/graph-2.svg" alt />
                    <p>
                      When punishments are given to officers, the vast majority lead to the <a href>violation being noted</a>, <a href>reprimand</a>, or suspensions of less than one week.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <img src="/static/allegation/img/data-chart.png" alt />
                    <p>
                      Complaints are disproportionately filed against a small subset of the Chicago Police Department.
                    </p>
                    <p>
                      Repeat officers—those with 10 or more complaints—make up 10% of the force but receive 30% of all complaints. They average 3.7 times as many complaints as the remaining 90% of officers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/graph-3.svg" alt />
                  </div>
                  <div className="col-sm-6">
                    <p>
                      Black Chicagoans filed 61% of all complaints in the database, but make up only 25% of sustained complaints.
                    </p>
                    <p>
                      White Chicagoans––who made 21% of total complaints––account for 58% of proven complaints.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section font-size-19">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/story-ad.png" alt />
                    <p>
                      What is the story CPDP?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum malesuada ornare. Quisque magna elit, accumsan imperdiet mauris ac, sollicitudin mollis felis. Cras sed tellus nisl.
                    </p>
                    <a className="tab-navigate btn" tab-navigate="story-page">View the Story</a>
                  </div>
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/data-ad.png" alt />
                    <p>
                      Where does this data come from?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum malesuada ornare. Quisque magna elit, accumsan imperdiet mauris ac, sollicitudin mollis felis.
                    </p>
                    <a href="/#!/data-tools" className="btn">See the database</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="container">
            <div className="col-sm-4">
              <h4>
                What is the CPDP?
              </h4>
              <p>
                Lorem ipsum, welcome to the Citizens Police Data Project. After years of litigation by the Invisible institute, more than 56,000 records of police misconduct complaints have been released to the public.
              </p>
              <a className="btn" onClick={this.showDisclaimer}>Disclaimer</a><br />
              <a className="btn">Glossary</a>
            </div>
            <div className="col-sm-4">
              <h4>
                Get Updates
              </h4>
              <p>
                Sign up for our mailing list for updates from the Invisible Institute and the Citizens Police Data Project.
                <form action="//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=8dfb7bdd4b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                  <div id="mc_embed_signup_scroll">
                    <div className="mc-field-group">
                      <input type="email" placeholder="Your Email Address" defaultValue value='' name="EMAIL" className="required email" id="mce-EMAIL" />
                    </div>
                    <div id="mce-responses" className="clear">
                      <div className="response" id="mce-error-response" style={{display: 'none'}} />
                      <div className="response" id="mce-success-response" style={{display: 'none'}} />
                    </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                    <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_5c80c1740c24b198f0f284cd3_8dfb7bdd4b" tabIndex={-1} defaultValue /></div>
                    <div className="clear"><input type="submit" defaultValue="Sign Up" name="subscribe" id="mc-embedded-subscribe" className="btn" /></div>
                  </div>
                </form>
              </p>
            </div>
            <div className="col-sm-4">
              <h4>
                Download the Data
              </h4>
              <p>
                Are you a researcher, journalist, data professional or community member interested in analyzing the data? Sign up with your name, organization/affiliation and email address to request the full data files used in the Citizens Police Data Project.
              </p>
              <form action="//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=dee1a647b0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll">
                  <div className="mc-field-group">
                    <input placeholder="Your Full Name" type="text" defaultValue name="FNAME" className id="mce-FNAME" />
                  </div>
                  <div className="mc-field-group">
                    <input placeholder="You Email Address" type="email" defaultValue name="EMAIL" className="required email" id="mce-EMAIL" />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{display: 'none'}} />
                    <div className="response" id="mce-success-response" style={{display: 'none'}} />
                  </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                  <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_5c80c1740c24b198f0f284cd3_dee1a647b0" tabIndex={-1} defaultValue /></div>
                  <div className="clear"><input type="submit" defaultValue="Request the file" name="subscribe" id="mc-embedded-subscribe" className="btn" /></div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Disclaimer />
      </div>
    );
  },

  _onClick: function() {
    navigate("/data-tools");
  },

  showDisclaimer: function() {
    DisclaimerActions.show();
  },
}));

module.exports = IndexPage;
