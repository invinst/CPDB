var classnames = require('classnames');
var React = require('react');
var PropTypes = React.PropTypes;

var StoryStore =require('stores/OfficerPage/StoryStore');
var DocumentCloudAPI = require('utils/DocumentCloudAPI');
var AppConstants = require('constants/AppConstants');
var DateTimeUtil = require('utils/DateTimeUtil');


var Story = React.createClass({
  propTypes: {
    story: PropTypes.object
  },

  getInitialState: function () {
    return {
      thumbUrl: ''
    };
  },

  componentDidMount: function () {
    if (this.props.story.url) {
      var story = this.props.story;
      DocumentCloudAPI.getThumbnail(story);
    } else {
      this.props.story.url = '#';
    }
    StoryStore.addChangeThumbUrlListener(this._onThumbUrlChange);
  },

  componentWillUnmount: function () {
    StoryStore.removeChangeThumbUrlListener(this._onThumbUrlChange);
  },

  _onThumbUrlChange: function () {
    if (StoryStore.isSameStory(this.props.story)) {
      this.setState({
        thumbUrl: StoryStore.getThumbUrl()
      });
    }
  },

  renderCreatedDate: function () {
    var date = DateTimeUtil.displayDateTime(this.props.story['created_date'], AppConstants.DATE_FORMAT);

    return (
      <div className='date'>{ date }</div>
    );
  },

  renderDocumentDescription: function () {
    var story = this.props.story;
    var description = story.short_description;
    if (description.length >= 300) {
      description = description.substr(0, 300) + '...';
    }

    var descCol = classnames({
      'col-md-12': !story.thumbUrl,
      'col-md-10': story.thumbUrl
    });

    return (
      <div className={ descCol }>
        <div className='short-description'>
          { description } <a href={ story.url }>Read more</a>
        </div>
      </div>
    );
  },

  renderDocumentLink: function () {
    var thumbUrl = this.state.thumbUrl;
    if (thumbUrl) {
      return (
        <div className='col-md-2'>
          <a className='document-url' href={ this.props.story.url }>
            <img className='document-thumbnail' src={ thumbUrl } alt='thumbnail' />
          </a>
        </div>
      );
    }
  },

  render: function () {
    var story = this.props.story;

    return (
      <div className='col-md-6'>
        <div className='story'>
          <h5 className='title'>
            <a href={ story.url }>{ story.title }<i className='fa fa-external-link'></i></a>
          </h5>
          { this.renderCreatedDate() }
          <div className='row'>
            { this.renderDocumentLink() }
            { this.renderDocumentDescription() }
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Story;
