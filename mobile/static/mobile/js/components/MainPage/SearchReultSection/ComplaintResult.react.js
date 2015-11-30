var cx = require('classnames');
var React = require('react');

var Link = require('react-router').Link;
var ComplaintCard = require('components/Shared/ComplaintCard.react');


var ComplaintResult = React.createClass({
  render: function () {
    var classNames = cx('complaint-result', {'hidden': !this.props.visible});

    return (
      <div className={classNames}>
        <ul>
          <li className='complaint-result-item'>
            <Link to={'/complaint'} data-transition='slide-in'>
              <ComplaintCard />
            </Link>
          </li>
          <li className='complaint-result-item'>
            <ComplaintCard />
          </li>
          <li className='complaint-result-item'>
            <ComplaintCard />
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = ComplaintResult;
