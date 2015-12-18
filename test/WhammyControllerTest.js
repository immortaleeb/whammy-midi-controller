"use strict";

const WhammyController = require('../src/WhammyController'),
      chai = require('chai'),
      should = chai.should(),
      MidiOutputMock = require('./MidiOutputMock'),
      WhammyModes = require('../src/WhammyModes');

const CHANNEL = 0;
const DUMMY_OUTPUT = new MidiOutputMock();

describe('WhammyController', () => { 
  describe('#mode', () => {
    it('should change modes', () => {
      let controller = new WhammyController(DUMMY_OUTPUT, CHANNEL);

      controller.mode = WhammyModes.SHALLOW;
      controller._mode.should.equal(WhammyModes.SHALLOW);
      controller.mode = WhammyModes.UP_2_OCTAVES;
      controller._mode.should.equal(WhammyModes.UP_2_OCTAVES);
    });

    it('should send a program change', (done) => {
      let midiOutput = new MidiOutputMock((type, data) => {
        type.should.equal('program');
        data.should.have.property('channel');
        data.channel.should.equal(CHANNEL);
        data.should.have.property('number');
        data.number.should.equal(WhammyModes.SHALLOW.active);
        done();
      });

      let controller = new WhammyController(midiOutput, CHANNEL);
      controller.mode = WhammyModes.SHALLOW;
    });
  });

  describe('#treadleLevel', () => {
    it('should set the treadle level', () => {
      let controller = new WhammyController(DUMMY_OUTPUT, CHANNEL);
      controller.treadleLevel = 0;
      controller._treadleLevel.should.equal(0);

      controller.treadleLevel = 100;
      controller._treadleLevel.should.equal(100);

      controller.treadleLevel = 127;
      controller._treadleLevel.should.equal(127);
    });

    it('should not accept negative levels', () => {
      let controller = new WhammyController(DUMMY_OUTPUT, CHANNEL);
      const message = 'The treadle level must lie between 0 and 127';

      let setTreadleLevel = controller.__lookupSetter__('treadleLevel');
      chai.expect(setTreadleLevel.bind(controller, -1)).to.throw(message);
      chai.expect(setTreadleLevel.bind(controller, -100)).to.throw(message);
    });

    it('should not accept levels bigger than 127', () => {
      let controller = new WhammyController(DUMMY_OUTPUT, CHANNEL);
      const message = 'The treadle level must lie between 0 and 127';

      let setTreadleLevel = controller.__lookupSetter__('treadleLevel');
      chai.expect(setTreadleLevel.bind(controller, 128)).to.throw(message);
      chai.expect(setTreadleLevel.bind(controller, 300)).to.throw(message);
    });

    it('should send a CC11 message', (done) => {
      let midiOuput = new MidiOutputMock((type, data) => {
        type.should.equal('cc');
        data.should.have.property('channel');
        data.channel.should.equal(CHANNEL);
        data.should.have.property('controller');
        data.controller.should.equal(11);
        data.should.have.property('value');
        data.value.should.equal(17);
        done();
      });

      let controller = new WhammyController(midiOuput, CHANNEL);
      controller.treadleLevel = 17;
    });
  });
});
