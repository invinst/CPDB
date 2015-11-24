var React = require('react');
var Select = require('react-select');

var Logo = require('components/Shared/Logo.react');
var About = require('components/Shared/About.react');
var SuggestionSection = require('components/MainPage/SuggestionSection.react');

var jQuery = require('jquery');

var MainPage = React.createClass({
  onFocus: function() {
    jQuery('#logo').addClass('top-left')
    jQuery('.search-wrapper').addClass('top-left')
    jQuery('#suggestion-section').removeClass('hidden')
  },

  onBlur: function() {
    jQuery('#logo').removeClass('top-left')
    jQuery('.search-wrapper').removeClass('top-left')
    jQuery('#suggestion-section').addClass('hidden')
  },

  onChange: function () {

  },
  
  render: function () {
    return (
      <div id='main-page'>
        <Logo />
        <div className="search-wrapper pad animation">
          <input className='search' type="search" placeholder="Search"
                 onFocus={this.onFocus.bind(this)}
                 onBlur={this.onBlur.bind(this)}
                 onChange={this.onChange.bind(this)}/>
          <SuggestionSection/>
        </div>

        <div className='bar bar-standard bar-footer'>
          <About />
        </div>
      </div>
    )
  }
});

module.exports = MainPage;
