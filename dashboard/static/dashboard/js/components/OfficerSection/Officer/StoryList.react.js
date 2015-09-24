var React = require('react');
var _ = require('lodash');
var moment = require('moment');
var Base = require('../../Base.react');
var StoryListStore = require('../../../stores/OfficerSection/Officer/StoryListStore');
var StoryListActions = require('../../../actions/OfficerSection/Officer/StoryListActions');
var TabsActions = require('../../../actions/OfficerSection/Officer/TabsActions');
global.jQuery = require('jquery');
require('jquery.scrollto');

var StoryList = React.createClass(_.assign(Base(StoryListStore), {

  prevent: function (e) {
    if (e) {
      e.preventDefault();
    }
  },

  onEditStory: function (story, e) {
    this.prevent(e);
    jQuery("body").scrollTo("#officer_formset", 500);
    TabsActions.goToStoryForm();
    StoryListActions.edit(story);
  },

  onDeleteStory: function (story, e) {
    this.prevent(e);
    console.log(story);
  },

  editStory: function (story) {
    return this.onEditStory.bind(this, story);
  },

  deleteStory: function (story) {
    return this.onDeleteStory.bind(this, story);
  },

  renderStoryList: function() {
    var that = this;
    return this.state.stories.map(function(x) {
      return (
        <tr className='story' key={x.id}>
          <td>{x.id}</td>
          <td onClick={that.editStory(x)}>{x.title}</td>
          <td>{moment(x.created_date).format("YYYY-MM-DD")}</td>
          <td className="text-right">
            <a href="#" onClick={that.editStory(x)}>
              <i className="fa fa-pencil"></i>
            </a>
            &nbsp;
            <a href="#" onClick={that.deleteStory(x)}>
              <i className="fa fa-trash"></i>
            </a>
          </td>
        </tr>
      )
    });
  },

  render: function() {
    if (!this.state.stories.length) {
      return (
        <div>There is no story about this officer in system.</div>
      );
    }
    return (
      <div>
        <div className="row">
          <h4 className="col-md-6 col-xs-6">Stories</h4>
          <div className="col-md-6 col-xs-6 text-right">
            <button className="btn btn-primary">Delete</button>
          </div>
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Title</th>
                <th>Date added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              { this.renderStoryList() }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}));

module.exports = StoryList;
