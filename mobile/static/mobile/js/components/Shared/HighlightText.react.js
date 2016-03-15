var React = require('react');


var HighlightText = React.createClass({
  propTypes: {
    fullText: React.PropTypes.string,
    textToFind: React.PropTypes.string
  },

  render: function () {
    var fullText = this.props.fullText.toString();
    var textToFind = this.props.textToFind.toString();
    var highlightFrom = fullText.toLowerCase().indexOf(textToFind.toLowerCase());
    var textBefore,
      textAfter,
      textToHighlight;

    if (highlightFrom >= 0) {

      textBefore = fullText.substring(0, highlightFrom);
      textAfter = fullText.substring(highlightFrom + textToFind.length);
      textToHighlight = fullText.substring(highlightFrom, highlightFrom + textToFind.length);
      return (
        <div className='inline'> { textBefore }<span className='highlight'>{ textToHighlight }</span>{ textAfter }</div>
      );
    }
    return (
      <span>{ fullText }</span>
    );
  }
});

module.exports = HighlightText;
