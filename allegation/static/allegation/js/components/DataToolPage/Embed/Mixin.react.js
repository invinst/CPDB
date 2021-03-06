var EmbedStore = require('stores/EmbedStore');


var Mixin = {
  stateToString: function (state) {
    return encodeURIComponent(JSON.stringify(state));
  },

  embedListener: function () {
    EmbedStore.addEnterListener(this.enterEmbedMode);
    EmbedStore.addLeaveListener(this.leaveEmbedMode);
  },

  removeEmbedListener: function () {
    EmbedStore.removeEnterListener(this.enterEmbedMode);
    EmbedStore.removeLeaveListener(this.leaveEmbedMode);
  },

  absoluteUri: function (uri) {
    return location.origin + uri;
  }
};

module.exports = Mixin;
