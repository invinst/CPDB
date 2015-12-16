var cx = require('classnames');
var React = require('react');

var HelperUtil = require('utils/HelperUtil');
var Map = require('components/ComplaintPage/Map.react');
var ComplaintService = require('services/ComplaintService');
var ComplaintPresenter= require('presenters/ComplaintPresenter');

var Location = React.createClass({
  renderLocationInfoItem: function (label, data) {
    if (!data) {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          <label>{label} </label>
          <span>{data}</span>
        </div>
      )
    }
  },

  render: function () {
    var info = this.props.info;
    var complaintService = ComplaintService(info);
    var presenter = ComplaintPresenter(info);

    if (!complaintService.hasLocation) {
      return (<div></div>);
    }

    var noData = !presenter.locationType && !presenter.beat && !presenter.city
      && !presenter.address;

    var locationDetailClassNames = cx('location-detail pad', {
      'no-data': noData
    });

    return (
      <div className='location'>
        <div className='section-header bold'>
          <div className='section-title pad'>Location</div>
        </div>
        <div className={locationDetailClassNames}>
          <div className='bold'>{presenter.address}</div>
          {this.renderLocationInfoItem('Beat', presenter.beat)}
          {this.renderLocationInfoItem('Location type', presenter.locationType)}
          {this.renderLocationInfoItem('City', presenter.city)}
        </div>
        <div className='location-map pad'>
          <Map info={info}/>
        </div>
      </div>
    )
  }
});

module.exports = Location;
