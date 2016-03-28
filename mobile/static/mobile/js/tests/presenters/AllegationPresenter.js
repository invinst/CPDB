var f, AllegationPresenter;

require('should');
f = require('utils/tests/f');

AllegationPresenter = require('presenters/AllegationPresenter');


describe('AllegationPresenter', function () {
  describe('#crid', function () {
    it('should return crid', function () {
      var allegation = f.create('Allegation');

      var presenter = AllegationPresenter(allegation);
      presenter.crid.should.be.equal(allegation['crid']);
    });

    it('should return Unknown if there is no crid', function () {
      var allegation = f.create('Allegation', { 'crid': '' });
      var presenter = AllegationPresenter(allegation);

      presenter.crid.should.be.equal('Unknown');
    });
  });

  describe('#incidentDate', function () {
    it('should return moment incident date', function () {
      var date = '2012-01-19T09:11:00';
      var allegation = f.create('Allegation', { 'incident_date': date });
      var presenter = AllegationPresenter(allegation);

      presenter.incidentDate.date().should.be.equal(19);
      presenter.incidentDate.month().should.be.equal(0);
      presenter.incidentDate.year().should.be.equal(2012);
    });
  });

  describe('#incidentDateDisplay', function () {
    it('should return incident date present', function () {
      var date = '2012-01-19T09:11:00';
      var expectedDate = 'Jan 19, 2012';
      var allegation = f.create('Allegation', { 'incident_date': date });
      var presenter = AllegationPresenter(allegation);

      presenter.incidentDateDisplay.should.be.equal(expectedDate);
    });

    it('should return unknown date if there is invalid date', function () {
      var date = 'invalid';
      var allegation = f.create('Allegation', { 'incident_date': date });
      var presenter = AllegationPresenter(allegation);

      presenter.incidentDateDisplay.should.be.equal('Unknown date');
    });
  });

  describe('#address', function () {
    it('should return full address', function () {
      var add1 = 'add1';
      var add2 = 'add2';
      var expectedAddress = 'add1 add2';
      var allegation = f.create('Allegation', { 'add1': add1, 'add2': add2 });
      var presenter = AllegationPresenter(allegation);

      presenter.address.should.be.equal(expectedAddress);
    });

    it('should return partial address if only one address is provided', function () {
      var add1 = 'add1';
      var add2 = 'add2';
      var allegation1 = f.create('Allegation', { 'add1': add1 });
      var presenter1 = AllegationPresenter(allegation1);
      var allegation2 = f.create('Allegation', { 'add2': add2 });
      var presenter2 = AllegationPresenter(allegation2);

      presenter1.address.should.be.equal(add1);
      presenter2.address.should.be.equal(add2);
    });

    it('should return empty address if there is no address', function () {
      var allegation = f.create('Allegation');
      var presenter = AllegationPresenter(allegation);

      presenter.address.should.be.equal('');
    });
  });

  describe('#city', function () {
    it('should return city', function () {
      var city = 'city';
      var allegation = f.create('Allegation', { 'city': city });
      var presenter = AllegationPresenter(allegation);

      presenter.city.should.be.equal(city);
    });

    it('should return empty string if city is not provided', function () {
      var allegation = f.create('Allegation');
      var presenter = AllegationPresenter(allegation);

      presenter.city.should.be.equal('');
    });
  });

  describe('#locationType', function () {
    it('should return locationType', function () {
      var location = 'location';
      var allegation = f.create('Allegation', { 'location': location });
      var presenter = AllegationPresenter(allegation);

      presenter.locationType.should.be.equal(location);
    });

    it('should return enpty string if no location provided', function () {
      var allegation = f.create('Allegation');
      var presenter = AllegationPresenter(allegation);

      presenter.locationType.should.be.equal('');
    });
  });

  describe('#beat', function () {
    it('should return beat name', function () {
      var beatName = 'beatName';
      var allegation = f.create('Allegation', { 'beat': { 'name': beatName} });
      var presenter = AllegationPresenter(allegation);

      presenter.beat.should.be.equal(beatName);
    });

    it('should return empty string if there is no beat name', function () {
      var allegation = f.create('Allegation', { 'beat': null });
      var presenter = AllegationPresenter(allegation);

      presenter.beat.should.be.equal('');
    });
  });

  describe('#documentId', function () {
    it('should return document id ', function () {
      var documentId = '123467';
      var allegation = f.create('Allegation', { 'document_id': documentId });
      var presenter = AllegationPresenter(allegation);

      presenter.documentId.should.be.equal(documentId);
    });

    it('should return empty if there is no document id', function () {
      var documentId = 0;
      var allegation = f.create('Allegation', { 'document_id': documentId });
      var presenter = AllegationPresenter(allegation);

      presenter.documentId.should.be.equal('');
    });
  });

  describe('#documentNormalizedTitle', function () {
    it('should return document normalized title', function () {
      var documentNormalizedTitle = 'cr-123467';
      var allegation = f.create('Allegation', { 'document_normalized_title': documentNormalizedTitle });
      var presenter = AllegationPresenter(allegation);

      presenter.documentNormalizedTitle.should.be.equal(documentNormalizedTitle);
    });

    it('should return empty if there is no document normalized title', function () {
      var documentNormalizedTitle = null; // this might not happens in real example
      var allegation = f.create('Allegation', { 'document_normalized_title': documentNormalizedTitle });
      var presenter = AllegationPresenter(allegation);

      presenter.documentNormalizedTitle.should.be.equal('');
    });
  });

  describe('#hasLocation', function () {
    it('should return true if have any address properties', function () {
      var addressProperties = ['beat', 'location', 'add1', 'add2', 'city', 'point'];
      var i,
        params,
        allegation,
        presenter;

      for (i = 0; i < addressProperties.length; i++) {
        params = {};
        params[addressProperties[i]] = 'property';
        allegation = f.create('Allegation', params);
        presenter = AllegationPresenter(allegation);

        presenter.hasLocation.should.be.true();
      }
    });

    it('should return false if there is no address properties', function () {
      var allegation = f.create('Allegation', {
        'beat': null, 'location': null, 'add1': null, 'add2': null, 'city': null, 'point': null
      });
      var presenter = AllegationPresenter(allegation);

      presenter.hasLocation.should.be.false();
    });

  });


  describe('#hasFullAddress', function () {
    it('should return true if there is full address', function () {
      var allegation = f.create('Allegation', { 'add1': 'add', 'add2': 'add2' });
      var presenter = AllegationPresenter(allegation);

      presenter.hasFullAddress.should.be.true();
    });

    it('should return false if there is only one address', function () {
      var allegation = f.create('Allegation', { 'add1': 'add1' });
      var presenter = AllegationPresenter(allegation);

      presenter.hasFullAddress.should.be.false();
    });

    it('should return false if there is empty address', function () {
      var allegation = f.create('Allegation', { 'add1': '', 'add2': '' });
      var presenter = AllegationPresenter(allegation);

      presenter.hasFullAddress.should.be.false();
    });
  });
});
