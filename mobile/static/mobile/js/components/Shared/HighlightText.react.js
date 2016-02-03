var React = require('react');


var HighlightText = React.createClass({
  render: function () {
    var fullText = this.props.fullText.toString();
    var textToFind = this.props.textToFind.toString();
    var highlightFrom = fullText.toLowerCase().indexOf(textToFind.toLowerCase());

    if (highlightFrom >= 0) {

      var textBefore = fullText.substring(0, highlightFrom);
      var textAfter = fullText.substring(highlightFrom + textToFind.length);
      var textToHighlight = fullText.substring(highlightFrom, highlightFrom + textToFind.length);
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
