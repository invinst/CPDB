var React = require('react');
var _ = require('lodash');

var Base = require('./Base.react');
var InterfaceTextSectionStore = require('../stores/InterfaceTextSectionStore');
var InterfaceTextAPI = require('utils/InterfaceTextAPI');


var InterfaceTextSection = React.createClass(_.assign(Base(InterfaceTextSectionStore), {

  renderActive: function () {
    return (
      <div className='row' key={ this.state.activeText.id }>
        <div className='col-md-3'>
          <input className='form-control' type='text' value={ this.state.activeText.key }
            onChange={ this.changeText.bind(this, 'key') } />
        </div>
        <div className='col-md-7'>
          <textarea className='form-control' onChange={ this.changeText.bind(this, 'text') }
            value={ this.state.activeText.text }></textarea>
        </div>
        <div className='col-md-2'>
          <button onClick={ this.save.bind(this, this.state.activeText) } className='btn btn-info'>
            <i className='fa fa-floppy-o'/>
          </button>
          <button onClick={ this.editText.bind(this, null) } className='btn btn-danger'>
            <i className='fa fa-remove'/>
          </button>
        </div>
      </div>
    );
  },

  renderRow: function (text) {
    return (
      <div className='row' key={ text.id }>
        <div className='col-md-3'>
          { text.key }
        </div>
        <div className='col-md-7'>
          { text.text }
        </div>
        <div className='col-md-2'>
          <button onClick={ this.editText.bind(this, text) } className='btn btn-danger'>
            <i className='fa fa-pencil'/>
          </button>
        </div>
      </div>
    );
  },

  renderContent: function () {
    var children = [];
    var i,
      text;

    if (this.state.texts.length > 0) {
      for (i = 0; i < this.state.texts.length; i++) {
        text = this.state.texts[i];
        if (this.state.activeText && text.id == this.state.activeText.id) {
          children.push(this.renderActive());
        }
        else {
          children.push(this.renderRow(text));
        }
      }
    }
    else {
      children.push(<span><i className='fa fa-spin fa-spinner'/></span>);
    }
    return children;
  },

  changeText: function (key, e) {
    var activeText = this.state.activeText;
    activeText[key] = e.target.value;

    this.setState({'activeText': activeText});
  },

  editText: function (text) {
    this.setState({'activeText': _.clone(text)});
  },

  componentDidMount: function () {
    InterfaceTextSectionStore.addChangeListener(this._onChange);
    InterfaceTextAPI.get();
  },

  save: function (text) {
    InterfaceTextAPI.save(text);
  },

  render: function () {
    return (
      <div>
        <div className='row top-nav'>
          <div id='page-title' className='col-md-6 col-xs-6'>
            <h1>
              Interface Texts
            </h1>
          </div>
        </div>
        <div>
          <div className='row margin-top'>
            <div className='col-md-12'>
              <form className='form-horizontal'>
                { this.renderContent() }
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}));

module.exports = InterfaceTextSection;
