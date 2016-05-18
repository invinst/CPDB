var React = require('react');


var TickIcon = React.createClass({

  render: function () {
    return (
      <svg x='0px' y='0px' width='42px' height='42px' viewBox='0 0 42 42' enableBackground='new 0 0 42 42'>
        <path fill='#1474DD' d='M21,1C9.954,1,1,9.954,1,21c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20C41,9.954,
          32.046,1,21,1zM19.837,30.953c-0.586,0.586-1.354,0.879-2.121,
          0.879s-1.535-0.293-2.121-0.879l-7.292-7.292l4.242-4.242l5.171,5.17L29.455,12.85l4.242,4.242L19.837,30.953z' />
      </svg>
    );
  }
});

module.exports = TickIcon;
