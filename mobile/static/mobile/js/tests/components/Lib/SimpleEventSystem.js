var SimpleEventSystem = require('components/Lib/SimpleEventSystem');

var sinon = require('sinon');
require('should');


describe('SimpleEventSystem', function () {
  describe('#register', function () {
    it('should create new callbacks list if not existing', function () {
      var eventSystem = SimpleEventSystem();
      eventSystem.register('target', 'callback');
      eventSystem.getCallbacks()['target'].should.be.eql(['callback']);
    });

    it('should add new callback to the existing', function () {
      var eventSystem = SimpleEventSystem();
      eventSystem.register('target1', 'callback1');
      eventSystem.register('target2', 'callback2');

      eventSystem.getCallbacks()['target2'].should.be.eql(['callback2']);
    });
  });

  describe('#unregister', function () {
    it('should remove callback from the list', function () {
      var eventSystem = SimpleEventSystem();
      eventSystem.unregister('target');

      eventSystem.getCallbacks()['target'].should.be.eql([]);
    });
  });

  describe('#dispatch', function () {
    it('should call corresponding callback function', function () {
      var eventSystem;
      var callbackObj = {
        'callback': function () {
          return 'test';
        }
      };
      var mock = sinon.mock(callbackObj);
      mock.expects('callback').once().returns('test');

      eventSystem = SimpleEventSystem();
      eventSystem.register('target', callbackObj.callback);

      eventSystem.dispatch('target');

      mock.verify();
      mock.restore();
    });
  });
});
