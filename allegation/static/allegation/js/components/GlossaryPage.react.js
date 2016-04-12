var React = require('react');
var PropTypes = React.PropTypes;

var GlossaryTableSection = require('components/Wagtail/GlossaryTableSection.react');


var GlossaryPage = React.createClass({
  propTypes: {
    page: PropTypes.object
  },

  render: function () {
    return (
      <div className='glossary-page container-fluid'>
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <h2 className='glossary-title'>{ this.props.page.title }</h2>
            <p className='glossary-subtitle'>{ this.props.page.subtitle }</p>
            <GlossaryTableSection rows={ this.props.page['serialized_glossary_rows'] } />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <img src='/static/allegation/img/complaint-flowchart-1.png' className='img-responsive'/>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-10  col-sm-offset-1'>
            <img src='/static/allegation/img/complaint-flowchart-2.png' className='img-responsive'/>
          </div>
        </div>
      </div>
    );
  }
});

GlossaryPage.TYPE = 'wagtail_app.GlossaryPage';

module.exports = GlossaryPage;
