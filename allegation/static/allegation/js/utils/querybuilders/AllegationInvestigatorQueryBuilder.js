var AllegationInvestigatorQueryBuilder = {
  buildQuery: function (investigatorId) {
    return investigatorId ? 'allegation__investigator='+investigatorId : '';
  }
};

module.exports = AllegationInvestigatorQueryBuilder;
