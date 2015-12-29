var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');
var ReactRouter = require('react-router');
var History = require('history');
var classnames = require('classnames');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var AppStore = require('stores/AppStore');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var DataToolPage = require('components/DataToolPage.react');
var DisclaimerActions = require('actions/DisclaimerActions');
var Nav = require('components/Shared/Nav2.react')
var LandingFooter = require('components/Shared/LandingFooter.react');
var SessionAPI = require('utils/SessionAPI');
var NavActions = require('actions/NavActions');
var WagtailPage = require('components/WagtailPage.react');
var WagtailPagesStore = require('stores/WagtailPagesStore');
var WagtailPagesAPI = require('utils/WagtailPagesAPI');

var IndexPage = React.createClass(_.assign(Base(AppStore), {
  componentDidMount: function () {
    AppStore.addChangeListener(this._onChange);
    AppStore.addChangePageListener(this.onChangePage);
    AppStore.addChangeSessionListener(this.onChangeSession);

    $(window).on('scroll', this.scrollToggleShow);
    this.attachScroll();
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    AppStore.removeChangePageListener(this.onChangePage);
    AppStore.removeChangeSessionListener(this.onChangeSession)
  },

  componentWillMount: function () {
    this.displayTabByPath();
    var session = this.props.params.session;
    var hash = this.props.location.hash;
    if (hash.search("data-tools") != -1) {
      session = hash.split("/")[2];
    }
    SessionAPI.getSessionInfo(session || '');
    WagtailPagesAPI.getData();
  },

  onChangeSession: function () {
    if (AppStore.isDataToolPage()) {
      history.replaceState(null, null, AppStore.getDataToolUrl());
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return (nextProps.transitioning === false &&
      (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)));
  },

  componentDidUpdate: function () {
    this.displayTabByPath();
  },

  onChangePage: function () {
    this.attachScroll();
  },

  displayTabByPath: function () {
    var page = _.remove(window.location.pathname.split('/'))[0];
    if (!page) {
      page = 'data';
    }
    if (!AppStore.isPage(page)) {
      NavActions.goToPage(page, this.params);
    }
  },

  getPanelClass: function (tab) {
    return classnames('tab-pane', {
      'landing-page': tab != 'data',
      'active': tab == this.state.page
    });
  },

  navigate: function (e) {
    NavActions.goToPage($(e.target).data('target'));
    return false;
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
    $main.toggleClass('margin-top-90', cond);
    var opacity = scrollTop / $welcome.height()
    $cpdpLogo.css('opacity', opacity);
    $iiLogo.css('opacity', 1 - opacity);
    this.syncNavState();
  },

  syncNavState: function () {
    var navBarHeight = 90;
    var navItems = $('.landing-nav .sub-nav a');
    var currentPos = $(window).scrollTop() + navBarHeight;

    for(var index = 0; index < navItems.length; index++) {
      var item = $(navItems[index]);
      var $control = $(item.data('target'));
      if (currentPos >= $control.offset().top) {
        navItems.removeClass('active');
        item.addClass('active');
        break;
      }
    }
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

  onScrollTop: function () {
    $(window).on('scroll', this.scrollToggleShow);
  },

  onScrollTopFindPage: function () {
    var $landingPageContainer = $("#landing-page");

    $landingPageContainer.removeClass('scroll-to-top');
    this.scrollToggleShow();
    this.onScrollTop();
  },

  attachScroll: function () {
    var $landingPageContainer = $("#landing-page");

    $(window).off('scroll', this.scrollToggleShow);

    if (AppStore.isFindingPage()) {
      this.scrollTop(this.onScrollTopFindPage, this.getScrollTime());
    } else {
      $landingPageContainer.addClass('scroll-to-top');
      this.scrollTop(this.onScrollTop, 100);
    }
  },

  renderWagtailPages: function () {
    var that = this;

    return this.state.wagtailPages.map(function (wagtailPage) {
      return (
        <div role="tabpanel" className={that.getPanelClass(wagtailPage.slug)} id={wagtailPage.slug} key={wagtailPage.id}>
          <WagtailPage body={wagtailPage.extended_body} />
        </div>
      );
    })
  },

  render: function() {
    var landingClassName = classnames({
      'scroll-to-top': !AppStore.isFindingPage()
    });

    return (
      <div id="landing-page" className={landingClassName}>
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
          <Nav />
        </div>
        <div className="main">
          <div className="tab-content">
            { this.renderWagtailPages() }
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
            <div role="tabpanel" className={this.getPanelClass('story')} id="story">
              <div className="row section single-img" id="stateway">
                <div className="container">
                  <div className="col-sm-12">
                    <img src="/static/allegation/img/story-main-3.png" alt />
                    <h2 className="title">
                      Stateway Gardens Litigation
                    </h2>
                    <p>
                      Ten years ago, Invisible Institute founder Jamie Kalven was reporting from the Stateway Gardens public housing development, when a resident, Diane Bond, was assaulted by a group of police officers. The officers who ransacked her home and harassed her were well known to Stateway residents. They were known on the street as “The Skullcap Crew.”
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h1>
                      “The case unfurled over seven years… finally, in 2014, the litigation gave rise to a watershed ruling.”
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/story-main-1.png" alt />
                    <img src="/static/allegation/img/dianebond2.jpg" alt />
                  </div>
                  <div className="col-sm-6">
                    <p>
                      When Bond told Kalven of the encounter, he encouraged her to make an official complaint. Kalven also introduced Bond to Craig Futterman, an attorney with the police accountability project at the University of Chicago’s Mandel Legal Aid Clinic. Futterman and his students filed a civil rights lawsuit on behalf of Ms. Bond, and in the lead up to trial requested a list of the Chicago Police officers who have accumulated the most complaints. They received those documents, but under a protective order that barred them from making the information public. As the Bond case moved toward settlement, Kalven intervened on behalf of the public arguing that police misconduct files are public information and hence that the protective order should be lifted. The case unfurled over seven years, first in federal court and then in state court. Finally, in 2014, the litigation gave rise to a watershed ruling: the Supreme of Court of Illinois held that records of police misconduct should be opened to the public.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h1>
                      “These datasets represent all the available data on police misconduct that the city of Chicago has released.”
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row section" id="invisible-institute">
                <div className="container">
                  <div className="col-sm-12">
                    <img src="/static/allegation/img/UCPD-1.jpg" alt />
                    <h2 className="title">
                      The Invisible Institute
                    </h2>
                    <p>
                      Kalven's reporting projects at Stateway Gardens developed into the Invisible Institute: a journalistic production company working to expand and operationalize transparency, and make visible perspectives too often excluded from public discourse.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12" id="next-steps">
                    <h2 className="title">The Police Union’s Counter-Attack</h2>
                    <p>
                      In the wake of the Kalven decision, the city agreed to make public disciplinary data from 1967 to the present. The Fraternal Order of Police then intervened, and a sympathetic judge imposed a temporary injunction. The city has appealed the injunction, and the Invisible Institute has filed an amicus brief in support of the city's position.
                    </p>
                    <p>
                      The 56,000 unique complaints included in the Citizens Police Data Project are a fraction of the number at stake. If the union prevails, the last half century of CPD disciplinary records will be destroyed. If we win they will be made public.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h1>
                      “If the union prevails, the last half century of CPD disciplinary records will be destroyed.”
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row section font-size-19">
                <div className="container">
                  <div className="col-sm-6">
                    <Link className="pointer tab-navigate" data-target="findings" to="/findings" onClick={this.navigate}><img src="/static/allegation/img/finding-ad.png" alt /></Link>
                    <Link className="tab-navigate btn full-width" data-target="findings" to="/findings" onClick={this.navigate}>Findings</Link>
                  </div>
                  <div className="col-sm-6">
                    <Link data-target="data" to="/data" onClick={this.navigate}><img src="/static/allegation/img/data-ad.png" alt /></Link>
                    <Link className="btn full-width" data-target="data" to="/data" onClick={this.navigate}>Data</Link>
                  </div>
                </div>
              </div>
            </div>
            <div role="tabpanel" className={this.getPanelClass('method')} id="method">
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h2 className="title">Collaboration</h2>
                    <p>
                      This information presented in the Citizens Police Data Project was collected through Freedom of Information Act requests. We are working to create a resource for public oversight and input, and we welcome community collaboration.
                    </p>
                    <p>
                      If you see an allegation you’d like to know more about, you can download a <a href="https://assets.documentcloud.org/documents/2510275/sample-foia-cpd-crs.pdf">sample</a> request for the full Complaint Register file, fill in the missing information, and email the PDF to <a href="mailto:FOIA@chicagopolice.org">FOIA@chicagopolice.org</a>. Before being released, each Complaint Register file must have all personal information for non-police officers redacted, by hand. We suggest you limit your request to fewer than five Complaint Register files, so as to not overwhelm the FOIA officer and delay your request.
                    </p>
                    <p>
                      If you receive a response, you can contribute by forwarding the response you receive from the FOIA officer, including the original attachments. Reach us at <a href="mailto:records@invisibleinstitute.com">records@invisibleinstitute.com</a>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/methodology.png" alt />
                  </div>
                  <div className="col-sm-6">
                    <h2 className="title">
                      How accurate is the data?
                    </h2>
                    <p>
                      We believe that truly honest data can support powerful reforms, but we recognize the limits of our data. We publish the city’s records without alteration, except for minor typos and spelling errors. As we identify information needs and develop new sources, we also develop internal protocols for ensuring the integrity of the data we publish. This includes having lawyers and investigative journalists read and validate the data, cross referencing data against  other official sources, and filing new requests to correct data we suspect to be outdated or incorrect.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <p>
                      If you believe there is an error or problem with the data, <a href="http://goo.gl/forms/RHCPGdNhYw">please report it</a> to us. We will verify that the website accurately reflects the data the city provided to us. We will also alert the city’s Freedom of Information officer to the potential mistake and ask them to provide us with an update if necessary.
                    </p>
                    <p>
                      However, we will not modify the data set to reflect user-submitted corrections. We also cannot guarantee that all the data is accurate or current.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h2 className="title">
                      How current is the data?
                    </h2>
                    <p>
                      We regularly request updates to our existing dataset from the city of Chicago. We are also collecting contextual documents about police misconduct, including settlements in civil suits and Chicago Police Board findings.
                    </p>
                    <p>
                      In our data some investigations that we know to have concluded are still ‘open.’
                    </p>
                    <p>
                      One example is a complaint filed against Officer Robert Drell, who was the subject of a misconduct allegation in May 2009. You can view the data we have under the <a href="http://cpdb.co/data/bZ5Y9L/allegations-of-police-misconduct-in-chicago">CRID 1062099</a>. The Category, Finding, and Final Outcome of this allegation are “Unknown.” However, Officer Drell was suspended in October, 2014 and had a hearing in front of the Chicago Police Board in January, 2015. The Board <a href="https://www.documentcloud.org/documents/2510144-14pb2877-decision.html">found him not guilty</a>, and Officer Drell was reinstated as an officer, with back-pay, on March 19, 2015.
                    </p>
                    <p>
                      We discovered this discrepancy by matching CRID numbers from Chicago Police Board documents to allegations we have. We are certain there are other departures as well.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h2 className="title">
                      What are the “Bond” and “Moore” datasets, and how do they affect the data?
                    </h2>
                    <p>
                      The <a href="https://www.documentcloud.org/documents/1237492-bond-list-of-662-police-officers.html">Bond data</a> was produced by the city of Chicago in <a href="http://www.gpo.gov/fdsys/pkg/USCOURTS-ilnd-1_04-cv-02617">Bond v. Utreas</a>, and includes the names of 662 Chicago police officers with more than ten misconduct complaints between May 2001 and May 2006. It only includes the names of officers, the CRID number, the length of the investigation, the outcome of the investigation, and any punishment served.
                    </p>
                    <p>
                      The <a href="https://www.documentcloud.org/documents/1237391-moore-cc-list-1-120.html">Moore data</a> was produced by the city of Chicago in <a href="https://www.documentcloud.org/documents/2510218-documents-mx-final-motion-for-sanctions.html">Moore v. City of Chicago</a>, and includes the names of 185 Chicago police officers with more than five excessive force complaints from May 2002 to December 2008. It only includes the names and badge numbers of officers, the CRID number, the category of alleged misconduct, the outcome of the investigation, and any punishment served.
                    </p>
                    <p>
                      Because the Bond and Moore data only includes officers who have a certain number of allegations, it slightly skews the related findings. We include the Bond and Moore data because this represents all the available data on police misconduct that the city of Chicago has released.
                    </p>
                    <p>
                      To see the most controlled version of allegation data — i.e. data from 2011 to present — a means of removing the Bond and Moore datasets has been provided. In the <a href="http://cpdb.co/data/DwGpJD/allegations-of-police-misconduct-in-chicago">search bar, type and click “FOIA.”</a>
                    </p>
                    <p>
                      “FOIA” results only include the data we received for our most recent request, which are allegations of misconduct filed from 2011 to present.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section">
                <div className="container">
                  <div className="col-sm-12">
                    <h2 className="title">
                      Terms of Use
                    </h2>
                    <p>
                      The information contained on this website comes primarily from three datasets provided by the Chicago Police Department (CPD), spanning approximately 2002 to 2008 and 2011 to 2015. The CPD has released these lists in response to litigation and to FOIA requests.
                    </p>
                    <p>
                      The city of Chicago’s release of this information was accompanied by a disclaimer that not all of the information contained in the city’s database may be completely accurate. No independent verification of the city’s records has taken place and this public database does not purport to be an accurate or timely reflection of either the city’s internal database or of its truthfulness.
                    </p>
                    <p>
                      Slight changes to the spelling of officer names and to the wording of misconduct categories have been made to accommodate a consistent appearance. A glossary of our understanding of common CPD terms has been provided. No other editing of the city’s original datasets has taken place.
                    </p>
                    <p>
                      This public database also contains other readily available data that has been linked to the city’s original datasets, including: CPD beat geographies, Chicago ward boundaries, Chicago neighborhood boundaries, et cetera.
                    </p>
                    <p>
                      By entering this website, you acknowledge that the Invisible Institute is not responsible for any derivative work performed by or published by users of this public database. The CPDB is for informational purposes only and is not intended to provide legal advice. Please consult with your own legal advisor before you take any action.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row section font-size-19">
                <div className="container">
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/finding-ad.png" alt />
                    <Link className="tab-navigate btn full-width" data-target="findings" to="/findings" onClick={this.navigate}>Findings</Link>
                  </div>
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/data-ad.png" alt />
                    <Link className="btn full-width" data-target="data" to="/data" onClick={this.navigate}>Data</Link>
                  </div>
                </div>
              </div>
            </div>
            <div role="tabpanel" className={this.getPanelClass('data')} id="data">
              {this.state.page == 'data' ? <DataToolPage /> : null}
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
}));

module.exports = IndexPage;
