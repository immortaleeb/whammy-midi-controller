"use strict";

const chai = require('chai'),
      should = chai.should(),
      WhammyControlAction = require('../src/WhammyControlAction'),
      WhammyModes = require('../src/WhammyModes');

const CONTROLLER_MOCK = { set mode(m) { }, set treadleLevel(l) { } };

describe('WhammyControlAction', () => {
  describe('constructor', () => {
    it('should set the mode on an action', () => {
      let action = new WhammyControlAction(CONTROLLER_MOCK, { mode: WhammyModes.SHALLOW });
      
      action.mode.should.equal(WhammyModes.SHALLOW);
    });

    it('should set the treadle level on an action', () => {
      let action = new WhammyControlAction(CONTROLLER_MOCK, { treadleLevel: 105 });
      
      action.treadleLevel.should.equal(105);
    });
  });

  describe('#execute()', () => {
    it('should change the mode when set', () => {
      let mode;
      let controller = { set mode(m) { mode = m; } };
      let action = new WhammyControlAction(controller, { mode: WhammyModes.SHALLOW });

      action.execute();
      mode.should.equal(WhammyModes.SHALLOW);
    });

    it('should not change the mode when not set', () => {
      let mode = WhammyModes.UP_2_OCTAVES;
      let controller = { set mode(m) { mode = m; } };
      let action = new WhammyControlAction(controller);

      action.execute();
      mode.should.equal(WhammyModes.UP_2_OCTAVES);
    });

    it('should change the treadle level when set', () => {
      let level = 0;
      let controller = { set treadleLevel(l) { level = l; } };
      let action = new WhammyControlAction(controller, { treadleLevel: 34 });

      action.execute();
      level.should.equal(34);
    });

    it('should not change the treadle level when not set', () => {
      let level = 5;
      let controller = { set treadleLevel(l) { level = l; } };
      let action = new WhammyControlAction(controller);

      action.execute();
      level.should.equal(5);
    });
  });
});
