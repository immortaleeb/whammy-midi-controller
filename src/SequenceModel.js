'use strict';

const EventEmitter = require('events').EventEmitter;

class SequenceModel extends EventEmitter {
  constructor() {
    super();
    this._sequence = [];
  }

  get sequence() {
    return this._sequence;
  }

  setSequence(newSequence) {
    this._sequence = newSequence.slice(0);
    this.emit('sequenceChanged', this._sequence);
  }

  at(index) {
    return this._sequence[index];
  }

  remove(index) {
    this._sequence.splice(index, 1);
    this.emit('sequenceChanged', this._sequence);
  }

  add(step) {
    this._sequence.push(step);
    this.emit('sequenceChanged', this._sequence);
  }
}

module.exports = SequenceModel;
