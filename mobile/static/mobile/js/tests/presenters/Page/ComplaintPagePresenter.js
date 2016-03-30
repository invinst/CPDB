var f, ComplaintPagePresenter, HashUtil;
require('should');

f = require('utils/tests/f');
ComplaintPagePresenter = require('presenters/Page/ComplaintPagePresenter');
HashUtil = require('utils/HashUtil');


describe('ComplaintPagePresenter', function () {
  var categoryId, categoryHashId, category, officerAllegation, officerAllegations, data;

  beforeEach(function () {
    categoryId = 123;
    categoryHashId = HashUtil.encode(categoryId);
    category = f.create('Category', {'id': categoryId});
    officerAllegation = f.create('OfficerAllegation', {'cat': category});
    officerAllegations = f.createBatch(2, 'OfficerAllegation', officerAllegation);
    data = f.create('ComplaintPageData', {'officer_allegations': officerAllegations});
  });

  describe('#accompliceOfficerAllegation', function () {
    it('should return accomplice officer allegation', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);
      presenter.accompliceOfficerAllegation.should.have.length(0);
    });
  });

  describe('#againstOfficerAllegations', function () {
    it('should return against officer allegation', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);
      presenter.againstOfficerAllegations.should.have.length(2);
    });
  });

  describe('#allegation', function () {
    it('should return allegation', function () {
      var allegation = f.create('Allegation');
      var data = f.create('ComplaintPageData', {'allegation': allegation});

      var presenter = ComplaintPagePresenter(data, '');
      presenter.allegation.should.be.equal(allegation);
    });
  });

  describe('#complainingWitnesses', function () {
    it('should return complaining Witnesses', function () {
      var witnesses = f.createBatch(2, 'ComplainingWitness');
      var data = f.create('ComplaintPageData', {'complaining_witnesses': witnesses});

      var presenter = ComplaintPagePresenter(data, '');
      presenter.complainingWitnesses.should.have.length(2);
    });
  });

  describe('#currentOfficerAllegation', function () {
    it('should return current officer allegation', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);

      presenter.currentOfficerAllegation.should.be.eql(officerAllegation);
    });
  });

  describe('#officerAllegations', function () {
    it('should return officer allegations', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);

      presenter.officerAllegations.should.have.length(2);
    });

    it('should return officer allegations sorted by allegations count', function () {
      var presenter;
      var officer1 = f.create('Officer', {'allegations_count': 1});
      var officer2 = f.create('Officer', {'allegations_count': 2});
      var officer3 = f.create('Officer', {'allegations_count': 3});
      var officerAllegation1 = f.create('OfficerAllegation', {'officer': officer1});
      var officerAllegation2 = f.create('OfficerAllegation', {'officer': officer2});
      var officerAllegation3 = f.create('OfficerAllegation', {'officer': officer3});
      data = {
        'officer_allegations': [officerAllegation2, officerAllegation1, officerAllegation3]
      };

      presenter = ComplaintPagePresenter(data, categoryHashId);

      presenter.officerAllegations.should.be.eql([officerAllegation3, officerAllegation2, officerAllegation1]);
    });
  });

  describe('#isInvalidCategory', function () {
    it('should return true if there is current officer allegations', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);
      presenter.isInvalidCategory.should.be.false();
    });
  });

  describe('#numberOfOfficerAllegations', function () {
    it('should return number of officerAllegations', function () {
      var presenter = ComplaintPagePresenter(data, categoryHashId);
      presenter.numberOfOfficerAllegations.should.be.equal(1);
    });
  });
});
