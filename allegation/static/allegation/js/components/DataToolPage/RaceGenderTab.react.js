var _ = require('lodash');
var jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Base = require('components/Base.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var PercentageRectangleChart = require('components/DataToolPage/RaceGenderTab/PercentageRectangleChart.react');

var RaceGenderTabStore = require('stores/DataToolPage/RaceGenderTab/RaceGenderTabStore');

var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');
var RaceGenderAPITransformation = require('utils/RaceGenderAPITransformation');


var RaceGenderTab = React.createClass(_.assign(Base(RaceGenderTabStore), {
  mixins: [EmbedMixin],

  componentDidMount: function() {
    RaceGenderTabStore.addChangeListener(this._onChange);
    this.initTabs();
  },

  initTabs: function () {
    if (this.props.tabs) {
      this.props.tabs.tabs.push(this);
    }
  },

  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = jQuery(node).width();
    var height = jQuery(node).height();
    var src = "/embed/?page=race-gender&query=" + encodeURIComponent(AllegationFilterTagsQueryBuilder.buildQuery());
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  render: function () {
    var complaintRaces = _.get(this.state.data, 'complaining_witness.race', []);
    var complaintRacesData = RaceGenderAPITransformation.transformRaces(complaintRaces, false);

    var officerRaces = _.get(this.state.data, 'officers.race', []);
    var officerRacesData = RaceGenderAPITransformation.transformRaces(officerRaces, true);

    var complaintGenders = _.get(this.state.data, 'complaining_witness.gender', []);
    var complaintGendersData = RaceGenderAPITransformation.transformGenders(complaintGenders, false);

    var officerGenders = _.get(this.state.data, 'officers.gender', []);
    var officerGendersData = RaceGenderAPITransformation.transformGenders(officerGenders, true);

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

     if (complaintRacesData.length == 0 && officerRacesData.length == 0 && complaintGendersData.length == 0 && officerGendersData.length == 0) {
       return (
         <div id='gender-race-tab'>
             <div className='row'>
                <div className="alert alert-info col-md-6 col-md-offset-3">No Race &amp; Gender data available for the current search</div>
             </div>
         </div>
        )
     }

    return (
      <div id='gender-race-tab' className='clearfix'>
        <div className='col-lg-12 col-md-12 content'>
          <div className='row'>
            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-offset-1'>
              <div className='col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <span className='chart-title'>Race</span>
              </div>
              <div className='col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <span className='chart-title'>Gender</span>
              </div>
            </div>
          </div>
          <div className='row'>

            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-md-offset-1'>
              <div className='complaint-race-chart col-lg-4 col-md-4 col-sm-3 col-xs-4 relative'>
                <span className='vertical-title'>Complainant</span>
                <PercentageRectangleChart data={complaintRacesData} options={raceOptions} filter='complainant_race' category='Complainant Race' />
              </div>
              <div className='complaint-gender-chart col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <PercentageRectangleChart data={complaintGendersData} options={genderOptions} filter='complainant_gender' category='Complainant Gender' />
              </div>
            </div>
          </div>
          <div className='row'>

            <div className='col-lg-10 col-md-11 col-sm-10 col-xs-0 col-md-offset-1'>
              <div className='officer-race-chart col-lg-4 col-md-4 col-sm-3 col-xs-4 relative'>
                <span className='vertical-title'>Officer</span>
                <PercentageRectangleChart data={officerRacesData} options={raceOptions} filter='officer__race' category='Officer Race' />
              </div>
              <div className='officer-gender-chart col-lg-4 col-md-4 col-sm-3 col-xs-4'>
                <PercentageRectangleChart data={officerGendersData} options={genderOptions} filter='officer__gender' category='Officer Gender' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = RaceGenderTab;
