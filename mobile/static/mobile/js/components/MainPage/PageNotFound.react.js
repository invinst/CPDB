var cx = require('classnames');
var React = require('react');


var PageNotFound = React.createClass({
  render: function () {
    var classNames = cx('animation', 'pad', {'top-left': this.props.topLeft});

    return (
      <div id='page-not-found' className={ classNames }>
        <div className='page-not-found-header'>
          Sorry, page not found!
        </div>
        <div className='page-not-found-description'>
          <div>
            The link you entered isn’t recorded in our database. Please start a new search by entering in keywords below.
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PageNotFound;
