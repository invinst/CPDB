var React = require('react');
var _ = require('lodash');
var slug = require('slug');
var Select = require('react-select');

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

  componentDidMount: function () {
    StoryFormStore.addChangeListener(this._onChange);
    jQuery(this.getDOMNode()).validate({
      ignore: []
    });
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

  updateStoryType: function (value) {
    StoryFormActions.updateField('story_type', value);
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
        <div className="form-group">
          <label htmlFor='story_url' className="col-lg-2 col-md-2 col-xs-2">Enter URL</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <div className="input-group">
              <input type="text" className="form-control" id='story_url' name='url'
                     onChange={this.update('url')} value={this.value('url')} />
              <div className="input-group-addon"><i className='fa fa-link'></i></div>
            </div>
          </div>
        </div>
        {this.generateFormElement('slug', 'Slug', 'story_', true)}
        {this.generateFormMediumEditorElement('short_description', 'Short Description', 'story_', true)}
        {this.generateFormMediumEditorElement('content', 'Content', 'story_', true)}
        <div className="form-group">
          <label htmlFor='story_type' className="col-lg-2 col-md-2 col-xs-2">Type</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <Select asyncOptions={StoryAPI.suggestType} name='story_type' onChange={this.updateStoryType} value={this.value('story_type')}
                    allowCreate={true} addLabelText="New type: {label}" />
            <input type='hidden' value={this.value('story_type')} required />
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
