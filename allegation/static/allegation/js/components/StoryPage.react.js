var React = require('react');
var Nav = require('components/Shared/Nav.react');

var StoryPage = React.createClass({
  _slowScroll: function(e) {
    console.log(e);
    var target = $(e.target).data('target');
    $("html, body").animate({
      scrollTop: $(target).offset().top
    }, 1000);
  },

  render: function() {
    return (
      <div id="landing-page">
        <Nav />
        <div role="tabpanel" className="tab-pane" id="story-page">
          <nav className="story-nav" data-spy="affix" data-offset-top="60" data-offset-bottom="200">
            <a href="javascript:void(0);" onClick={this._slowScroll} data-target="#stateway">Stateway Gardens Litigation</a>
            <a href="javascript:void(0);" onClick={this._slowScroll} data-target="#invisible-institute">The Invisible Institute</a>
            <a href="javascript:void(0);" onClick={this._slowScroll} data-target="#next-steps">Next Steps</a>
          </nav>
          <div className="row section single-img" id="stateway">
            <div className="container">
              <div className="col-sm-12">
                <img src="/static/allegation/img/story-main-1.png" alt />
                <p>
                  Stateway Gardens Litigation
                </p>
                <p>
                  Ten years ago, Invisible Institute founder Jamie Kalven was reporting out of a vacant unit in Stateway Gardens—at the time one of the last remaining high rises from Chicago’s public housing projects—when a resident of the building, Diana Bond, was assaulted by a group of police officers. The officers who ransacked her home and harassed her were well known to the other residents of her building; their reputations for brutality had already earned them the nickname “The Skullcap Crew.”
                </p>
              </div>
            </div>
          </div>
          <div className="row section">
            <div className="container">
              <div className="col-sm-12">
                <h1>
                  “The officers who ransacked her home and harassed her were well known to the other residents of her building; their reputations for brutality had already earned them the nickname “The Skullcap Crew.”
                </h1>
              </div>
            </div>
          </div>
          <div className="row section">
            <div className="container">
              <div className="col-sm-6">
                <img src="/static/allegation/img/story-main-2.png" alt />
                <img src="/static/allegation/img/story-main-3.png" alt />
              </div>
              <div className="col-sm-6">
                <p>
                  When Bond told Kalven of the encounter, he encouraged her to make an official complaint. At the time, complaints were investigated by the Office of Professional Standards, in an office across the street from Stateway Gardens. Kalven also introduced Bond to Craig Futterman, an attorney with the police accountability project at the University of Chicago’s legal aid clinic. Futterman and Bond filed a civil rights lawsuit, and in the course of discovery, requested a list of the Chicago Police officers who have accumulated the most complaints. They received those documents, but under a protective order, sworn to secrecy. Bond went on to settle that case, but Kalven filed another lawsuit. He requested that the records of complaints against police officers be made available to the public. It was a case that went on for seven years. In 2014, litigation resulting from Kalven’s reporting on patterns of police abuse at Stateway Gardens gave rise to a watershed ruling: the Supreme of Court of Illinois agreed that records of police misconduct belong to the public.
                </p>
              </div>
            </div>
          </div>
          <div className="row section">
            <div className="container">
              <div className="col-sm-12">
                <h1>
                  “He requested that the records of complaints against police officers be made available to the public. It was a case that went on for seven years.”
                </h1>
              </div>
            </div>
          </div>
          <div className="row section" id="invisible-institute">
            <div className="container">
              <div className="col-sm-12">
                <img src="/static/allegation/img/story-main-4.png" alt />
                <p>
                  The Invisible Institute
                </p>
                <p>
                  Another, almost unintended, result was the Invisible Institute, which grew into a journalistic production company on the South Side of Chicago working to enhance the capacity of civil society to hold public institutions accountable, develop strategies to operationalize transparency, and make perspectives too often excluded from public discourse visible.
                </p>
              </div>
            </div>
          </div>
          <div className="row section" id="methodology">
            <div className="container">
              <div className="col-sm-6">
                <img src="/static/allegation/img/story-main-5.png" alt />
              </div>
              <div className="col-sm-6 font-size-22">
                <p>
                  Methodology
                </p>
                <p>
                  The data compiled in this interactive platform are the result of three sets:
                </p>
                <p>
                  <a href>The “Moore” database</a>, which includes a partial list of police misconduct allegations from May 2002 – December 2008. <a href>The “Bond” database</a>, which includes a partial list of misconduct allegations from May 2001 – May 2006; and a complete list of misconduct allegations from March 2011 – September 2015, made public as a result of <a href>Freedom of Information Act request</a>.
                </p>
              </div>
            </div>
          </div>
          <div className="row section">
            <div className="container">
              <div className="col-sm-12" id="next-steps">
                <p>Next Steps</p>
                <p>
                  The Citizens Police Data Project has collected more than 56,000 unique complaints but what’s at stake could prove to be a tidal wave of hidden information. The Fraternal Order of Police union has intervened in the city’s decision to turn over complaint data from 1967, effectively blocking public inquiry into those allegations through a temporary injunction. The city has appealed the injunction, and the Invisible Institute has filed an amicus brief in support of the city's position.
                </p>
                <p>
                  If the union prevails, the bulk of police disciplinary records will be destroyed. However, if we win—and we expect to—the city will, in effect, shed light on Chicago’s entire disciplinary database for the last half century.
                </p>
              </div>
            </div>
          </div>
          <div className="row section">
            <div className="container">
              <div className="col-sm-12">
                <h1>
                  “If the union prevails, the bulk of police disciplinary records will be destroyed.”
                </h1>
              </div>
            </div>
          </div>
          <div className="row section font-size-19">
            <div className="container">
              <div className="col-sm-6">
                <img src="/static/allegation/img/finding-ad.png" alt />
                <p>
                  What has been found in the data so far?
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum malesuada ornare. Quisque magna elit, accumsan imperdiet mauris ac, sollicitudin mollis felis. Cras sed tellus nisl.
                </p>
                <a className="tab-navigate btn" tab-navigate="find-page">View the Findings</a>
              </div>
              <div className="col-sm-6">
                <img src="/static/allegation/img/data-ad.png" alt />
                <p>
                  Where does this data come from?
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum malesuada ornare. Quisque magna elit, accumsan imperdiet mauris ac, sollicitudin mollis felis.
                </p>
                <a href="/data" className="btn">See the database</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = StoryPage;
