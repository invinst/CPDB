var React = require('react');
var cx = require('classnames');

var HelperUtil = require('utils/HelperUtil');
var OfficerUtil = require('utils/OfficerUtil');


var OfficerCard = React.createClass({
  propTypes: {
    officerId: React.PropTypes.string,
    allegationsCount: React.PropTypes.number,
    displayName: React.PropTypes.string,
    description: React.PropTypes.string
  },

  render: function () {
    var officerClassname = HelperUtil.format('officer-{id}', {'id': this.props.officerId});
    var classNames = cx('officer-card pad', officerClassname);
    var circleClassNames = cx('circle', OfficerUtil.getStarClass(this.props.allegationsCount));

    return (
      <div className={ classNames }>
        <div className='row'>
          <div className='one column circle-wrapper center'>
            <div className={ circleClassNames }></div>
          </div>
          <div className='eleven columns'>
            <div className='officer'>
              <div className='name bold'>{ this.props.displayName }</div>
              <div className='description'>{ this.props.description }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OfficerCard;
