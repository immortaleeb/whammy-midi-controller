"use strict";

/**
 * A sequencer goes through a list of objects and calls execute() on them
 * each time a given timer emits a time event
 */
class Sequencer {
  // Creates a new sequencer
  constructor(timer, sequence) {
    this._timer = timer;
    this._sequence = (sequence && sequence.slice(0)) || [];
    this._currentIndex = 0;
    
    // Stop the timer if it is running
    if (this._timer.isRunning) this._timer.stop();
    // Register an event listener to the time event
    this._timer.on('time', () => { this._onTimeEvent()});
  }

  // Returns the sequence
  get sequence() { return this._sequence; }

  // Called when a time event is sent by the timer
  _onTimeEvent() {
    let sequence = this._sequence;

    // Get the current item that needs to be executed
    let currentItem = sequence[this._currentIndex];

    // Set the index for the next item in the sequence
    this._currentIndex = (this._currentIndex + 1) % this._sequence.length;

    // Execute the current item
    currentItem.execute();
  }

  // Starts sequencing through the sequence
  start() {
    if (!this._sequence || this._sequence.length <= 0)
      throw new Error('A sequencer can only start if there are items to sequence over');

    this._timer.start();
  }

  // Stops sequencing
  stop() {
    this._timer.stop();
  }

  // Resets the sequencing, so we're back at the first item in the sequence
  reset() {
    this._currentIndex = 0;
  }

  // Adds an item to the end of the sequence
  addItem(item) {
    this._sequence.push(item);
  }

  // Removes the item in the sequence on the given index
  removeItem(index) {
    if (this._sequence.length <= 0 || index >= this._sequence.length)
      throw new Error('Index ' + index + ' out of range of the sequence');

    this._sequence.splice(index, 1);
  }
}

module.exports = Sequencer;
