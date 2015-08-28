var HOST = 'http://localhost:8000';
var React = require('react');

var Filters = require('./Filters.react');
var OfficerActions = require('../actions/OfficerActions');
var OfficerMixin = require('./Officer/OfficerMixin.react');
var EmbedMixin = require('./Embed/Mixin.react');

var OfficerPresenter = require('../presenters/OfficerPresenter');

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

    var node = this.getDOMNode();
    this.width = $(node).width();
    this.height = $(node).height();
  },

  componentDidUpdate: function () {
    this.copyEmbed();
  },

  onMouseDown: function(e) {
    $(e.currentTarget).addClass('no-box-shadow')
  },

  onMouseUp: function(e) {
    $(e.currentTarget).removeClass('no-box-shadow')
  },

  // embedding
  getEmbedCode: function () {
    var src = "/embed/?page=officers&pk=" + encodeURIComponent(this.props.officer.id);
    return '<iframe width="' + this.width + 'px" height="' + this.height + 'px" frameborder="0" src="' + this.absoluteUri(src)
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

    var selectableArea = "";
    if (!this.props.noClick) {
      selectableArea = (
        <div onClick={this.onClick} className='checkmark cursor'>
          <i className='fa fa-check'></i>
        </div>
      );
    }

    if (this.props.embed) {
      selectableArea = (
        <div data-clipboard-text={this.getEmbedCode()} className='checkmark embed cursor'
             aria-label="Copy to clipboard" data-copied-hint="Copied!">
          <i className='fa fa-code'></i>
          <div className="tooltip bottom" role="tooltip">
            <div className="tooltip-arrow"></div>
            <div className="tooltip-inner">
              Click to copy
            </div>
          </div>
        </div>
      );
    }

    var officerLink = officer.absolute_url;
    var officerId = 'officer_' + officer.id;
    var presenter = OfficerPresenter(officer);

    return (
      <div className={className} data-state={selection_state} id={officerId} onMouseDown={this.onMouseDown}
           onMouseUp={this.onMouseUp}>
        <a className='officer-link' href={officerLink} target="_parent">
          <div className='officer_name'>
            <strong>
              { presenter.displayName() }
            </strong>
          </div>
          <div className='race-gender'>
            { presenter.genderRace() }
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
        </a>
        {selectableArea}
      </div>
    );

  },
  onClick: function () {
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);
    OfficerActions.setActiveOfficer(officer);
    ga('send', 'event', 'officer', 'filter-by', presenter.displayName());
  }
});

module.exports = Officer;
