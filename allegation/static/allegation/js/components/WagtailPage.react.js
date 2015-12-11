var _ = require('lodash');
var React = require('react');
var classnames = require('classnames');

var AppStore = require('stores/AppStore');
var AppConstants = require('constants/AppConstants');
var Base = require('components/Base.react');


var WagtailPage = React.createClass(_.assign(Base(AppStore), {
  renderRows: function () {
    var body = this.props.body;

    return body.map(function (row) {

      var rowContent = row.value.map(function (col) {
        var colClassName = classnames({
          'col-md-6': col.type == 'half_paragraph',
          'col-md-12': col.type == 'full_paragraph'
        });

        return (
          <div className={colClassName} dangerouslySetInnerHTML={{ __html: col.value }} />
        );
      });

      return (
        <div className="row section">
          <div className="container">
            {rowContent}
          </div>
        </div>
      );
    });
  },

  render: function () {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  },
}));

module.exports = WagtailPage;
