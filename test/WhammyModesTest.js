const WhammyModes = require('../src/WhammyModes'),
      chai = require('chai'),
      should = chai.should();

describe('WhammyModes', () => {
  describe('Shallow mode', () => {
    it('exists', () => {
      WhammyModes.should.have.property('SHALLOW');
    });

    it('has a name', () => {
      WhammyModes.SHALLOW.should.have.property('name');
    });

    it('has an active program number', () => {
      WhammyModes.SHALLOW.should.have.property('active');
      WhammyModes.SHALLOW.active.should.not.equal(undefined);
    });

    it('has a bypass program number', () => {
      WhammyModes.SHALLOW.should.have.property('bypass');
      WhammyModes.SHALLOW.bypass.should.not.equal(undefined);
    });
  });

  describe('#fromId', () => {
    it('should find shallow mode by id', () => {
      WhammyModes.fromId(0).should.equal(WhammyModes.SHALLOW);
    });

    it('should not find a mode for an invalid id', () => {
      should.equal(WhammyModes.fromId(100000), undefined);
    });
  });
}); 
