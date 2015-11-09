var HOST = 'http://localhost:8000';
var React = require('react');

var Filters = require('components/DataToolPage/Filters.react');
var OfficerActions = require('actions/OfficerActions');
var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var CheckMark = require('components/DataToolPage/Officer/CheckMark.react');

var OfficerPresenter = require('presenters/OfficerPresenter');
var $ = require('jquery');
var pluralize = require('pluralize');
var StringUtil = require('utils/StringUtil');
var navigate = require('react-mini-router').navigate;

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
        <a className='officer-link' onClick={this._onClick.bind(this, officer)} target="_parent">
          <div className='officer_name'>
            <strong>
              <span>{officer.officer_first}</span>
              &nbsp;
              <span>{officer.officer_last}</span>
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
                <div className='hidden-xs hidden-sm hidden-md'>
                  <div className='col-md-6'>
                    <div>
                      complaints
                    </div>
                    <div>
                      {officer.allegations_count}
                    </div>
                  </div>
                  <div className='vertical-line'></div>
                  <div className='col-md-6 officer-disciplines'>
                    <div>
                      disciplines
                    </div>
                    <div>
                      {officer.discipline_count}
                    </div>
                  </div>
                </div>
                <div className='hidden-lg'>
                  <div className='col-xs-12'>
                    complaints {officer.allegations_count}
                  </div>
                  <div className='col-xs-12'>
                    disciplines {officer.discipline_count}
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

  _onClick: function(officer) {
    var presenter = OfficerPresenter(officer);
    var officerPageLink = '/officer/' + StringUtil.slugify(presenter.displayName) + '/' + officer.id;
    navigate(officerPageLink);
  }
});

module.exports = Officer;
