var React = require('react');
var _ = require('lodash');
var bootbox = require('bootbox');
var moment = require('moment');
var classnames = require('classnames');
global.jQuery = require('jquery');

var Base = require('components/Base.react');
var AppConstants = require('../../../constants/AppConstants');
var StoryListStore = require('stores/OfficerSection/Officer/StoryListStore');
var StoryListActions = require('actions/OfficerSection/Officer/StoryListActions');
var TabsActions = require('actions/OfficerSection/Officer/TabsActions');
var StoryAPI = require('utils/StoryAPI');
var DateTimeUtil = require('utils/DateTimeUtil');
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
    if (StoryListStore.hasSelectedStories()) {
      bootbox.confirm("You are going to delete all stories of this officer?", this.doDeleteBulk);
    } else {
      bootbox.alert("You haven't checked any story yet");
    }
  },

  doDeleteBulk: function (yes) {
    if (yes) {
      StoryAPI.deleteBulk(StoryListStore.getSelectedStories());
    }
  },

  componentDidMount: function () {
    StoryListStore.addChangeListener(this._onChange);

    StoryAPI.get();
  },

  componentDidUpdate: function () {
    if (this.state.do_update_list) {
      StoryAPI.get();
    }
  },

  renderStoryList: function() {
    var that = this;
    return this.state.stories.map(function(x) {
      var date = DateTimeUtil.displayDateTime(x['created_date'], AppConstants.DATE_FORMAT);

      return (
        <tr className='story' key={x.id}>
          <td>
            <input type="checkbox" onChange={that.selectCheckbox(x)} checked={x.selected} />
          </td>
          <td onClick={that.editStory(x)}>{x.title}</td>
          <td>{date}</td>
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

    var deleteBtnClassname = classnames('btn btn-primary', {
      'hidden': !StoryListStore.hasSelectedStories()
    });

    return (
      <div>
        <div className="row story-head-line">
          <h4 className="col-md-6 col-xs-6">Stories</h4>
          <div className="col-md-6 col-xs-6 text-right">
            <button className={deleteBtnClassname} onClick={this.deleteBulk}>Delete</button>
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
