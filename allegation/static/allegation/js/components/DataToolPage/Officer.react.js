var React = require('react');
var ReactRouter = require('react-router');
var History = require('history');
var classnames = require('classnames');
var pluralize = require('pluralize');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

var OfficerActions = require('actions/OfficerActions');
var Filters = require('components/DataToolPage/Filters.react');
var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var CheckMark = require('components/DataToolPage/Officer/CheckMark.react');
var OfficerPresenter = require('presenters/OfficerPresenter');
var jQuery = require('utils/jQuery');
var StringUtil = require('utils/StringUtil');



var Officer = React.createClass({
  mixins: [OfficerMixin, EmbedMixin],

  getInitialState: function () {
    return {
      'selected': false
    }
  },

  copyEmbed: function () {
    jQuery(this.getDOMNode()).find(".embed").each(function () {
      var client = new ZeroClipboard(this);
      var that = this;
      client.on( "ready", function( readyEvent ) {
        client.on("aftercopy", function () {
          var inner = jQuery(that).find(".tooltip-inner");
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
        <Link className='officer-link' to={this.officerLink(officer)}>
          <div className='officer_name'>
            <span>
              <span>{officer.officer_first}</span>
              &nbsp;
              <span>{officer.officer_last}</span>
            </span>
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
                <div className="col-xs-12 border-top-row" />
                <div>
                  <div className='col-xs-7'>
                    <div>complaints</div>
                    <div>disciplines</div>
                  </div>
                  <div className='col-xs-3 officer-complaints-disciplines'>
                    <div>{officer.allegations_count}</div>
                    <div>{officer.discipline_count}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
        <CheckMark clickable={!this.props.noClick} officer={officer} page={this.props.page}/>
      </div>
    );
  },

  officerLink: function (officer) {
    var presenter = OfficerPresenter(officer);
    return '/officer/' + StringUtil.slugify(presenter.displayName) + '/' + officer.id;
  }
});

module.exports = Officer;
