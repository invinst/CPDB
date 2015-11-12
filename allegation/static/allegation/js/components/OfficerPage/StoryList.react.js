var React = require('react');
var _ = require('lodash');

var StoryListStore = require('stores/Officer/StoryListStore');
var Story = require('components/OfficerPage/Story.react');
var Base = require('components/Base.react');
var StoryListAPI = require('utils/StoryListAPI');


var StoryList = React.createClass(_.assign(Base(StoryListStore), {
  render: function () {

    return (
      <div>{ this.renderStoryInGroup() }</div>
    );
  },

  renderStoryInGroup: function () {
    return _.map(this.groupStories(), function (stories, story_type) {
      if (!stories.length) {
        return '';
      }

      stories = stories.map(function (story) {
        return <Story key={story.id} story={story} />
      });

      return (
        <div>
          <div className='row'><h3 className='col-md-12'>{story_type}</h3></div>
          <div className="row">{stories}</div>
        </div>
      );
    });
  },

  groupStories: function () {
    return _.groupBy(this.state.stories, 'story_type');
  }
}));

module.exports = StoryList;
