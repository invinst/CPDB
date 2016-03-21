var AppConstants = require('constants/AppConstants');
var AppDispatcher = require('dispatcher/AppDispatcher');
var RaceGenderAgeTabStore = require('stores/DataToolPage/RaceGenderAgeTabStore');


require('should');

describe('RaceGenderAgeTabStore', function () {
  var callback = AppDispatcher.getCallback(RaceGenderAgeTabStore.dispatcherToken);

  it('should transform age data', function () {
    callback({ actionType: AppConstants.RACE_GENDER_TAB_RECEIVED_DATA, data: {
      officers: {
        age: {
          '20-30': 10,
          '31+': 20
        },
        gender: {
          'M': 10
        },
        race: {
          'White': 11
        }
      },
      'complaining_witness': {
        age: {
          '30-40': 15,
          '41+': 16
        },
        gender: {
          'F': 20
        },
        race: {
          'Black': 20
        }
      }
    }});

    RaceGenderAgeTabStore.getOfficerAgeSegments().should.deepEqual([
      {
        label: '20-30',
        count: 10,
        filters: [{value: '20-30', label: '20-30'}],
        active: true
      },
      {
        label: '31+',
        count: 20,
        filters: [{value: '31+', label: '31+'}],
        active: true
      }
    ]);

    RaceGenderAgeTabStore.getComplainantAgeSegments().should.deepEqual([
      {
        label: '30-40',
        count: 15,
        filters: [{value: '30-40', label: '30-40'}],
        active: true
      },
      {
        label: '41+',
        count: 16,
        filters: [{value: '41+', label: '41+'}],
        active: true
      }
    ]);

    RaceGenderAgeTabStore.getOfficerGenderSegments().should.deepEqual([
      {
        label: 'Male',
        count: 10,
        filters: [{value: 'M', label: 'Male'}],
        active: true
      }
    ]);

    RaceGenderAgeTabStore.getComplainantGenderSegments().should.deepEqual([
      {
        label: 'Female',
        count: 20,
        filters: [{value: 'F', label: 'Female'}],
        active: true
      }
    ]);

    RaceGenderAgeTabStore.getOfficerRaceSegments().should.deepEqual([
      {
        label: 'White officers',
        count: 11,
        filters: [{value: 'White', label: 'White'}],
        active: true
      }
    ]);

    RaceGenderAgeTabStore.getComplainantRaceSegments().should.deepEqual([
      {
        label: 'Black',
        count: 20,
        filters: [{value: 'Black', label: 'Black'}],
        active: true
      }
    ]);
  });
});
