"use strict";

const chai = require('chai'),
      should = chai.should(),
      Timer = require('../src/Timer');

function timestamp() {
  return new Date().getTime();
}

const PRECISION = 10; // precision in ms

describe('Timer', () => {
  describe('#setInterval', () => {
    it('should set the time interval', () => {
      let timer = new Timer();
      
      timer.setInterval(1000);
      timer.timeInterval.should.equal(1000);

      timer.setInterval(1);
      timer.timeInterval.should.equal(1);
    });

    it('should not set time interval to 0', () => {
      let timer = new Timer();
      const message = 'The interval on a timer must be bigger than 1 ms';

      chai.expect(timer.setInterval.bind(timer, 0)).to.throw(message);
    });

    it('should not set time interval to a negative number', () => {
      let timer = new Timer();
      const message = 'The interval on a timer must be bigger than 1 ms';

      chai.expect(timer.setInterval.bind(timer, -6)).to.throw(message);
    });
  });

  describe('#start', () => {
    it('should start the timer', (done) => {
      let timer = new Timer();
      timer.on('time', () => {
        timer.stop();
        done();
      });
      timer.start();
    });

    it('should emit events until stopped', (done) => {
      let timer = new Timer(5);
      let events = 0;
      timer.on('time', () => {
        events++;
        if (events == 5) {
          timer.stop();
          done();
        }
      });
      timer.start();
    });

    // If this test fails, we might have to lower the precision
    it('should emit events at the right interval times', (done) => {
      let interval = 0,
          events = 0,
          timer = new Timer(),
          now = timestamp(), then;

      timer.on('time', () => {
        events++;

        // Event N should've taken about N*10 ms +- PRECISION ms
        then = timestamp();
        (then - now).should.be.within(interval - PRECISION, interval + PRECISION);
        interval = events*10; // new interval
        timer.setInterval(interval);
        now = then; 

        if (events == 6) {
          timer.stop();
          done();
        }
      });
      timer.start();
    });
  });

  describe('#stop', () => {
    it('should stop the timer', (done) => {
      let timer = new Timer(1);
      timer.start();
      timer.stop();
      timer.on('time', () => chai.assert.fail('Should not be called!'));
      
      // Wait 10 ms before continuing
      setTimeout(() => done(), 10);
    });
  });
});
