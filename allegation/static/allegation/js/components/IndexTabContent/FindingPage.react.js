var React = require('react');
var Link = require('react-router').Link;

var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var IndexTabContentMixin = require('mixins/IndexTabContentMixin');
var LandingFooter = require('components/Shared/LandingFooter.react');
var Nav = require('components/Shared/Nav2.react');


var FindingPage = React.createClass({
  mixins: [IndexTabContentMixin],

  componentDidMount: function () {
    // this.scrollTop(this.onScrollTopFindPage, this.getScrollTime());
  },

  scrollTop: function (callback, elapseTime) {
    var $body = $('body');

    $body.animate({
      scrollTop: 0
    }, elapseTime, callback);
  },

  getScrollTime: function () {
    var $body = $('body');

    return Math.min(500, $body.scrollTop());
  },

  onScrollTopFindPage: function () {
    var $landingPageContainer = $("#landing-page");

    this.scrollToggleShow();
  },

  scrollToggleShow: function () {
    var $welcome = $('.welcome');
    var $landingNav = $('.landing-nav');
    var $main = $('.main');
    var $cpdpLogo = $('.cpdp-logo');
    var $iiLogo = $('.page-logo');

    var scrollTop = $(window).scrollTop();
    var cond = scrollTop >= $welcome.height();
    $landingNav.toggleClass('fixed-nav', cond);
    $landingNav.toggleClass('border-top', scrollTop != 0);
    $main.toggleClass('margin-top-45', cond);
    var opacity = scrollTop / $welcome.height()
    $cpdpLogo.css('opacity', opacity);
    $iiLogo.css('opacity', 1 - opacity);
  },

  render: function () {
    return (
      <div id="landing-page">
        <div className="landing-page">
          <div className="welcome">
            <div className="page-logo">
            </div>
            <div className="page-banner">
              <p>Until recently, records of police misconduct in Chicago have been kept secret.</p>
              <p>In 2014, the court decision <i>Kalven v. Chicago</i> opened those files to the public.</p>
              <p><Link data-target="data" to="/data" onClick={this.navigate}>Explore the data.</Link></p>
            </div>
          </div>
          <Nav page='findings'/>
        </div>

        <div className="main">
          <div className="tab-content">
            <div role="tabpanel" className={this.getPanelClass('findings')} id="findings">
              <div className="row section map-section">
                <div className="container">
                  <div className="col-sm-6 static-map">
                    <Link data-target="data" to="data" onClick={this.navigate}><div className="map-image" /></Link>
                  </div>
                  <div className="col-sm-6 map-explain">
                    <p>
                      The Citizens Police Data Project houses police disciplinary information obtained from the City of Chicago.
                    </p>
                    <p>
                      The information and stories we have collected here are intended as a resource for public oversight. Our aim is to create a new model of accountability between officers and citizens.
                    </p>
                    <p>
                      This is an evolving platform. We are constantly adding data, and we welcome questions, feedback, and collaboration.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/graph-1.svg" alt />
                    <p>
                      28,567 allegations of misconduct were filed against Chicago Police Department officers between March 2011 and September 2015.
                    </p>
                    <p>
                      Less than 2% of those complaints resulted in any discipline.
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/graph-2.svg" alt />
                    <p>
                      Of those cases in which discipline is imposed, the vast majority result in a reprimand or a suspension of less than one week.
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
                      Repeat officers—those with 10 or more complaints—make up about 10% of the force but receive 30% of all complaints. They average 3.7x as many complaints per officer as the rest of the force.
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
                      White Chicagoans––who filed 21% of total complaints––account for 58% of sustained complaints.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section font-size-19">
                <div className="container">
                  <div className="col-sm-6">
                    <Link data-target="story" className="pointer tab-navigate" to="story" onClick={this.navigate}><img src="/static/allegation/img/story-ad.png" alt /></Link>
                    <Link data-target="story" className="tab-navigate btn full-width" to="story" onClick={this.navigate}>Stories</Link>
                  </div>
                  <div className="col-sm-6">
                    <Link data-target="data" to="/data" onClick={this.navigate}><img src="/static/allegation/img/data-ad.png" alt /></Link>
                    <Link className="btn full-width" data-target="data" to="/data" onClick={this.navigate}>Data</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-page">
          <LandingFooter />
        </div>
        <Disclaimer />
      </div>
    );
  }
});

module.exports = FindingPage;
