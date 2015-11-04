var _ = require('lodash');
var React = require('react');

var Base = require('components/Base.react');
var PercentageRectangleChart = require('components/DataToolPage/RaceGenderTab/PercentageRectangleChart.react');
var RaceGenderAPITransformation = require('utils/RaceGenderAPITransformation');
var RaceGenderTabStore = require('stores/DataToolPage/RaceGenderTab/RaceGenderTabStore');

var RaceGenderTab = React.createClass(_.assign(Base(RaceGenderTabStore), {
  componentDidMount: function() {
    RaceGenderTabStore.addChangeListener(this._onChange);
  },

  render: function () {
    var complaintRaces = _.get(this.state.data, 'complaining_witness.race', []);
    var complaintRacesData = RaceGenderAPITransformation.transformRaces(complaintRaces);

    var officerRaces = _.get(this.state.data, 'officers.race', []);
    var officerRacesData = RaceGenderAPITransformation.transformRaces(officerRaces);

    var complaintGenders = _.get(this.state.data, 'complaining_witness.gender', []);
    var complaintGendersData = RaceGenderAPITransformation.transformGenders(complaintGenders);

    var officerGenders = _.get(this.state.data, 'officers.gender', []);
    var officerGendersData = RaceGenderAPITransformation.transformGenders(officerGenders);

    var genderOptions = {
      colors: ['#003366', '#ff6633', '#669966'], // Female, Male, Trans
      width: 145,
      height: 155
    };

    var raceOptions = {
      colors: ['#ff6633', '#003366', '#669966', '#330066'], // White, Black, Hispanic, Others
      width: 145,
      height: 155
    };

    return (
      <div id='gender-race-tab'>
        <div className='content'>
          <div className='row'>
            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1'>
              <div className='col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <span className='chart-title'>Officer</span>
              </div>
              <div className='col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <span className='chart-title'>Complainant</span>
              </div>
            </div>
          </div>
          <div className='row'>

            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-md-offset-1'>
              <div className='officer-gender-chart col-lg-4 col-md-4 col-sm-3 col-xs-4 relative'>
                <span className='vertical-title'>Gender</span>
                <PercentageRectangleChart data={officerGendersData} options={genderOptions} filter='officer__gender' />
              </div>
              <div className='complaint-gender-chart col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <PercentageRectangleChart data={complaintGendersData} options={genderOptions} filter='complainant_gender' />
              </div>
            </div>
          </div>
          <div className='row'>

            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-md-offset-1'>
              <div className='officer-race-chart col-lg-4 col-md-4 col-sm-3 col-xs-4 relative'>
                <span className='vertical-title'>Race</span>
                <PercentageRectangleChart data={officerRacesData} options={raceOptions} filter='officer__race' />
              </div>
              <div className='complaint-race-chart col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <PercentageRectangleChart data={complaintRacesData} options={raceOptions} filter='complainant_race' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = RaceGenderTab;
