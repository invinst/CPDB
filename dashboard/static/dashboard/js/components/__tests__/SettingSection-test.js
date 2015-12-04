"use strict";

jest.mock('../../dispatcher/AppDispatcher');
jest.autoMockOff();

describe('SessionSection', function () {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var AppDispatcher = require('../../dispatcher/AppDispatcher');
  var callback;
  var AppConstants = require('../../constants/AppConstants');
  var SettingSection = require('components/SettingSection.react');
  var SettingSectionStore = require('stores/SettingSectionStore');
  var settingSection;
  var data = [{
      default_site_title: 'default_site_title',
      story_types_order: 'type1,type2'
    }]

  var actionReceivedSettingData = {
    actionType: AppConstants.RECEIVED_SETTINGS_DATA,
    data: data
  }

  beforeEach(function() {
    settingSection = TestUtils.renderIntoDocument(
        <SettingSection />
    );
    callback = AppDispatcher.register.mock.calls[0][0]
  });

  it('should exists', function () {
    expect(TestUtils.isCompositeComponent(settingSection)).toBeTruthy();
  });

  it('should update Store on drag', function () {
    callback(actionReceivedSettingData);
    var source = TestUtils.scryRenderedDOMComponentsWithClass(settingSection, 'ReactTags__tag');
    expect(source[0].props.children[0]).toBe('type1');
    expect(source[1].props.children[0]).toBe('type2');
  });
});
