var React = require('react');


var Story = React.createClass({
  getInitialState: function () {
    return {};
  },

  componentDidMount: function() {

  },

  render: function () {
    var story = this.props.story;
    var description = story.short_description;
    var readmore = '';
    if (description.length >= 300) {
      description = description.substr(0, 300) + '...';
      readmore = (
        <a href={story.url}>Read more</a>
      )
    }
    return (
      <div className="col-md-6 story">
        <h5 className="title">
          <a href={story.url}>{story.title}</a>
        </h5>
        <div className="short-description">{description} {readmore}</div>
      </div>
    );
  }

});

module.exports = Story;
