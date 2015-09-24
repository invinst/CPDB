var React = require('react');
var _ = require('lodash');
var Base = require('../../Base.react');
var StoryFormStore = require('../../../stores/OfficerSection/Officer/StoryFormStore');
var StoryFormActions = require('../../../actions/OfficerSection/Officer/StoryFormActions');
var OfficerAPI = require('../../../utils/OfficerAPI');


var StoryForm = React.createClass(_.assign(Base(StoryFormStore), {
  onChange: function (field, e) {
    StoryFormActions.updateField(field, e.target.value);
  },

  value: function (field) {
    if (this.state.story) {
      return this.state.story[field];
    }
  },

  update: function (field) {
    return this.onChange.bind(this, field);
  },

  save: function () {
    console.log(this.state.story);
  },
  render: function() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <label htmlFor="title" className="col-lg-2 col-md-2 col-xs-2">Title</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="title" name="title"
                   onChange={this.update("title")} value={this.value('title')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="slug" className="col-lg-2 col-md-2 col-xs-2">Slug</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type="text" className="form-control" id="slug" name="slug"
                   onChange={this.update("slug")} value={this.value('slug')} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="short_description" className="col-lg-2 col-md-2 col-xs-2">Short Description</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <textarea type="text" className="form-control" id="short_description" name="short_description"
                      onChange={this.update("short_description")} value={this.value('short_description')}></textarea>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="content" className="col-lg-2 col-md-2 col-xs-2">Content</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <textarea type="text" className="form-control" id="content" name="content"
                      onChange={this.update("content")} value={this.value('content')}></textarea>
          </div>
        </div>
        <div className="form-group actions">
          <div className="col-xs-12 text-right">
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
