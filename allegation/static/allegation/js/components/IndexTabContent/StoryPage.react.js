var React = require('react');
var Link = require('react-router').Link;


var StoryPage = React.createClass({
  render: function () {
    return (
      <div>
        <div className="row section single-img" id="stateway">
          <div className="container">
            <div className="col-sm-12">
              <img src="/static/allegation/img/story-main-3.png" alt={ true } />
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
              <img src="/static/allegation/img/story-main-1.png" alt={ true } />
              <img src="/static/allegation/img/dianebond2.jpg" alt={ true } />
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
              <img src="/static/allegation/img/UCPD-1.jpg" alt={ true } />
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
              <Link className="pointer tab-navigate" data-target="findings" to="/findings" onClick={ this.navigate }><img src="/static/allegation/img/finding-ad.png" alt={ true } /></Link>
              <Link className="tab-navigate btn full-width" data-target="findings" to="/findings" onClick={ this.navigate }>Findings</Link>
            </div>
            <div className="col-sm-6">
              <Link data-target="data" to="/data" onClick={ this.navigate }><img src="/static/allegation/img/data-ad.png" alt={ true } /></Link>
              <Link className="btn full-width" data-target="data" to="/data" onClick={ this.navigate }>Data</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = StoryPage;
