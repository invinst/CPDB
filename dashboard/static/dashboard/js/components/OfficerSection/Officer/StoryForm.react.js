var React = require('react');
var _ = require('lodash');
var Base = require('../../Base.react');
var StoryFormStore = require('../../../stores/OfficerSection/Officer/StoryFormStore');
var StoryFormActions = require('../../../actions/OfficerSection/Officer/StoryFormActions');
var StoryAPI = require('../../../utils/StoryAPI');

global.jQuery = require('jquery');


var StoryForm = React.createClass(_.assign(Base(StoryFormStore), {
  onChange: function (field, e) {
    StoryFormActions.updateField(field, e.target.value);
  },

  value: function (field) {
    if (this.state.story && this.state.story[field]) {
      return this.state.story[field];
    }
    return '';
  },

  update: function (field) {
    return this.onChange.bind(this, field);
  },

  save: function () {
    if (jQuery(this.getDOMNode()).valid()) {
      StoryAPI.save(this.state.story);
    }
  },

  clear: function () {
    StoryFormActions.clear();
  },

  render: function() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="story_title" className="col-lg-2 col-md-2 col-xs-2">Title</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="story_title" name="title" required
                   onChange={this.update("title")} value={this.value('title')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="story_slug" className="col-lg-2 col-md-2 col-xs-2">Slug</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="story_slug" name="slug" required
                   onChange={this.update("slug")} value={this.value('slug')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="story_short_description" className="col-lg-2 col-md-2 col-xs-2">Short Description</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <textarea type="text" className="form-control" id="story_short_description" name="short_description" required
                      onChange={this.update("short_description")} value={this.value('short_description')}></textarea>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="story_content" className="col-lg-2 col-md-2 col-xs-2">Content</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <textarea type="text" className="form-control" id="story_content" name="content" required
                      onChange={this.update("content")} value={this.value('content')}></textarea>
          </div>
        </div>
        <div className="form-group actions">
          <div className="col-xs-12 text-right">
            <button type="button" className="btn btn-default" onClick={this.clear}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={this.save}>
              <i className="fa fa-floppy-o"></i> Save
            </button>
          </div>
        </div>
      </form>
    );
  }

}));

module.exports = StoryForm;
