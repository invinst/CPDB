var EmbedStore = require('../../stores/EmbedStore');


var Mixin = {
  embedListener: function () {
    EmbedStore.addEnterListener(this.enterEmbedMode);
    EmbedStore.addLeaveListener(this.leaveEmbedMode);
  },

  absoluteUri: function (uri) {
    return location.origin + uri;
  }
};

module.exports = Mixin;
