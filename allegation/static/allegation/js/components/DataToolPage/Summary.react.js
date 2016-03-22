var _ = require('lodash');
var React = require('react');
var PropTypes = React.PropTypes;
var ReactDOM = require('react-dom');

var ExtraInformation = require('components/DataToolPage/SummarySection/ExtraInformation.react');
var SummaryRow = require('components/DataToolPage/SummaryRow.react');
var SummaryChildRow = require('components/DataToolPage/SummaryChildRow.react');
var SummaryStore = require('stores/SummaryStore');
var FilterTagStore = require('stores/FilterTagStore');
var EmbedMixin = require('./Embed/Mixin.react');
var AllegationFilterTagsQueryBuilder = require('utils/querybuilders/AllegationFilterTagsQueryBuilder');
var EMBED_QUERY_IGNORE_FILTERS = ['Allegation type', 'Category'];


var Summary = React.createClass({
  propTypes: {
    query: PropTypes.string,
    tabs: PropTypes.object,
    currentActive: PropTypes.bool,
    pushTab: PropTypes.func
  },

  mixins: [EmbedMixin],

  getDefaultProps: function () {
    return {
      pushTab: function () {}
    };
  },

  getInitialState: function () {
    return SummaryStore.init(this.props.query);
  },

  // end embedding
  componentDidMount: function () {
    var that = $(ReactDOM.findDOMNode(this));
    var height = that.parent().height();

    SummaryStore.addChangeListener(this._onChange);
    SummaryStore.addSummaryListener(this._changeView);

    setTimeout(function () {
      that.find('.child-rows').css('max-height', height);
    }, 1000);

    this.props.pushTab(this);
  },
  componentWillUnmount: function () {
    SummaryStore.removeChangeListener(this._onChange);
    SummaryStore.removeSummaryListener(this._changeView);
  },

  // embedding
  getEmbedCode: function () {
    var node = ReactDOM.findDOMNode(this);
    var width = $(node).width();
    var height = $(node).height();
    var src = '/embed/?page=summary&query=' + encodeURIComponent(
      AllegationFilterTagsQueryBuilder.buildQuery(EMBED_QUERY_IGNORE_FILTERS)
    );

    var cats = _.union([], FilterTagStore.getAll('Allegation type'), FilterTagStore.getAll('Category'));
    var selectedCategories = _.pluck(cats, 'value');

    var state = {
      selectedCategories: selectedCategories,
      currentActive: SummaryStore.getCurrentActive()
    };
    src += '&state=' + this.stateToString(state);
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  _changeView: function () {
    this.setState(SummaryStore.getAll());
  },
  _onChange: function () {
    this.setState(SummaryStore.getAll());
  },
  containerClick: function (e) {
    $('#summary').addClass('selected');
  },
  render: function () {
    var i,
      j,
      rows = [],
      childRows = [],
      category,
      isCurrentActive,
      childRowGroup,
      subcategory,
      id,
      className;

    for (i = 0; i < this.state.rows.length; i++) {
      category = this.state.rows[i];
      category.tagValue = {
        text: category.name,
        value: ['cat__category', category.name]
      };
      isCurrentActive = (
        category.name == SummaryStore.getCurrentActive()
      );
      rows.push(<SummaryRow key={ i } category={ category } isCurrentActive={ isCurrentActive } summary={ this }/>);
    }

    childRowGroup = [];
    for (j = 0; j < this.state.rows.length; j++) {
      category = this.state.rows[j];
      for (i = 0; i < category.subcategories.length; i++) {
        subcategory = category.subcategories[i];
        subcategory.tagValue = {
          text: subcategory.name,
          value: ['cat__cat_id', subcategory.cat_id]
        };
        childRows.push(
          <SummaryChildRow category={ category } key={ subcategory.id }
            subcategory={ subcategory } summary={ this }/>
        );
      }
      id = 'child-rows-' + category.id;
      childRowGroup.push(
        <div className='child-rows' id={ id } key={ id }>
          { childRows }
        </div>
      );
      childRows = [];
    }
    className = this.props.currentActive ? 'selected' : '';
    return (
      <div id='summary-container' onClick={ this.containerClick }>
        <div id='summary' className={ className }>
          <div className='row'>
            <div className='col-md-8 col-xs-8'>{ rows }</div>
            <div className='col-md-4 col-xs-4 child-row-wrapper'>
              <div className='child-row-container'>{ childRowGroup }</div>
            </div>
            <ExtraInformation />
          </div>
          <div className='row'>
            <div className='col-md-12'>
            </div>
          </div>
        </div>
      </div>
    );

  }
});

module.exports = Summary;
