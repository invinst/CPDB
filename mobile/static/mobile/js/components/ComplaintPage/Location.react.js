var cx = require('classnames');
var React = require('react');

var Map = require('components/ComplaintPage/Location/Map.react');
var ComplaintService = require('services/ComplaintService');
var ComplaintPresenter= require('presenters/ComplaintPresenter');
var Wrapper = require('components/Shared/Wrapper.react');


var Location = React.createClass({
  renderLocationInfoItem: function (label, data) {
    return (
        <Wrapper visible={!!data}>
          <label>{label} </label>
          <span>{data}</span>
        </Wrapper>
      );
  },

  render: function () {
    var info = this.props.info;
    var complaintService = ComplaintService(info);
    var presenter = ComplaintPresenter(info);

    var locationDetailClassNames = cx('location-detail pad', {
      'no-data': complaintService.hasNoData
    });

    return (
      <Wrapper wrapperClass='location' visible={complaintService.hasLocation}>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className={locationDetailClassNames}>
          <div className='bold'>{presenter.address}</div>
          {this.renderLocationInfoItem('Beat', presenter.beat)}
          {this.renderLocationInfoItem('Location type', presenter.locationType)}
          {this.renderLocationInfoItem('City', presenter.city)}
        </div>
        <Wrapper wrapperClass='location-map pad' visible={info.point}>
          <Map info={info}/>
        </Wrapper>
      </Wrapper>
    );
  }
});

module.exports = Location;
