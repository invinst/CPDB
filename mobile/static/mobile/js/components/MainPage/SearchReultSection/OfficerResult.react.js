var cx = require('classnames');
var React = require('react');

var OfficerResult =  React.createClass({
  render: function(){
    var classNames = cx({'hidden': !this.props.visible });

    return  (
      <div id='officer-result' className={classNames}>
        <ul className="table-view">
          <li className="table-view-cell" >
            <a>
              <div className='officer-result-item'>
                <div className='bold'>John Angelopoulos</div>
                <span>Female Native American</span>
              </div>
            </a>
          </li>
          <li className="table-view-cell">
            <a>
              <div className='officer-result-item'>
                <div className='bold'>John Angelopoulos</div>
                <span>Female Native American</span>
              </div>
            </a>
          </li>
          <li className="table-view-cell">
            <a>
              <div className='officer-result-item'>
                <div className='bold'>John Angelopoulos</div>
                <span>Female Native American</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = OfficerResult;
