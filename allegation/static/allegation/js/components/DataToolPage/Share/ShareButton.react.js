var React = require('react');

var classnames = require('classnames');

var ShareBar = require('components/DataToolPage/Share/ShareBar.react');


var ShareButton = React.createClass({
  getInitialState: function () {
    return {
      active: false
    };
  },

  toggleActive: function () {
    this.setState({active: !this.state.active});
  },

  render: function () {
    var shareButtonClassNames = classnames('share-button', 'pull-left', {
      active: this.state.active
    });

    return (
      <div className={ shareButtonClassNames }>
        <button onClick={ this.toggleActive }>
          { this.state.active
            ? <i className='fa fa-times'></i>
            : <i className='fa fa-share'></i> }
          <span> Share</span>
        </button>
        { this.state.active ? <ShareBar/> : null }
      </div>
    );
  }
});

module.exports = ShareButton;
