"use strict";

jest.dontMock('../../../constants/AppConstants');
jest.dontMock('../../../stores/Base');
jest.dontMock('../ComplaintSectionStore');
jest.dontMock('object-assign');
jest.dontMock('lodash');

describe('ComplaintSectionStore', function() {
  var AppDispatcher;
  var callback;
  var ComplaintSectionStore;
  var AppConstants = require('../../../constants/AppConstants');

  var data = {
    allegations: [
      {
        allegation: {
          final_finding: 'Sustained',
          final_outcome_class: 'disciplined'
        },
        officers: [{
          id: 1
        }],
        police_witness: [{
          officer: {
           pk: 2
          }
        }]
      },
      {
        allegation: {
          final_finding: 'Not Sustained',
          final_outcome_class: 'disciplined'
        },
        officers: [{
          id: 3
        }],
        police_witness: [{
          officer: {
            pk: 4
          }
        }]
      },
      {
        allegation: {
          final_finding: 'Not Sustained',
          final_outcome_class: 'disciplined'
        },
        officers: [{
          id: 5
        }],
        police_witness: [{
          officer: {
            pk: 6
          }
        }]
      }

    ],
    analytics: {}
  };

  var actionOfficerComplaintListReceivedData = function(returnData) {
    return {
      actionType: AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA,
      data: returnData
    };
  };

  var actionSetActiveComplaintListFilter = function(filter_type) {
    return {
      actionType: AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER,
      filter: filter_type
    };
  };

  var actionSetActiveOfficer = {
    actionType: AppConstants.SET_ACTIVE_OFFICER,
    officer: {
      id: 1
    }
  };

  beforeEach(function() {
    AppDispatcher = require('../../../dispatcher/AppDispatcher');
    ComplaintSectionStore = require('../ComplaintSectionStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('init data with ajax call results', function() {
    callback(actionOfficerComplaintListReceivedData({allegations: 'complaints', analytics: 'analytics'}));
    var states = ComplaintSectionStore.getState();
    expect(states['complaints']).toBe('complaints');
    expect(states['analytics']).toBe('analytics');
  });

  it('update complaints based on active outcome filter', function() {
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: []
    });

    // init data
    callback(actionSetActiveComplaintListFilter('disciplined'))
    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(3)

    callback(actionSetActiveComplaintListFilter('sustained'))
    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(1)
  });

  it('update complaints based on intersected co-accused officers', function() {
    // init data
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: [1]
    });
    callback(actionSetActiveOfficer);
    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(1)
  });

  it('update complaints based on intersected witness officers', function() {
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: [4]
    });

    callback(actionSetActiveOfficer);

    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(1)
  });

  it('update complaints based on intersected witness officers or co-accused officers', function() {
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: [1, 4]
    });

    callback(actionSetActiveOfficer);

    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(2)
  });

  it('update complaints to empty if there is no intersects', function() {
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: [7]
    });

    callback(actionSetActiveOfficer);

    expect(ComplaintSectionStore.getState()['complaints'].length).toBe(0)
  });

  it('update complaints analytics after any officer is set active', function() {
    callback(actionOfficerComplaintListReceivedData(data));
    var RelatedOfficersStore = require('../RelatedOfficersStore');
    RelatedOfficersStore.getState.mockReturnValue({
      activeOfficers: [1, 3]
    });

    callback(actionSetActiveOfficer);

    var analytics = ComplaintSectionStore.getState()['analytics']
    expect(analytics['Disciplined']).toBe(2)
    expect(analytics['Sustained']).toBe(1)
    expect(analytics['Not Sustained']).toBe(1)
    expect(analytics['All']).toBe(2)
  });
});
