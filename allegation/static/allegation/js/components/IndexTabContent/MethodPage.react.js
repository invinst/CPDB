var React = require('react');
var Link = require('react-router').Link;


var MethodPage = React.createClass({
  render: function () {
    return (
      <div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-12'>
              <h2 className='title'>Collaboration</h2>
              <p>
                This information presented in the Citizens Police Data Project was collected through
                Freedom of Information Act requests. We are working to create a resource for public oversight and input,
                and we welcome community collaboration.
              </p>
              <p>
                If you see an allegation you’d like to know more about, you can download a
                <a href='https://assets.documentcloud.org/documents/2510275/sample-foia-cpd-crs.pdf'>sample</a>
                request for the full Complaint Register file, fill in the missing information,
                and email the PDF to <a href='mailto:FOIA@chicagopolice.org'>FOIA@chicagopolice.org</a>.
                Before being released, each Complaint Register file must have all personal information for
                non-police officers redacted, by hand. We suggest you limit your request to fewer
                than five Complaint Register files, so as to not overwhelm the FOIA officer and delay your request.
              </p>
              <p>
                If you receive a response, you can contribute by forwarding the response you receive
                from the FOIA officer, including the original attachments. Reach us at
                <a href='mailto:records@invisibleinstitute.com'>records@invisibleinstitute.com</a>.
              </p>
            </div>
          </div>
        </div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-6'>
              <img src='/static/allegation/img/methodology.png' alt={ true } />
            </div>
            <div className='col-sm-6'>
              <h2 className='title'>
                How accurate is the data?
              </h2>
              <p>
                We believe that truly honest data can support powerful reforms, but we recognize
                the limits of our data. We publish the city’s records without alteration,
                except for minor typos and spelling errors. As we identify information needs and
                develop new sources, we also develop internal protocols for ensuring the integrity
                of the data we publish. This includes having lawyers and investigative journalists
                read and validate the data, cross referencing data against  other official sources,
                and filing new requests to correct data we suspect to be outdated or incorrect.
              </p>
            </div>
          </div>
        </div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-12'>
              <p>
                If you believe there is an error or problem with the data,
                <a href='http://goo.gl/forms/RHCPGdNhYw'>please report it</a> to us.
                We will verify that the website accurately reflects the data the city provided to us.
                We will also alert the city’s Freedom of Information officer to the potential mistake
                and ask them to provide us with an update if necessary.
              </p>
              <p>
                However, we will not modify the data set to reflect user-submitted corrections.
                We also cannot guarantee that all the data is accurate or current.
              </p>
            </div>
          </div>
        </div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-12'>
              <h2 className='title'>
                How current is the data?
              </h2>
              <p>
                We regularly request updates to our existing dataset from the city of Chicago.
                We are also collecting contextual documents about police misconduct, including settlements
                in civil suits and Chicago Police Board findings.
              </p>
              <p>
                In our data some investigations that we know to have concluded are still ‘open.’
              </p>
              <p>
                One example is a complaint filed against Officer Robert Drell, who was the subject of
                a misconduct allegation in May 2009. You can view the data we have under the
                <a href='http://cpdb.co/data/bZ5Y9L/allegations-of-police-misconduct-in-chicago'>CRID 1062099</a>.
                The Category, Finding, and Final Outcome of this allegation are “Unknown.”
                However, Officer Drell was suspended in October, 2014 and had a hearing in front of
                the Chicago Police Board in January, 2015.
                The Board <a href='https://www.documentcloud.org/documents/2510144-14pb2877-decision.html'>
                found him not guilty</a>, and Officer Drell was reinstated as an officer, with back-pay,
                on March 19, 2015.
              </p>
              <p>
                We discovered this discrepancy by matching CRID numbers from Chicago Police Board documents
                to allegations we have. We are certain there are other departures as well.
              </p>
            </div>
          </div>
        </div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-12'>
              <h2 className='title'>
                What are the “Bond” and “Moore” datasets, and how do they affect the data?
              </h2>
              <p>
                The
                <a href='https://www.documentcloud.org/documents/1237492-bond-list-of-662-police-officers.html'>
                  Bond data
                </a> was produced by the city of Chicago in
                <a href='http://www.gpo.gov/fdsys/pkg/USCOURTS-ilnd-1_04-cv-02617'>
                  Bond v. Utreas
                </a>, and includes the names of 662 Chicago police officers with
                more than ten misconduct complaints between May 2001 and May 2006.
                It only includes the names of officers, the CRID number, the length of the investigation,
                the outcome of the investigation, and any punishment served.
              </p>
              <p>
                The
                <a href='https://www.documentcloud.org/documents/1237391-moore-cc-list-1-120.html'>
                  Moore data
                </a> was produced by the city of Chicago in
                <a href='https://www.documentcloud.org/documents/2510218-documents-mx-final-motion-for-sanctions.html'>
                  Moore v. City of Chicago
                </a>, and includes the names of 185 Chicago police officers with
                more than five excessive force complaints from May 2002 to December 2008.
                It only includes the names and badge numbers of officers, the CRID number,
                the category of alleged misconduct, the outcome of the investigation, and any punishment served.
              </p>
              <p>
                Because the Bond and Moore data only includes officers who have a certain number of allegations,
                it slightly skews the related findings. We include the Bond and Moore data because this represents
                all the available data on police misconduct that the city of Chicago has released.
              </p>
              <p>
                To see the most controlled version of allegation data — i.e. data from 2011 to present —
                a means of removing the Bond and Moore datasets has been provided.
                In the <a href='http://cpdb.co/data/DwGpJD/allegations-of-police-misconduct-in-chicago'>
                search bar, type and click “FOIA.”</a>
              </p>
              <p>
                “FOIA” results only include the data we received for our most recent request,
                which are allegations of misconduct filed from 2011 to present.
              </p>
            </div>
          </div>
        </div>
        <div className='row section'>
          <div className='container'>
            <div className='col-sm-12'>
              <h2 className='title'>
                Terms of Use
              </h2>
              <p>
                The information contained on this website comes primarily from three datasets provided by
                the Chicago Police Department (CPD), spanning approximately 2002 to 2008 and 2011 to 2015.
                The CPD has released these lists in response to litigation and to FOIA requests.
              </p>
              <p>
                The city of Chicago’s release of this information was accompanied by a disclaimer
                that not all of the information contained in the city’s database may be completely accurate.
                No independent verification of the city’s records has taken place and this public database
                does not purport to be an accurate or timely reflection of either the city’s internal database
                or of its truthfulness.
              </p>
              <p>
                Slight changes to the spelling of officer names and to the wording of misconduct categories
                have been made to accommodate a consistent appearance. A glossary of our understanding of common
                CPD terms has been provided. No other editing of the city’s original datasets has taken place.
              </p>
              <p>
                This public database also contains other readily available data that has been linked to
                the city’s original datasets, including: CPD beat geographies, Chicago ward boundaries,
                Chicago neighborhood boundaries, et cetera.
              </p>
              <p>
                By entering this website, you acknowledge that the Invisible Institute is not responsible
                for any derivative work performed by or published by users of this public database.
                  The CPDB is for informational purposes only and is not intended to provide legal advice.
                Please consult with your own legal advisor before you take any action.
              </p>
            </div>
          </div>
        </div>
        <div className='row section font-size-19'>
          <div className='container'>
            <div className='col-sm-6'>
              <img src='/static/allegation/img/finding-ad.png' alt={ true } />
              <Link className='tab-navigate btn full-width' data-target='findings'
                to='/findings' onClick={ this.navigate }>
                Findings
              </Link>
            </div>
            <div className='col-sm-6'>
              <img src='/static/allegation/img/data-ad.png' alt={ true } />
              <Link className='btn full-width' data-target='data' to='/data' onClick={ this.navigate }>
                Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MethodPage;
