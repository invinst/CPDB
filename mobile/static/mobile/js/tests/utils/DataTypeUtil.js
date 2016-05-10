var u = require('utils/HelperUtil');
var DataTypeUtil = require('utils/DataTypeUtil');

require('should');


describe('DataTypeUtil', function () {
  describe('#isValidCridQueryFormat', function () {
    it('should accept valid crid query format', function () {
      var i, query;
      var templates = ['cr {crid}', 'CR {crid}', 'cr{crid}', 'CR{crid}', 'crid {crid}', 'CRID {crid}', '{crid}'];
      var crid = 123456;

      for (i = 0; i < templates.length; i++) {
        query = u.format(templates[i], {'crid': crid});
        DataTypeUtil.isValidCridQueryFormat(query).should.be.true();
      }
    });

    it('should reject invalid crid query format', function () {
      var i, query;
      var templates = ['cri {crid}', 'CRd {crid}', 'cr_{crid}', 'aCR{crid}', 'cridd {crid}', 'CRID  1 {crid}'];
      var crid = 123456;

      for (i = 0; i < templates.length; i++) {
        query = u.format(templates[i], {'crid': crid});
        DataTypeUtil.isValidCridQueryFormat(query).should.be.false();
      }
    });
  });
});
