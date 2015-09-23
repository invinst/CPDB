var HOST = 'http://localhost:8000';
var React = require('react');

var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var OfficerMixin = require('./Officer/OfficerMixin.react');
var EmbedMixin = require('./Embed/Mixin.react');
var CheckMark = require('./Officer/CheckMark.react');

var OfficerPresenter = require('../presenters/OfficerPresenter');

var pluralize = require('pluralize');

var Officer = React.createClass({
  mixins: [OfficerMixin, EmbedMixin],

  getInitialState: function () {
    return {
      'selected': false
    }
  },

  copyEmbed: function () {
    $(this.getDOMNode()).find(".embed").each(function () {
      var client = new ZeroClipboard(this);
      var that = this;
      client.on( "ready", function( readyEvent ) {
        client.on("aftercopy", function () {
          var inner = $(that).find(".tooltip-inner");
          var text = inner.text();
          inner.text("Copied");
          setTimeout(function() {
            inner.text(text);
          }, 1000);
        });
      });
    });
  },

  componentDidMount: function () {
    this.copyEmbed();
  },

  componentDidUpdate: function () {
    this.copyEmbed();
  },

  // embedding
  getEmbedCode: function () {
    var src = "/embed/?page=officer-card&pk=" + encodeURIComponent(this.props.officer.id);
    return '<iframe width="170px" height="110px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  render: function () {
    var officer = this.props.officer;
    if (!officer) {
      return <div></div>
    }
    var className = 'officer ' + this.getAvgClass();

    var selection_state = '';
    if (this.props.active) {
      className += " active";
      selection_state = 'selected';
    }

    if (this.props.selected) {
      className += " selected";
      selection_state = 'selected';
    }

    var officerLink = officer.absolute_url;
    var officerId = 'officer_' + officer.id;
    var presenter = OfficerPresenter(officer);
    var intersection = "";
    var intersectionClass = "";
    if ('intersection' in this.props) {
      intersection = this.props.witness ? 'Witness in ' : " Co-accused in ";
      intersection += pluralize('case', this.props.intersection, true);
      intersectionClass = 'intersection';
      className += ' has-intersection'
    }

    return (
      <div className={className}  data-state={selection_state} id={officerId}>
        <a className='officer-link' href={officerLink} target="_parent">
          <div className='officer_name'>
            <strong>
              { presenter.displayName }
            </strong>
          </div>
          <div className={intersectionClass}>
            <div className='row'>
              <div className='col-xs-12'>{intersection}</div>
            </div>
          </div>
          <div className='non-intersection'>
            <div className='race-gender'>
              { presenter.genderRace }
            </div>
            <div className='complaint-discipline-row'>
              <div className='row'>
                <div className='col-xs-6'>
                  <div className=''>
                    complaints
                  </div>
                  <div className=''>
                    {officer.allegations_count}
                  </div>
                </div>
                <div className='vertical-line'></div>
                <div className='col-xs-6 officer-disciplines'>
                  <div className=''>
                    disciplines
                  </div>
                  <div className=''>
                    {officer.discipline_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
        <CheckMark clickable={!this.props.noClick} officer={officer} page={this.props.page}/>
      </div>
    );
  },

});

module.exports = Officer;
