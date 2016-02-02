var React = require('react');
var _ = require('lodash');

var AppConstants = require('../../constants/AppConstants');
var StoryListStore = require('stores/Officer/StoryListStore');
var Story = require('components/OfficerPage/Story.react');
var Base = require('components/Base.react');


var StoryList = React.createClass(_.assign(Base(StoryListStore), {
  storyTypesOrder: function () {
    return AppConstants.STORY_TYPES_ORDER.split(',').map(function (type) {
      return type.trim();
    });
  },

  render: function () {
    return (
      <div id='story_list'>
        { this.renderStoryInGroup() }
        { this.renderStoryNotInGroup() }
      </div>
    );
  },

  renderStoryGroup: function (stories, storyType) {
    stories = stories.map(function (story) {
      return <Story key={ story.id } story={ story } />;
    });

    return (
      <div>
        <div className='row'><h3 className='col-md-12'>{ storyType }</h3></div>
        <div className='row'>{ stories }</div>
      </div>
    );
  },

  renderStoryNotInGroup: function () {
    var that = this;

    var storyTypesOrders = this.storyTypesOrder();
    return _.map(this.groupStories(), function (stories, storyType) {
      if (storyTypesOrders.indexOf(storyType) != -1) {
        return '';
      }
      return that.renderStoryGroup(stories, storyType);
    });
  },

  renderStoryInGroup: function () {
    var groupStories = this.groupStories();
    var stories;
    var that = this;

    return _.map(this.storyTypesOrder(), function (storyType) {
      stories = groupStories[storyType];

      if (!stories || !stories.length) {
        return '';
      }
      return that.renderStoryGroup(stories, storyType);
    });
  },

  groupStories: function () {
    return _.groupBy(this.state.stories, 'story_type');
  }
}));

module.exports = StoryList;
