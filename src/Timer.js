"use strict";

const EventEmitter = require('events').EventEmitter;

// Returns a timestamp for the current time
function timestamp() {
  return new Date().getTime();
}

/**
 * A Timer sends out a time event every timeInterval milliseconds
 */
class Timer extends EventEmitter {
  // Creates a new timer
  constructor(timeInterval) {
    super();
    this.setInterval(timeInterval);
    this._running = false;
  }

  // Returns the time interval in milliseconds
  get timeInterval() { return this._timeInterval; }

  _onTimeout() {
    var now, timeout;

    // Check if are still running
    if (!this._running) return;

    // Emit a time event
    this.emit('time');

    // Calculate our next target time and current time
    this._nextTargetTime += this._timeInterval;
    now = timestamp();
    timeout = this._nextTargetTime - now;
    if (timeout < 0) {
      timeout = 0;
      console.error("Timer interval is set too small, can't keep up!");
    }

    // Call this function recursively on the target time
    setTimeout(this._onTimeout.bind(this), timeout);
  }

  // Starts the timer
  start() {
    if (!this._running) {
      // Start the clock!
      this._running = true;
  
      // Emit an initial event on start
      this.emit('time');

      // Calculate our next target time
      this._nextTargetTime = timestamp() + this._timeInterval;

      // Call the timeout function on the target timeout
      setTimeout(this._onTimeout.bind(this), this._timeInterval);
    }
  }

  // Stops the timer
  stop() {
    if (this._running) {
      this._running = false;
    }
  }

  // Sets the time interval for the timer in milliseconds
  setInterval(newInterval) {
    if (newInterval < 1)
      throw new Error('The interval on a timer must be bigger than 1 ms');

    this._timeInterval = newInterval;
  }
}

module.exports = Timer;
