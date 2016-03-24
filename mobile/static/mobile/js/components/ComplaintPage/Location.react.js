var React = require('react');

var u = require('utils/HelperUtil');

var AllegationPresenter = require('presenters/AllegationPresenter');
var Map = require('components/ComplaintPage/Location/Map.react');
var Wrapper = require('components/Shared/Wrapper.react');


var Location = React.createClass({
  propTypes: {
    allegation: React.PropTypes.object
  },

  renderLocationInfoItem: function (label, data) {
    return (
      <Wrapper visible={ !!data }>
        <label>{ label } </label>
        <span>{ data }</span>
      </Wrapper>
    );
  },

  render: function () {
    var allegation = this.props.allegation;
    var presenter = AllegationPresenter(allegation);
    var point = u.fetch(allegation, 'point', '');

    return (
      <Wrapper wrapperClass='location' visible={ presenter.hasLocation }>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className='location-detail pad'>
          <div className='bold'>{ presenter.address }</div>
          { this.renderLocationInfoItem('Beat', presenter.beat) }
          { this.renderLocationInfoItem('Location type', presenter.locationType) }
          { this.renderLocationInfoItem('City', presenter.city) }
        </div>
        <Wrapper wrapperClass='location-map pad' visible={ !!point }>
          <Map allegation={ allegation }/>
        </Wrapper>
      </Wrapper>
    );
  }
});

module.exports = Location;
