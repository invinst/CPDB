var React = require('react');

var EmbedMixin = require('components/DataToolPage/Embed/Mixin.react');
var OfficerPresenter = require('presenters/OfficerPresenter');
var CheckMarkStore = require('stores/Officer/CheckMarkStore');
var OfficerActions = require('actions/OfficerActions');
var CheckMarkActions = require('actions/Officer/CheckMarkActions');

var CheckMark = React.createClass({
  mixins: [EmbedMixin],

  getInitialState: function () {
    return CheckMarkStore.getState();
  },

  componentDidMount: function () {
    CheckMarkStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CheckMarkStore.removeChangeListener(this._onChange)
  },

  // embedding
  getEmbedCode: function () {
    var src = "/embed/?page=officer-card&pk=" + encodeURIComponent(this.props.officer.id);
    return '<iframe width="170px" height="129px" frameborder="0" src="' + this.absoluteUri(src)
       + '"></iframe>';
  },

  render: function() {
    var checkMarkClass = 'checkmark cursor ';
    var officer = this.props.officer;
    var justChange = CheckMarkStore.getCheckMarkStatus(officer.id);

    if (justChange) {
      checkMarkClass += ' justChange'
    }

    var selectableArea = <div></div>;
    if (this.props.clickable) {
      selectableArea = (
        <div onClick={this.onClick} key={officer.id} className={checkMarkClass} onMouseOut={this.onMouseOut.bind(this, officer)}>
          <i className='fa fa-check'></i>
        </div>
      );
    }

    if (this.props.embed) {
      selectableArea = (
        <div data-clipboard-text={this.getEmbedCode()} className='checkmark embed cursor' onMouseOut={this.onMouseOut.bind(this, officer)}
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

    return selectableArea;
  },

  onClick: function () {
    var officer = this.props.officer;
    var presenter = OfficerPresenter(officer);
    var page = this.props.page || 'home';
    if (page == 'home') {
      OfficerActions.setActiveOfficer(officer);
    } else {
      OfficerActions.setActiveOfficerInOfficerPage(officer);
    }
    ga('send', 'event', 'officer', 'filter-by', presenter.displayName);
  },

  onMouseOut: function(officer) {
    CheckMarkActions.mouseOut(officer)
  },

  _onChange: function() {
    this.setState(CheckMarkStore.getState());
  }
});

module.exports = CheckMark;
