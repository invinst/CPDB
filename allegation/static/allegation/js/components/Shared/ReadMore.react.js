var _ =  require('lodash');
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
      expanded: true,
      maxHeight: '100px',
    };
  },

  componentDidMount: function () {
    var limit = this.props.limit;
    var contentParagraph = $(this.refs.contentParagraph);
    var lineHeight = parseInt(contentParagraph.css('line-height'));
    var height = parseInt(contentParagraph.css('height'));
    var line = Math.floor(height / lineHeight);

    if (line > limit) {
      this.setState({
        expanded: false,
        maxHeight: (limit * lineHeight) + 'px'
      })
    }
  },

  renderShowMoreLink: function () {
    if (!this.state.expanded) {
      return (
        <a href='javascript:void(0)' onClick={this.toggleContent}>Read more...</a>
      );
    }
    return '';
  },

  render: function () {
    var maxHeight = this.props.limit;
    var contentStyle = {};
    if (!this.state.expanded) {
      contentStyle['max-height'] = this.state.maxHeight;
    }
    var paragraphClass = classnames({
      'has-ellipsis': !this.state.expanded
    });

    return (
      <div>
        <p ref='contentParagraph' className={paragraphClass} style={contentStyle}>
          { this.props.content }
        </p>
        { this.renderShowMoreLink() }
      </div>
    );
  },

  toggleContent: function (event) {
    this.setState({
      expanded: !this.state.expanded
    })
  }
});

module.exports = ReadMore;
