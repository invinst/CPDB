var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');
var sinon = require('sinon');

var WagtailPage = require('components/WagtailPage.react');
var WagtailPagesStore = require('stores/WagtailPagesStore');


describe('WagtailPage component', function () {
  var wagtailPage;

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(wagtailPage).parentNode);
  });

  it('should render glossary page', function () {
    sinon.stub(WagtailPagesStore, 'getCurrentPage', function () {
      return {
        'serialized_glossary_rows': [],
        'meta': {
          'type': 'wagtail_app.GlossaryPage'
        }
      };
    });

    wagtailPage = ReactTestUtils.renderIntoDocument(
      <WagtailPage params={ {page: 'whatever'} }/>
    );

    ReactTestUtils.scryRenderedDOMComponentsWithClass(wagtailPage, 'glossary-table')
      .length.should.equal(1);

    WagtailPagesStore.getCurrentPage.restore();
  });
});
