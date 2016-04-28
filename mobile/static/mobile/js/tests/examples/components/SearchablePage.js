var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var sinon = require('sinon');

var Searchable = require('components/Shared/SearchablePage.react');
var SearchablePageStore = require('stores/Shared/SearchablePageStore');
var SharedExample = require('utils/tests/SharedExample');
var SuggestionAPI = require('utils/SuggestionAPI');
var SearchBarActions = require('actions/MainPage/SearchBarActions');


SharedExample.define('a searchable page', function () {
  var self = this;

  it('should render search page', function () {
    var obj = self.obj();
    obj.should.render([Searchable]);
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(obj).parentNode);

  });

  it('should hide result content when search bar is inactive', function () {
    var obj = self.obj();
    var resultContent = ReactTestUtils.findRenderedDOMComponentWithClass(obj, 'result-content');
    resultContent.getAttribute('class').should.containEql('result-content invisible');
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(obj).parentNode);
  });

  it('should show result content when search bar is active', function () {
    var resultContent;
    var obj = self.obj();
    var input = ReactTestUtils.findRenderedDOMComponentWithClass(obj, 'input-text');

    ReactTestUtils.Simulate.focus(input);

    sinon.stub(SearchablePageStore, 'getState', function () {
      return {
        'focus': 1
      };
    });
    SearchablePageStore.emitChange();
    resultContent = ReactTestUtils.findRenderedDOMComponentWithClass(obj, 'result-content');
    resultContent.getAttribute('class').should.not.containEql('result-content invisible');
    SearchablePageStore.getState.restore();
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(obj).parentNode);
  });

  it('should trigger an api for searching', function () {
    var obj = self.obj();
    var term = 'abc';
    var input = ReactTestUtils.findRenderedDOMComponentWithClass(obj, 'input-text');
    var mock = sinon.mock(SuggestionAPI);
    mock.expects('get').once().withArgs(term).returns(null);
    input.value = term;

    ReactTestUtils.Simulate.change(input);

    mock.verify();
    mock.restore();
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(obj).parentNode);
  });

  it('should trigger clear action if icon is clicked', function () {
    var obj = self.obj();
    var icon = ReactTestUtils.findRenderedDOMComponentWithClass(obj, 'icon');
    var mock = sinon.mock(SearchBarActions);
    mock.expects('clear').once();

    ReactTestUtils.Simulate.click(icon);

    mock.verify();
    mock.restore();
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(obj).parentNode);
  });
});
