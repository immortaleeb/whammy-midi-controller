"use strict";

class MidiOutputMock {
  constructor(sendCallback) {
    this._sendCallback = sendCallback || () => {};
  }

  send(type, data) {
    this._sendCallback(type, data);
  }
}

module.exports = MidiOutputMock;
