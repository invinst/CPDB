var InterfaceTextUtil, LocalStorageUtil;

var sinon = require('sinon');
var timekeeper = require('timekeeper');
require('should');

InterfaceTextUtil = require('utils/InterfaceTextUtil');
LocalStorageUtil = require('utils/LocalStorageUtil');


describe('InterfaceTextUtil', function () {
  describe('#isExpired', function () {
    it('should return true if expired time is not saved', function () {
      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        return null;
      });
      InterfaceTextUtil.isExpired().should.be.true();
      LocalStorageUtil.getItem.restore();
    });

    it('should return true if expired time is before now', function () {
      var now = 1330688329323;
      var expired = 1330688329322;

      timekeeper.freeze(new Date(now));

      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        if (key == 'interfaceTextExpiredTime') {
          return expired;
        }
        return null;
      });
      InterfaceTextUtil.isExpired().should.be.true();

      LocalStorageUtil.getItem.restore();
    });

    it('should return false if expired time is after now', function () {
      var now = 1330688329322;
      var expired = 1330688329323;

      timekeeper.freeze(new Date(now));

      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        if (key == 'interfaceTextExpiredTime') {
          return expired;
        }
        return null;
      });
      InterfaceTextUtil.isExpired().should.be.false();

      LocalStorageUtil.getItem.restore();
    });
  });

  describe('#isCached', function () {
    it('should return false if object is not saved', function () {
      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        return null;
      });

      InterfaceTextUtil.isCached().should.be.false();

      LocalStorageUtil.getItem.restore();
    });

    it('should return false if time is expired', function () {
      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        if (key == 'interfaceTexts') {
          return 'something';
        }
        return null;
      });
      sinon.stub(InterfaceTextUtil, 'isExpired', function () {
        return true;
      });

      InterfaceTextUtil.isCached().should.be.false();

      LocalStorageUtil.getItem.restore();
      InterfaceTextUtil.isExpired.restore();
    });

    it('should return true if object is save and time is not expired', function () {
      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        if (key == 'interfaceTexts') {
          return 'something';
        }
        return null;
      });
      sinon.stub(InterfaceTextUtil, 'isExpired', function () {
        return false;
      });

      InterfaceTextUtil.isCached().should.be.true();

      LocalStorageUtil.getItem.restore();
      InterfaceTextUtil.isExpired.restore();
    });
  });

  describe('#getLocalStorageItem', function () {
    it('should return empty object if object is not saved', function () {
      sinon.stub(LocalStorageUtil, 'getItem', function () {
        return null;
      });

      InterfaceTextUtil.getLocalStorageItem().should.be.eql({});

      LocalStorageUtil.getItem.restore();
    });

    it('should return saved object', function () {
      var interfaceText = {
        'key': 'value'
      };

      sinon.stub(LocalStorageUtil, 'getItem', function (key) {
        if (key == 'interfaceTexts') {
          return JSON.stringify(interfaceText);
        }
        return null;
      });

      InterfaceTextUtil.getLocalStorageItem().should.be.eql(interfaceText);

      LocalStorageUtil.getItem.restore();
    });
  });
});
