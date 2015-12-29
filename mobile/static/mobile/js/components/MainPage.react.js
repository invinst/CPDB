var cx = require('classnames');
var objectAssign = require('object-assign');
var React = require('react');

var Base = require('components/Base.react');

var About = require('components/Shared/About.react');
var MainPageStore = require('stores/MainPageStore');
var Logo = require('components/Shared/Logo.react');
var Search = require('components/Shared/Search.react');
var SuggestionSection = require('components/MainPage/SuggestionSection.react');
var SearchResultSection = require('components/MainPage/SearchResultSection.react');


var MainPage = React.createClass(objectAssign(Base(MainPageStore), {
  getInitialState: function () {
    return {
      'searchStatus': 'blank'
    }
  },

  render: function () {
    var classNames = cx('search-wrapper pad animation content',
      {'top-left': this.state.searchStatus != 'blank'}
    );

    return (
      <div className='main-page'>
        <Logo topLeft={this.state.searchStatus != 'blank'}/>
        <div className={classNames}>
          <Search />
          <SuggestionSection visible={this.state.searchStatus == 'suggesting'}/>
          <SearchResultSection visible={this.state.searchStatus == 'results'}/>
        </div>

        <div className='bar bar-standard bar-footer'>
          <About />
        </div>
      </div>
    )
  }
}));

module.exports = MainPage;
