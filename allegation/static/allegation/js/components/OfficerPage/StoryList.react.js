var React = require('react');

var StoryListStore = require('stores/Officer/StoryListStore');
var Story = require('components/OfficerPage/Story.react');


var StoryList = React.createClass({
  getInitialState: function () {
    return {
      stories: StoryListStore.init(this.props.officer)
    };
  },

  componentDidMount: function() {
    StoryListStore.onChange(this.updateStoryList)
  },

  updateStoryList: function (){
    this.setState({
      stories: StoryListStore.getStories()
    })
  },

  render: function () {
    var stories = [];
    for (var i = 0; i < this.state.stories.length; i++) {
      var story = this.state.stories[i];
      stories.push(<Story key={i} story={story} />);
    }

    if (!stories.length) {
      return <div></div>;
    }

    return (
      <div>
        <div className='row'><h3 className='col-md-12'>News stories</h3></div>
        <div className="row">{stories}</div>
      </div>
    );
  }

});

module.exports = StoryList;
