var _ = require('lodash');
var Base = require('../../stores/Base');

var AppDispatcher = require('../../dispatcher/AppDispatcher');
var AppConstants = require('../../constants/AppConstants');
var RelatedOfficersStore = require('./RelatedOfficersStore');
var EventEmitter = require('events').EventEmitter;


var _state = {
  'complaints': [],
  'rawComplaints': [],
  'analytics': {},
  'activeFilter': 'all'
};


var ComplaintSectionStore = _.assign(Base(_state), {
  intersectedWith: function (activeOfficers) {
    return function(complaint)  {
      var involvedOfficers = _.pluck(complaint.officers, 'id');
      var witnessOfficers = _.pluck(complaint.police_witness, 'officer.pk');
      var officers = _.union(involvedOfficers, witnessOfficers);

      return !_(officers).intersection(activeOfficers).isEmpty();
    };
  },

  hasOutcome: function (outcome) {
    return function(complaint) {
      if (outcome == 'all') return true;
      if (outcome == 'disciplined') return (complaint.officer_allegation.final_outcome_class == 'disciplined');
      return ComplaintSectionStore.finalOutcome(complaint) == AppConstants.FILTERS[outcome];
    };
  },

  getComplaints: function (complaints, activeOfficers, activeFilter) {
    if (!_.isEmpty(activeOfficers)) {
      complaints = _(complaints).filter(ComplaintSectionStore.intersectedWith(activeOfficers)).value();
    }

    return _(complaints).filter(ComplaintSectionStore.hasOutcome(activeFilter)).value();
  },

  finalOutcome: function (complaint) {
    var final_finding = complaint.officer_allegation.final_finding;

    if (_(AppConstants.FILTERS).values().contains(final_finding)) {
      return final_finding;
    }

    return 'Other';
  },

  isDisciplined: function (complaint) {
    return complaint.officer_allegation.final_outcome_class == 'disciplined';
  },

  analyzeComplaints: function (complaints) {
    return _(complaints).countBy(ComplaintSectionStore.finalOutcome).merge({
      'All': complaints.length,
      'Disciplined': _(complaints).filter(ComplaintSectionStore.isDisciplined).value().length
    }).value();
  },


  updateComplaints: function (activeFilter) {
    var activeOfficers = RelatedOfficersStore.getState()['activeOfficers'];
    var activeFilter = _state['activeFilter'] = activeFilter || 'all';
    var rawComplaints = _state['rawComplaints'];

    _state['complaints'] = ComplaintSectionStore.getComplaints(rawComplaints, activeOfficers, activeFilter);
  }
});

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case AppConstants.OFFICER_COMPLAINT_LIST_RECEIVED_DATA:
      _state['complaints'] = _state['rawComplaints'] = action.data.officer_allegations;
      _state['analytics'] = action.data.analytics;
      _state['activeFilter'] = 'all';
      ComplaintSectionStore.emitChange();
      break;

    case AppConstants.SET_ACTIVE_COMPLAINT_LIST_FILTER:
      AppDispatcher.waitFor([RelatedOfficersStore.dispatchEvents]);
      ComplaintSectionStore.updateComplaints(action.filter);
      ComplaintSectionStore.emitChange();

      break;

    case AppConstants.SET_ACTIVE_OFFICER:
    case AppConstants.SET_ACTIVE_OFFICER_IN_OFFICER_PAGE:
      AppDispatcher.waitFor([RelatedOfficersStore.dispatchEvents]);
      ComplaintSectionStore.updateComplaints();
      _state['analytics'] = ComplaintSectionStore.analyzeComplaints(_state['complaints']);
      ComplaintSectionStore.emitChange();

      break;

    default:
        break;
  }
});


module.exports = ComplaintSectionStore;
