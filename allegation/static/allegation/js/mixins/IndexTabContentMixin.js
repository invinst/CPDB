var classnames = require('classnames');

var NavActions = require('actions/NavActions');


var IndexTabContentMixin = {
	navigate: function (e) {
    NavActions.goToPage($(e.target).data('target'));
	},

  getPanelClass: function (tab) {
    return classnames('tab-pane active', {
      'landing-page': tab != 'data'
    });
  },
}

module.exports = IndexTabContentMixin;
