var React = require('react');
var _ = require('lodash');
var slugify = require('slugify');

var Base = require('./Base.react');
var SettingSectionStore = require('../stores/SettingSectionStore');
var SettingAPI = require('utils/SettingAPI')
var SettingActions = require('actions/SettingActions');


var SettingSection = React.createClass(_.assign(Base(SettingSectionStore), {
  content: function () {
    var that = this;
    return this.state.settings.map(function (setting) {
      var inputId = 'setting-input-' + slugify(setting.key)
      return (
        <div className="form-group">
          <label htmlFor={inputId} className="col-lg-2 col-md-2 col-xs-2">{setting.key}</label>
          <div className="col-lg-10 col-md-10 col-xs-10">
            <input type='text' id={inputId} className="form-control" value={setting.value} onChange={that.change(setting)} required />
          </div>
        </div>
      );
    });
  },

  change: function (setting) {
    return this.update.bind(this, setting);
  },

  update: function (setting, e) {
    var newValue = e.target.value;

    SettingActions.update(setting, newValue);
  },

  componentDidMount: function () {
    SettingSectionStore.addChangeListener(this._onChange);

    SettingAPI.get();
  },

  save: function () {
    SettingAPI.save(this.state.settings);
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