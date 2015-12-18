"use strict";

const _ = require('underscore');

/**
 * A WhammyController can be used to send midi signals to a whammy pedal to control its state
 */
class WhammyController {
  // Creates a new WhammyController
  constructor(midiOutput, midiChannel) {
    this._midiOutput = midiOutput;
    this._midiChannel = midiChannel;
  }

  // Sends data to the pedal on the selected midi channel
  _send(type, data) {
    this._midiOutput.send(type, _.extend(data, { channel: this._midiChannel } )); 
  }

  // Returns the current Mode the whammy is in, or undefined in case it is not known
  // get mode() { return this._mode; }

  // Returns the level/height of the pedal's treadle, or undefined in case it is not known
  // get treadleLevel() { return this._treadleLevel; }

  // Changes the Mode of the whammy pedal to the given mode
  set mode(newMode) {
    this._mode = newMode;
    // Send a program change
    this._send('program', { number: this._mode.active });
  }

  // Changes the treadle level to the given level
  set treadleLevel(newLevel) {
    if (newLevel < 0 || newLevel > 127)
      throw new Error('The treadle level must lie between 0 and 127');

    this._treadleLevel = newLevel;
    // Send a CC11 value change
    this._send('cc', { controller: 11, value: newLevel });
  }
}

module.exports = WhammyController;
