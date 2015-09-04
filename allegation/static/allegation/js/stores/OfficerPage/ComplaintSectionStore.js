var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var MapConstants = require('../../constants/MapConstants');
var RelatedOfficersStore = require('./RelatedOfficersStore');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');


var _state = {
  'complaints': [],
  'rawComplaints': [],
  'analytics': {},
  'activeFilter': 'all'
}

function intersectedWith(activeOfficers) {
  return function(complaint)  {
    var involvedOfficers = _.pluck(complaint.officers, 'id');
    var witnessOfficers = _.pluck(complaint.police_witness, 'officer.pk');
    var officers = _.union(involvedOfficers, witnessOfficers);
    // order in _.difference() is important!
    return _.isEmpty(_.difference(activeOfficers, officers));
  }
}

function hasOutcome(outcome) {
  return function(complaint) {
    if (outcome == 'all') return true;
    if (outcome == 'disciplined') return (complaint.allegation.final_outcome_class == 'disciplined');
    return finalOutcome(complaint) == AppConstants.FILTERS[outcome];
  }
}

function hasNoInvolvedOfficer(complaint) {
  return _.isEmpty(complaint.officers);
}

function getComplaints(complaints, activeOfficers, activeFilter) {
  if (!_.isEmpty(activeOfficers)) {
    complaints = _(complaints).reject(hasNoInvolvedOfficer).filter(intersectedWith(activeOfficers)).value();
  }

  return _(complaints).filter(hasOutcome(activeFilter)).value()
}

function finalOutcome(complaint) {
  var final_finding = complaint.allegation.final_finding;

  if (_(AppConstants.FILTERS).values().contains(final_finding)) {
    return final_finding;
  }

  return 'Other';
}

function analyzeComplaints(complaints) {
  return _(complaints).countBy(finalOutcome).merge({
    'All': complaints.length
  }).value();
}


function updateComplaints(activeFilter) {
  var activeOfficers = RelatedOfficersStore.getState()['activeOfficers'];
  var activeFilter = _state['activeFilter'] = activeFilter || 'all';
  var rawComplaints = _state['rawComplaints'];
  _state['complaints'] = getComplaints(rawComplaints, activeOfficers, activeFilter);
}

var ComplaintSectionStore = assign({}, EventEmitter.prototype, {
  getState: function() {
    return _state;
  },

  addChangeListener: function(callback) {
    this.on(AppConstants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(AppConstants.CHANGE_EVENT, callback);
  },

  emitChange: function() {
    this.emit(AppConstants.CHANGE_EVENT);
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
  case AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA:
    _state['complaints'] = _state['rawComplaints'] = action.data.allegations;
    _state['analytics'] = action.data.analytics;
    break;

  case AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER:
    AppDispatcher.waitFor([RelatedOfficersStore.dispatchEvents]);
    updateComplaints(action.filter);
    break;

  case MapConstants.SET_ACTIVE_OFFICER:
    AppDispatcher.waitFor([RelatedOfficersStore.dispatchEvents]);
    updateComplaints();
    _state['analytics'] = analyzeComplaints(_state['complaints']);
    break;

  default:
      break;
  }
  ComplaintSectionStore.emitChange();
});


module.exports = ComplaintSectionStore;
