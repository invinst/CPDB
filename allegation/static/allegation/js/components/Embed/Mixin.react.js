var EmbedStore = require('../../stores/EmbedStore');


var Mixin = {
  enterEmbedMode: function () {
    console.log(this);
  },

  leaveEmbedMode: function () {
    console.log(this);
  },

  embedListener: function () {
    EmbedStore.addEnterListener(this.enterEmbedMode);
    EmbedStore.addLeaveListener(this.leaveEmbedMode);
  }
};

module.exports = Mixin;
