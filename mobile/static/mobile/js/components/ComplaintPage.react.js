var React = require('react');

var About = require('components/Shared/About.react');
var ComplaintDetail = require('components/ComplaintPage/ComplaintDetail.react');
var ComplainingWitness = require('components/ComplaintPage/ComplainingWitness.react');
var OfficerInvolved = require('components/ComplaintPage/OfficerInvolved.react');
var InvestigatorSection = require('components/ComplaintPage/InvestigatorSection.react');
var InvestigationTimeline = require('components/ComplaintPage/InvestigationTimeline.react');
var Logo = require('components/Shared/Logo.react');
var Location = require('components/ComplaintPage/Location.react');
var PoliceWitnesses = require('components/ComplaintPage/PoliceWitnesses.react');
var SearchBar = require('components/Shared/SearchBar.react');


var ComplaintPage = React.createClass({
  getInitialState: function () {
    // TODO: Should have a presenter for this one
    return {
      'complaint': {
        'complaining_witness': [
          {
            'gender': 'Male',
            'race': 'White',
            'age': 46
          },
          {
            'gender': 'Female',
            'race': 'Black',
            'age': 46
          }
        ],
        'info': {
          'id': 11594,
          'crid': '1061421',
          'cat': {
            'allegation_name': 'Indebtedness To City',
            'category': 'Conduct Unbecoming (Off-duty)'
          },
          'start_date': '2013-04-12',
          'incident_date': '2013-04-12T00:00:00Z',
          'end_date': '2014-10-22',
          'final_finding': 'Exonerated',
          'final_outcome_class': 'disciplined',
          'investigator': {
            'name': 'Larry Snelling',
            'complaint_count': 1,
            'discipline_count': 1,
            'current_rank': 'SERGEANT OF POLICE'
          },
          'beat': null,
          'location': 'XX',
          'add1': null,
          'add2': null,
          'city': 'Chicago, IL'
        }
      }
    }
  },

  render: function () {
    var complaint = this.state.complaint;
    var info = complaint.info;
    var complaining_witness = complaint.complaining_witness;

    return (
      <div className='complaint-page'>
        <div className='content'>
          <SearchBar />
          <div className='main-content'>
            <ComplaintDetail info={info} />
            <InvestigationTimeline start_date={info.start_date} end_date={info.end_date}
                                   incident_date={info.incident_date}/>
            <ComplainingWitness complaining_witness={complaining_witness}/>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ComplaintPage;
