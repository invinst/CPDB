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
        <a href="{story.absolute_url}">Read more</a>
      )
    }
    return (
      <div className="col-md-6 story">
        <h5 className="title">
          <a href="{story.absolute_url}">{story.title}</a>
        </h5>
        <div className="date">{story.created_date}</div>
        <div className="short-description">{description} {readmore}</div>
      </div>
    );
  }

});

module.exports = Story;
