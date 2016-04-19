var DocumentPresenter, f, DeviceUtil;
var React = require('react');

var sinon = require('sinon');
require('should');

DeviceUtil = require('utils/DeviceUtil');
f = require('utils/tests/f');
DocumentPresenter = require('presenters/DocumentPresenter');


describe('DocumentPresenter', function () {
  describe('#documentName', function () {
    it('should return document name based its type', function () {
      var document = f.create('Document', {'type': 'CR'});
      DocumentPresenter(document).documentName.should.be.eql('Investigation report');

      document = f.create('Document', {'type': 'CPB'});
      DocumentPresenter(document).documentName.should.be.eql('Police board hearing');

      document = f.create('Document', {'type': ''});
      DocumentPresenter(document).documentName.should.be.eql('Unknown type');
    });
  });

  describe('#documentLink', function () {
    it('should return pdf link if device is iOS one', function () {
      var document = f.create('Document', {'documentcloud_id': '12345', 'normalized_title': 'cr-12345'});
      var link = 'http://documentcloud.org/documents/12345-cr-12345.pdf';
      sinon.stub(DeviceUtil, 'isiOSDevice', function () { return true; });

      DocumentPresenter(document).documentLink.should.be.equal(link);
      DeviceUtil.isiOSDevice.restore();
    });

    it('should return cloud link if device is not iOS one', function () {
      var document = f.create('Document', {'documentcloud_id': '12345', 'normalized_title': 'cr-12345'});
      var link = 'http://documentcloud.org/documents/12345-cr-12345.html';
      sinon.stub(DeviceUtil, 'isiOSDevice', function () { return false; });
      DocumentPresenter(document).documentLink.should.be.equal(link);
      DeviceUtil.isiOSDevice.restore();
    });
  });

  describe('#documentStatus', function () {
    it('should return document status based on its type', function () {
      var document = f.create('Document', {'documentcloud_id': 'something'});
      DocumentPresenter(document).documentStatus.should.be.eql('Available');

      document = f.create('Document', {'requested': true, 'documentcloud_id': ''});
      DocumentPresenter(document).documentStatus.should.be.eql('Pending');

      document = f.create('Document', {'requested': false, 'documentcloud_id': ''});
      DocumentPresenter(document).documentStatus.should.be.eql('Missing');
    });
  });

  describe('#documentAction', function () {
    it('should return correct document action corresponding to its status', function () {
      var document = f.create('Document', {'documentcloud_id': 'something'});
      DocumentPresenter(document).documentAction.should.be.eql('View');

      document = f.create('Document', {'requested': true, 'documentcloud_id': ''});
      DocumentPresenter(document).documentAction.should.be.eql('Follow');

      document = f.create('Document', {'requested': false, 'documentcloud_id': ''});
      DocumentPresenter(document).documentAction.should.be.eql('Request');
    });
  });
});
