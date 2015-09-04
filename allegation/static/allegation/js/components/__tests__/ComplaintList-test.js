"use strict";

jest.autoMockOff();

describe('ComplaintList', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var complaints;
  var ComplaintListStore = require('../../stores/ComplaintListStore');
  var LoadingComplaintList = require('../ComplaintList/LoadingComplaintList.react');
  var ComplaintSection = require('../ComplaintSection.react');

  it('should exists', function () {
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    expect(TestUtils.isCompositeComponent(complaints)).toBeTruthy();
  });

  it('render nothing when do not have any complaints', function () {
    ComplaintListStore.getState = jest.genMockFunction();
    ComplaintListStore.getState.mockReturnValue({'complaints': [], 'loading': false});
    complaints = TestUtils.renderIntoDocument(
      <ComplaintSection />
    );
    var divs = TestUtils.scryRenderedDOMComponentsWithTag(complaints, 'div');
    expect(divs.length).toBe(1);
  });

  it('show the loading icon when starting ajax call', function () {
    ComplaintListStore.getState = jest.genMockFunction();
    ComplaintListStore.getState.mockReturnValue({'loading': true});

    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ComplaintSection />);
    var result = shallowRenderer.getRenderOutput();

    expect(result.type.displayName).toBe('LoadingComplaintList');
  });
});

