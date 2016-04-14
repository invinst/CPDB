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
    // FIXME: Make this component to be more general that we could use it in better way later
    var officerClassname = HelperUtil.format('officer-{id}', {'id': this.props.officerId});
    var classNames = cx('officer-card pad', officerClassname);
    var circleClassNames = cx('circle', OfficerUtil.getColorLevelClass('circle', this.props.allegationsCount));

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
