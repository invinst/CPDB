var React = require('react');
var _ = require('lodash');
var Select = require('react-select');
var ReactTags = require('react-tag-input').WithContext;

var Base = require('./Base.react');
var SettingSectionStore = require('../stores/SettingSectionStore');
var SettingAPI = require('utils/SettingAPI')
var SettingActions = require('actions/SettingActions');


var SettingSection = React.createClass(_.assign(Base(SettingSectionStore), {
  content: function () {
    var that = this;
    var setting = this.state.setting;

    return (
      <div>
        <div className="form-group">
          <label htmlFor='default_site_title' className="col-lg-2 col-md-2 col-xs-2">Default Site Title</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type='text' id='default_site_title' className="form-control" value={setting.default_site_title} onChange={this.change('default_site_title')} required />
          </div>
        </div>
        <div className="form-group" id="story-types-order-input">
          <label htmlFor='story_types_order' className="col-lg-2 col-md-2 col-xs-2">Story Types Order</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <ReactTags tags={this.state.tags}
                    suggestions={this.state.storyTypes}
                    handleDrag={this.handleDrag} />
          </div>
        </div>
      </div>
    );
  },

  setStoryTypes: function (err, data) {
    SettingSectionStore.setStoryTypes(data.options);
    SettingSectionStore.emitChange();
  },

  handleDrag: function(tag, currentPosition, newPosition) {
    SettingActions.dragTag(tag, currentPosition, newPosition)
  },

  change: function (field) {
    return this.update.bind(this, field);
  },

  update: function (field, e) {
    var newValue = e.target.value;

    SettingActions.update(field, newValue);
  },

  updateStoryTypesOrder: function (value) {
    SettingActions.update('story_types_order', value);
  },

  componentDidMount: function () {
    SettingSectionStore.addChangeListener(this._onChange);

    SettingActions.getStoryTypes();
    SettingAPI.get();
  },

  save: function () {
    SettingSectionStore.updateSettingStoryTypes();
    SettingAPI.save(this.state.setting);
  },

  render: function () {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Settings
            </h1>
          </div>
        </div>
        <div>
          <div className='row'>
            <div className='col-md-12'>
              <form className='form-horizontal'>
                { this.content() }
                <div className='form-group'>
                  <div className='col-sm-offset-2 col-sm-10'>
                    <button type='button' className='btn btn-default' onClick={this.save}>Save</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}));

module.exports = SettingSection;
