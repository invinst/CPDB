var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var AppConstants = require('constants/AppConstants');
var RaceGenderAPITransform = require('utils/RaceGenderAPITransformation');


var _state = {
  officer: {
    ageSegments: [],
    genderSegments: [],
    raceSegments: []
  },
  complainant: {
    ageSegments: [],
    genderSegments: [],
    raceSegments: []
  }
};

var RaceGenderAgeTabStore = _.assign({}, EventEmitter.prototype, {
  getOfficerAgeSegments: function () {
    return _state.officer.ageSegments;
  },

  getComplainantAgeSegments: function () {
    return _state.complainant.ageSegments;
  },

  getOfficerGenderSegments: function () {
    return _state.officer.genderSegments;
  },

  getComplainantGenderSegments: function () {
    return _state.complainant.genderSegments;
  },

  getOfficerRaceSegments: function () {
    return _state.officer.raceSegments;
  },

  getComplainantRaceSegments: function () {
    return _state.complainant.raceSegments;
  },

  addChangeListener: function (callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

RaceGenderAgeTabStore.dispatcherToken = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.RACE_GENDER_TAB_RECEIVED_DATA:
      _state.officer = {};
      _state.complainant = {};
      _state.officer.ageSegments = RaceGenderAPITransform.transformAge(action.data.officers.age, true);
      _state.officer.genderSegments = RaceGenderAPITransform.transformGenders(action.data.officers.gender, true);
      _state.officer.raceSegments = RaceGenderAPITransform.transformRaces(action.data.officers.race, true);
      _state.complainant.ageSegments = RaceGenderAPITransform.transformAge(
        action.data['complaining_witness'].age, false);
      _state.complainant.genderSegments = RaceGenderAPITransform.transformGenders(
        action.data['complaining_witness'].gender, false);
      _state.complainant.raceSegments = RaceGenderAPITransform.transformRaces(
        action.data['complaining_witness'].race, false);
      RaceGenderAgeTabStore.emitChange();
      break;

    default:
      break;
  }
});

module.exports = RaceGenderAgeTabStore;
