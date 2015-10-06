var React = require('react');
var _ = require('lodash');
var slug = require('slug');

var Base = require('../../Base.react');
var FormMixin = require('../../Form/Mixin.react');
var StoryFormStore = require('../../../stores/OfficerSection/Officer/StoryFormStore');
var StoryFormActions = require('../../../actions/OfficerSection/Officer/StoryFormActions');
var StoryAPI = require('../../../utils/StoryAPI');
global.jQuery = require('jquery');


var StoryForm = React.createClass(_.assign(Base(StoryFormStore), {
  mixins: [FormMixin],
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
        {this.generateFormElement('title', 'Title', 'story_', true)}
        {this.generateFormElement('slug', 'Slug', 'story_', true)}
        {this.generateFormMediumEditorElement('short_description', 'Short Description', 'story_', true)}
        {this.generateFormMediumEditorElement('content', 'Content', 'story_', true)}
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
