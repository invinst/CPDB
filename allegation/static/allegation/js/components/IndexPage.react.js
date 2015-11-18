var _ = require('lodash');
var navigate = require('react-mini-router').navigate;
var React = require('react');
var jQuery = require('utils/jQuery');

var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');
var SessionStore = require('stores/SessionStore');
var Disclaimer = require('components/DataToolPage/Disclaimer.react');
var DisclaimerActions = require('actions/DisclaimerActions');
var ReactRouter = require('react-router');
var History = require('history');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var IndexPage = React.createClass(_.assign(Base(SessionStore), {
  componentDidMount: function () {
    var $welcome = jQuery('.welcome');
    var $subNav = jQuery('.sub-nav');
    var $body = jQuery('#landing-page');
    var $landingNav = jQuery('.landing-nav');
    var $main = jQuery('.main');
    var $cpdpLogo = jQuery('.cpdp-logo');
    var $iiLogo = jQuery('.page-logo');
    var $findingBtn = jQuery('.view-findings');
    var $mapSection = jQuery('.map-section');
    var $movingArrow = jQuery('.moving-arrow');
    var navBarHeight = 90;

    function syncNavState() {
      var navItems = jQuery('.landing-nav .sub-nav a');
      var currentPos = jQuery(window).scrollTop() + navBarHeight;
      var breakloop = false;
      for(var index = 0; index < navItems.length; index++) {
        var item = jQuery(navItems[index]);
        var $control = jQuery(item.data('target'));
        if (currentPos >= $control.offset().top) {
          navItems.removeClass('active');
          item.addClass('active');
          break;
        }
      }
    }

    function toggleShow() {
      var scrollTop = jQuery(window).scrollTop();
      var cond = scrollTop >= $welcome.height();
      $landingNav.toggleClass('fixed-nav', cond);
      $landingNav.toggleClass('border-top', scrollTop != 0);
      $main.toggleClass('margin-top-90', cond);
      $subNav.toggleClass('hidden', !cond);
      var opacity = scrollTop / $welcome.height()
      $cpdpLogo.css('opacity', opacity);
      $iiLogo.css('opacity', 1 - opacity);
      syncNavState();
    }

    function scrollTop(callback, elapseTime) {
      $body.animate({
        scrollTop: 0
      }, elapseTime, callback);
    }

    function getScrollTime() {
      return Math.min(500, $body.scrollTop());
    }

    function onScrollTopFindPage() {
      $body.removeClass('scroll-to-top');
      toggleShow();
      onScrollTop();
    }

    function onScrollTop() {
      jQuery(window).on('scroll', toggleShow);
    }

    jQuery(window).on('scroll', toggleShow);

    jQuery(document).on('click', '.story-nav a', function() {
      $element = jQuery(jQuery(this).data('target'));
      $body.animate({
          scrollTop: $element.offset().top - navBarHeight
      }, 1000);
      return false;
    });

    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      $target = jQuery(e.target);
      var currentPage = $target.attr('href');
      jQuery(window).off('scroll');
      $movingArrow.animate({
        left: $target.offset().left + $target.width() / 2 - 10
      }, 500);

      if (currentPage == '#story-page') {
        $subNav.html(jQuery('.story-nav').clone());
      } else {
        $subNav.html('');
      }

      if (currentPage == '#find-page') {
        scrollTop(onScrollTopFindPage, getScrollTime());
      } else {
        $body.addClass('scroll-to-top');
        scrollTop(onScrollTop, 1000);
      }
    });

    jQuery('.tab-navigate').on('click', function() {
      var tab = jQuery(this).attr('tab-navigate');
      jQuery('a[aria-controls=' + tab + ']').trigger('click');
      return false;
    });

    $findingBtn.on('click', function() {
      $body.animate({
          scrollTop: $mapSection.offset().top - 45
      }, 1000);
      return false;
    });
  },

  render: function() {
    var updateUrl = '//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=8dfb7bdd4b';
    var subscribeUrl = '//invisibleinstitute.us1.list-manage.com/subscribe/post?u=5c80c1740c24b198f0f284cd3&id=dee1a647b0';

    return (
      <div id="landing-page">
        <div className="welcome">
          <div className="page-logo">
          </div>
          <div className="page-banner">
            <p>Until recently, records of police misconduct in Chicago have been kept secret.</p>
            <p>In 2014, the court decision <i>Kalven v. Chicago</i> opened those files to the public.</p>
            <p><a href="/#!/data-tools">Explore the data.</a></p>
          </div>
        </div>
        <nav className="landing-nav">
          <div className="items clearfix">
            <img className="pull-left cpdp-logo" src="/static/img/cpdp-logo.svg" />
            <ul className="pull-right" role="tablist">
              <span className="moving-arrow" />
              <li><a href="/#!/data-tools">Data</a></li>
              <li><a href="#methodology-page" aria-controls="methodology-page" role="tab" data-toggle="tab">Methods</a></li>
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
              <div className="row section map-section">
                <div className="container">
                  <div className="col-sm-6 static-map">
                    <a href="/#!/data-tools"><div className="map-image" /></a>
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
                    <a className="pointer tab-navigate" tab-navigate="story-page"><img src="/static/allegation/img/story-ad.png" alt /></a>
                    <a className="tab-navigate btn full-width" tab-navigate="story-page">Stories</a>
                  </div>
                  <div className="col-sm-6">
                    <a href="/#!/data-tools"><img src="/static/allegation/img/data-ad.png" alt /></a>
                    <a className="btn full-width" href="/#!/data-tools">Data</a>
                  </div>
                </div>
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="story-page">
              <nav className="story-nav">
                <a href="#" className="pull-right" data-target="#next-steps">Next Steps</a>
                <a href="#" className="pull-right" data-target="#invisible-institute">The Invisible Institute</a>
                <a href="#" className="pull-right active" data-target="#stateway">Stateway Gardens Litigation</a>
              </nav>
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
                    <a className="pointer tab-navigate" tab-navigate="find-page"><img src="/static/allegation/img/finding-ad.png" alt /></a>
                    <a className="tab-navigate btn full-width" tab-navigate="find-page">Findings</a>
                  </div>
                  <div className="col-sm-6">
                    <a href="/#!/data-tools"><img src="/static/allegation/img/data-ad.png" alt /></a>
                    <a className="btn full-width" href="/#!/data-tools">Data</a>
                  </div>
                </div>
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="methodology-page">
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
                      One example is a complaint filed against Officer Robert Drell, who was the subject of a misconduct allegation in May 2009. You can view the data we have under the <a href="http://cpdb.co/#!/data-tools/bZ5Y9L/allegations-of-police-misconduct-in-chicago">CRID 1062099</a>. The Category, Finding, and Final Outcome of this allegation are “Unknown.” However, Officer Drell was suspended in October, 2014 and had a hearing in front of the Chicago Police Board in January, 2015. The Board <a href="https://www.documentcloud.org/documents/2510144-14pb2877-decision.html">found him not guilty</a>, and Officer Drell was reinstated as an officer, with back-pay, on March 19, 2015.
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
                      To see the most controlled version of allegation data — i.e. data from 2011 to present — a means of removing the Bond and Moore datasets has been provided. In the <a href="http://cpdb.co/#!/data-tools/DwGpJD/allegations-of-police-misconduct-in-chicago">search bar, type and click “FOIA.”</a>
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
                    <a className="tab-navigate btn full-width" tab-navigate="find-page">Findings</a>
                  </div>
                  <div className="col-sm-6">
                    <img src="/static/allegation/img/data-ad.png" alt />
                    <a className="btn full-width" href="/#!/data-tools">Data</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              </p><form action={updateUrl} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll">
                  <div className="mc-field-group">
                    <input type="email" placeholder="Email Address" name="EMAIL" className="required email" id="mce-EMAIL" />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{display: 'none'}} />
                    <div className="response" id="mce-success-response" style={{display: 'none'}} />
                  </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                  <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_5c80c1740c24b198f0f284cd3_8dfb7bdd4b" tabIndex={-1} /></div>
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
              </p><form action={subscribeUrl} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll">
                  <div className="mc-field-group">
                    <input placeholder="Full Name" type="text" name="FNAME" className id="mce-FNAME" />
                  </div>
                  <div className="mc-field-group">
                    <input placeholder="Email Address" type="email" name="EMAIL" className="required email" id="mce-EMAIL" />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{display: 'none'}} />
                    <div className="response" id="mce-success-response" style={{display: 'none'}} />
                  </div>    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                  <div style={{position: 'absolute', left: '-5000px'}}><input type="text" name="b_5c80c1740c24b198f0f284cd3_dee1a647b0" tabIndex={-1} /></div>
                  <div className="clear"><input type="submit" defaultValue="Collaborate" name="subscribe" id="mc-embedded-subscribe" className="btn" /></div>
                </div>
              </form>
              <p />
            </div>
          </div>
        </div>
        <div className="modal fade" id="disclaimer" tabIndex={-1} role="dialog" aria-labelledby="disclaimer" style={{width: 600, margin: '0 auto'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Disclaimer</h2>
              </div>
              <div className="modal-body">
                <p>The information contained on this website comes primarily from three datasets provided by the Chicago
                  Police Department (CPD), spanning approximately 2002 to 2008 and 2011 to 2015. The CPD has released
                  these lists in response to litigation and to FOIA Requests.</p>
                <p>The City of Chicago’s release of this information was accompanied by a disclaimer that not all of the
                  information contained in the City’s database may be completely accurate. No independent verification
                  of the City’s records has taken place and this public database does not purport to be an accurate
                  reflection of either the City’s internal database or of its truthfulness.</p>
                <p>Slight changes to the spelling of officer names and to the wording of abuse categories have been made
                  to accommodate a consistent appearance. A glossary of our understanding of common CPD terms has been
                  provided. No other editing of the City’s original datasets has taken place.</p>
                <p>This public database also contains other readily available data that has been linked to the City’s
                  original datasets, including: CPD beat geographies, Chicago ward boundaries, Chicago neighborhood
                  boundaries, et cetera.</p>
                <p>By entering this website, you acknowledge that the Citizens’ Police Database (CPDB) is not
                  responsible for any derivative work performed by or published by users of this public database.</p>
              </div>
              <div className="modal-footer" data-dismiss="modal">
                <button className="btn btn-sm btn-view">I UNDERSTAND</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = IndexPage;
