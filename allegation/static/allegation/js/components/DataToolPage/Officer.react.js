var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var classnames = require('classnames');
var pluralize = require('pluralize');
var _ = require('lodash');

var OfficerMixin = require('components/DataToolPage/Officer/OfficerMixin.react');
var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var CheckMark = require('components/DataToolPage/Officer/CheckMark.react');
var Counter = require('components/DataToolPage/Counter.react');
var OfficerPresenter = require('presenters/OfficerPresenter');
var jQuery = require('utils/jQuery');
var S = require('string');


var Officer = React.createClass({
  propTypes: {
    filtered: PropTypes.string,
    officer: PropTypes.object,
    active: PropTypes.bool,
    selected: PropTypes.bool,
    noClick: PropTypes.bool,
    witness: PropTypes.bool,
    intersection: PropTypes.number,
    page: PropTypes.string,
    embed: PropTypes.bool
  },

  mixins: [OfficerMixin, EmbedMixin],

  getInitialState: function () {
    return {
      'selected': false
    };
  },

  componentDidMount: function () {
    this.copyEmbed();
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  },

  componentDidUpdate: function () {
    this.copyEmbed();
  },

  // embedding
  getEmbedCode: function () {
    var src = '/embed/?page=officer-card&pk=' + encodeURIComponent(this.props.officer.id);
    return '<iframe width="170px" height="110px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  getOfficerComplaintDiscipline: function (officer) {
    var complaintDisciplineRowClass = classnames('complaint-discipline-row', {
      'filter-on': this.props.filtered
    });

    return (
      <div className={ complaintDisciplineRowClass }>
        <div className='row'>
          <div className='col-xs-12 border-top-row' />
          <div>
            <div className='col-xs-7'>
              <div>disciplines</div>
              <div>complaints</div>
            </div>
            <div className='col-xs-3 officer-complaints-disciplines'>
              <div>{ officer.discipline_count }</div>
              { this.renderAllegationsCount(officer) }
            </div>
          </div>
        </div>
      </div>
    );
  },

  copyEmbed: function () {
    jQuery(ReactDOM.findDOMNode(this)).find('.embed').each(function () {
      var client = new ZeroClipboard(this);
      var that = this;
      client.on( 'ready', function ( readyEvent ) {
        client.on('aftercopy', function () {
          var inner = jQuery(that).find('.tooltip-inner');
          var text = inner.text();
          inner.text('Copied');
          setTimeout(function () {
            inner.text(text);
          }, 1000);
        });
      });
    });
  },

  officerLink: function (officer) {
    var presenter = OfficerPresenter(officer);
    return '/officer/' + S(presenter.displayName).slugify().s + '/' + officer.id;
  },

  renderAllegationsCount: function (officer) {
    if (this.props.filtered) {
      return (
        <div>
          <Counter to={ officer.filtered_allegations_count } />
        </div>
      );
    } else {
      return (
        <div>{ officer.allegations_count }</div>
      );
    }
  },

  render: function () {
    var officer = this.props.officer;
    if (!officer) {
      return <div></div>;
    }
    var className = classnames('officer ' + this.getAvgClass(), {
      'active': this.props.active,
      'selected': this.props.selected,
      'has-intersection': ('intersection' in this.props)
    });

    var selectionState = '';
    if (this.props.active) {
      className += ' active';
      selectionState = 'selected';
    }

    if (this.props.selected) {
      className += ' selected';
      selectionState = 'selected';
    }

    var officerId = 'officer_' + officer.id;
    var presenter = OfficerPresenter(officer);
    var intersection = '';
    var intersectionClass = '';
    if ('intersection' in this.props) {
      intersection = this.props.witness ? 'Witness in ' : ' Co-accused in ';
      intersection += pluralize('case', this.props.intersection, true);
      intersectionClass = 'intersection';
      className += ' has-intersection';
    }

    return (
      <div className={ className } data-state={ selectionState } id={ officerId }>
        <Link className='officer-link' to={ this.officerLink(officer) }>
          <div className='officer_name'>
            <span>
              <span>{ officer.officer_first }</span>
              &nbsp;
              <span>{ officer.officer_last }</span>
            </span>
          </div>
          <div className={ intersectionClass }>
            <div className='row'>
              <div className='col-xs-12'>{ intersection }</div>
            </div>
          </div>
          <div className='non-intersection'>
            <div className='race-gender'>
              { presenter.genderRace }
            </div>
            { this.getOfficerComplaintDiscipline(officer) }
          </div>
        </Link>
        <CheckMark
          clickable={ !this.props.noClick }
          officer={ officer }
          page={ this.props.page }
          embed={ this.props.embed } />
      </div>
    );
  }
});

module.exports = Officer;
