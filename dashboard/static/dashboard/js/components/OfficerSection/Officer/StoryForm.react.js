var React = require('react');
var _ = require('lodash');
var slug = require('slug');

var Base = require('../../Base.react');
var StoryFormStore = require('../../../stores/OfficerSection/Officer/StoryFormStore');
var StoryFormActions = require('../../../actions/OfficerSection/Officer/StoryFormActions');
var StoryAPI = require('../../../utils/StoryAPI');
var Editor = require('react-medium-editor');
global.jQuery = require('jquery');


var StoryForm = React.createClass(_.assign(Base(StoryFormStore), {
  onChange: function (field, e) {
    var value = e.target.value;
    if (field == 'slug') {
      value = slug(value).toLowerCase();  
    }
    
    StoryFormActions.updateField(field, value);

    if (field == 'title') {
      StoryFormActions.updateField('slug', slug(value).toLowerCase());  
    }
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

  editorUpdate: function (field) {
    return this.onEditorUpdate.bind(this, field);
  },

  onEditorUpdate: function (field, text) {
    StoryFormActions.updateField(field, text);
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
            <Editor text={this.value('short_description')} onChange={this.editorUpdate("short_description")}
                    className="medium-editor story_short_description" options={{placeholder: false}} />
            <textarea  name="short_description" value={this.value('short_description')}
                       className="hidden" required></textarea>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="story_content" className="col-lg-2 col-md-2 col-xs-2">Content</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <Editor text={this.value('content')} onChange={this.editorUpdate("content")}
                    className="medium-editor story_content"  options={{placeholder: false}}/>
            <textarea  name="content" value={this.value('content')} className="hidden" required></textarea>
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
