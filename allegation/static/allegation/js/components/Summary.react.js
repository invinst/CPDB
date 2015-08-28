var HOST = 'http://localhost:8000';
var React = require('react');
var Filters = require('./Filters.react');
var SummaryActions = require('../actions/SummaryActions');
var SummaryRow = require("./SummaryRow.react");
var SummaryChildRow = require("./SummaryChildRow.react");
var EmbedMixin = require('./Embed/Mixin.react');
var SummaryStore = require("../stores/SummaryStore");
var FilterStore = require("../stores/FilterStore");
var ExtraInformation = require('./SummarySection/ExtraInformation.react');


var Summary = React.createClass({
  mixins: [EmbedMixin],

  getInitialState: function () {
    return SummaryStore.init(this.props.query);
  },

  // embedding
  getEmbedCode: function () {
    var node = this.getDOMNode();
    var width = $(node).width();
    var height = $(node).height();
    var src = "/embed/?page=summary&query=" + encodeURIComponent(FilterStore.getQueryString());
    return '<iframe width="' + width + 'px" height="' + height + 'px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },
  // end embedding

  componentDidMount: function () {
    SummaryStore.addChangeListener(this._onChange);
    SummaryStore.addSummaryListener(this._changeView);

    var that = $(this.getDOMNode());
    var height = that.parent().height();
    setTimeout(function () {
      that.find(".child-rows").css('max-height', height);
    }, 1000);

    if (this.props.tabs) {
      this.props.tabs.tabs.push(this);
    }
  },

  render: function () {
    var i,
      j,
      rows = [],
      childRows = [],
      category;
    for (i = 0; i < this.state.rows.length; i++) {
      category = this.state.rows[i];
      category.tagValue = {
        text: category.name,
        value: ['cat__category', category.name]
      };
      var isCurrentActive = category.name == SummaryStore.getCurrentActive();
      rows.push(<SummaryRow key={i} category={category} isCurrentActive={isCurrentActive}/>);
    }

    var childRowGroup = [];
    for (j = 0; j < this.state.rows.length; j++) {
      category = this.state.rows[j];
      for (i = 0; i < category.subcategories.length; i++) {
        var subcategory = category.subcategories[i];
        subcategory.tagValue = {
          text: subcategory.name,
          value: ['cat', subcategory.cat_id]
        };
        childRows.push(<SummaryChildRow category={category} key={subcategory.cat_id}
                                        subcategory={subcategory}/>);
      }
      var id = "child-rows-" + category.id;
      childRowGroup.push(
        <div className="child-rows" id={id} key={id}>
          {childRows}
        </div>
      );
      childRows = [];
    }
    return (
      <div id="summary-container" onClick={this.containerClick}>
        <div id='summary'>
          <div className='row'>
            <div className='col-md-8'>{rows}</div>
            <div className='col-md-4 child-row-wrapper'>
              <div className='child-row-container'>{childRowGroup}</div>
            </div>
            <ExtraInformation />
          </div>
        </div>
      </div>
    );

  },
  containerClick: function (e) {
    $("#summary").addClass("selected");
  },
  _onChange: function () {
    this.setState(SummaryStore.getAll())
  },
  _changeView: function () {
    this.setState(SummaryStore.getAll())
  }
});

module.exports = Summary;
