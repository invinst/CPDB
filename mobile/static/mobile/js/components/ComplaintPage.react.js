var React = require('react');


var ComplaintPage = React.createClass({
  render: function () {
    return (
      <div>
        Complaint page
        <div>
          <OfficerList />
        </div>
      </div>
    )
  }
});

module.exports = ComplaintPage;
