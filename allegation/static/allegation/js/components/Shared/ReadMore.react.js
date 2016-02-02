var classnames = require('classnames');
var React = require('react');

var PropTypes = React.PropTypes;


var ReadMore = React.createClass({
  propTypes: {
    limit: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      expanded: true
    };
  },

  componentDidMount: function () {
    var limit = this.props.limit;
    var contentParagraph = $(this.refs.contentParagraph);
    var lineHeight = parseInt(contentParagraph.css('line-height'));
    var height = parseInt(contentParagraph.css('height'));
    var line = Math.floor(height / lineHeight);

    if (line > limit + this.props.over) {
      this.collapseContent(limit * lineHeight);
    }
  },

  // TODO: Move this to store for more flux
  collapseContent: function (maxHeight) {
    this.setState({
      expanded: false,
      maxHeight: maxHeight
    });
  },

  toggleContent: function (event) {
    this.setState({
      expanded: !this.state.expanded
    });
  },

  renderShowMoreLink: function () {
    if (!this.state.expanded) {
      return (
        <a href='javascript:void(0)' onClick={ this.toggleContent }>Read more...</a>
      );
    }
    return '';
  },

  render: function () {
    var contentStyle = {};
    if (!this.state.expanded) {
      contentStyle['max-height'] = this.state.maxHeight;
    }
    var paragraphClass = classnames({
      'has-ellipsis': !this.state.expanded
    });

    return (
      <div>
        <p ref='contentParagraph' className={ paragraphClass } style={ contentStyle }>
          { this.props.content }
        </p>
        { this.renderShowMoreLink() }
      </div>
    );
  }
});

module.exports = ReadMore;
