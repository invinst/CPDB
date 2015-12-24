var React = require('react');
var _ = require('lodash');
var moment = require('moment');
var classnames = require('classnames');

var Base = require('components/Base.react')
var StoryStore =require('stores/OfficerPage/StoryStore');
var DocumentCloudAPI = require('utils/DocumentCloudAPI');
var AppConstants = require('constants/AppConstants');
var DateTimeUtil = require('utils/DateTimeUtil');


var Story = React.createClass(_.assign(Base(StoryStore), {

  componentDidMount: function() {
    if (this.props.story.url){
      var story = this.props.story;
      DocumentCloudAPI.getThumbnail(story);
    } else {
      this.props.story.url = '#';
    }
  },

  renderDocumentLink: function () {
    var thumbUrl = this.props.story.thumbUrl;
    if (thumbUrl) {
      return (
        <div className="col-md-2">
          <a className="document-url" href={this.props.story.url}>
            <img className="document-thumbnail" src={thumbUrl} alt="thumbnail" />
          </a>
        </div>
      );
    }
  },

  renderDocumentDescription: function () {
    var story = this.props.story;
    var description = story.short_description;
    var readmore = '';
    if (description.length >= 300) {
      description = description.substr(0, 300) + '...';
      readmore = '<a href="' + story.url + '">Read more</a>';
    }

    var descCol = classnames({
      'col-md-12': !story.thumbUrl,
      'col-md-10': story.thumbUrl
    });

    return (
      <div className={descCol}>
        <div className="short-description" dangerouslySetInnerHTML={{__html: description + ' ' + readmore}}></div>
      </div>
    );
  },

  renderCreatedDate: function () {
    var date = DateTimeUtil.displayDateTime(this.props.story['created_date'], AppConstants.DATE_FORMAT);

    return (
      <div className="date">{date}</div>
    );
  },

  render: function () {
    var story = this.props.story;

    return (
      <div className="col-md-6">
        <div className="story">
          <h5 className="title">
            <a href={story.url}>{story.title}<i className="fa fa-external-link"></i></a>
          </h5>
          { this.renderCreatedDate() }
          <div className="row">
            { this.renderDocumentLink() }
            { this.renderDocumentDescription() }
          </div>
        </div>
      </div>
    );
  }

}));

module.exports = Story;
