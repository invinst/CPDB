var React = require('react');
var _ = require('lodash');
var bootbox = require('bootbox');
var moment = require('moment');
var Base = require('../../Base.react');
var StoryListStore = require('../../../stores/OfficerSection/Officer/StoryListStore');
var StoryListActions = require('../../../actions/OfficerSection/Officer/StoryListActions');
var TabsActions = require('../../../actions/OfficerSection/Officer/TabsActions');
var StoryAPI = require('../../../utils/StoryAPI');
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
    bootbox.confirm("You are going to delete story \"" + story.title + "\"?",
      this.deleteStoryCallback.bind(this, story));
  },

  onSelectCheckbox: function (story, e) {
    StoryListActions.selectCheckbox(story, e.target.checked);
  },

  deleteStoryCallback: function (story, yes) {
    if (yes) {
      StoryAPI.delete(story);
    }
  },

  editStory: function (story) {
    return this.onEditStory.bind(this, story);
  },

  deleteStory: function (story) {
    return this.onDeleteStory.bind(this, story);
  },

  selectCheckbox: function (story) {
    return this.onSelectCheckbox.bind(this, story);
  },

  selectAll: function (e) {
    StoryListActions.selectAllCheckbox(e.target.checked);
  },

  deleteBulk: function () {
    bootbox.confirm("You are going to delete all stories of this officer?", this.doDeleteBulk);
  },

  doDeleteBulk: function (yes) {
    if (yes) {
      var stories = _.filter(this.state.stories, function (x) {return x.selected;});
      StoryAPI.deleteBulk(stories);
    }
  },

  renderStoryList: function() {
    var that = this;
    return this.state.stories.map(function(x) {
      return (
        <tr className='story' key={x.id}>
          <td>
            <input type="checkbox" onChange={that.selectCheckbox(x)} checked={x.selected} />
          </td>
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
            <button className="btn btn-primary" onClick={this.deleteBulk}>Delete</button>
          </div>
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="check-all" onClick={this.selectAll} />
                </th>
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
