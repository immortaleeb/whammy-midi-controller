"use strict";

const chai = require('chai'),
      should = chai.should(),
      Sequencer = require('../src/Sequencer'),
      Timer = require('../src/Timer');

const MOCK_TIMER = { on() { } };

// Creates an executable object
function createObject(fn) {
  return { execute: fn };
}

describe('Sequencer', () => {
  describe('#start', () => {
    it('can not start an empty sequence', () => {
      let timer = new Timer();
      let sequencer = new Sequencer(timer);
      chai.expect(sequencer.start.bind(sequencer)).to.throw('A sequencer can only start if there are items to sequence over');
    });

    it('should execute the items in the sequence', (done) => {
      let step = 0;
      let looped = false;
      let sequencer = new Sequencer(new Timer(), [
        createObject(() => {
          step.should.equal(0);
          step = 1;
        }),
        createObject(() => {
          step.should.equal(1);
          step = 2;
        }),
        createObject(() => {
          step.should.equal(2);
          step = 0;
          if (!looped) {
            looped = true;
          } else { 
            sequencer.stop();
            done(); 
          }
        })
      ]);
      sequencer.start();
    });
  });

  describe('stop', () => {
    it('should stop a running sequence', () => {
      let calls = 0;
      let stopCalled = false;
      let timer = {
        start() { },
        stop() { stopCalled = true; },
        on() { }
      };
      let sequencer = new Sequencer(timer, [
        { execute() { } }
      ]);

      sequencer.start();
      sequencer.stop();

      chai.expect(stopCalled).to.equal(true);
    });
  });

  describe('reset', () => {
    it('should reset the sequence to its original position', () => {
      let calls = [0, 0, 0];
      let timer = new Timer(Infinity);
      let sequencer = new Sequencer(timer, [
        { execute() { calls[0]++ } },
        { execute() { calls[1]++ } },
        { execute() { calls[2]++ } }
      ]);
      sequencer.start();
      timer.emit('time');
      sequencer.reset();
      timer.emit('time');
      sequencer.stop();

      calls[0].should.equal(2);
      calls[1].should.equal(1);
      calls[2].should.equal(0);
    });
  });

  describe('addItem', () => {
    it('should add an item', () => {
      let sequence = [ { execute() { } } ]
      let sequencer = new Sequencer(MOCK_TIMER, sequence);
      let fn = { execute() { return 1; } }

      sequencer.addItem(fn);
      sequencer.sequence.length.should.equal(2);
      sequencer.sequence[1].should.equal(fn);
    });
  });

  describe('removeItem', () => {
    it('should remove a single item', () => {
      let fn1 = { execute() { return 1; } };
      let fn2 = { execute() { return 2; } };
      let sequencer = new Sequencer(MOCK_TIMER, [ fn1, fn2 ]);

      sequencer.removeItem(1);
      sequencer.sequence.length.should.equal(1);
      sequencer.sequence[0].should.equal(fn1);
    });

    it('should not remove an invalid index', () => {
      let fn1 = { execute() { return 1; } };
      let fn2 = { execute() { return 2; } };
      let sequencer = new Sequencer(MOCK_TIMER, [ fn1, fn2 ]);

      chai.expect(sequencer.removeItem.bind(sequencer, 3)).to.throw('Index 3 out of range of the sequence');
      sequencer.sequence.length.should.equal(2);
    });
  });
});
