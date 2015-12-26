"use strict";

const _ = require('underscore');

/**
 * A WhammyMode represents one of the modes on the whammy pedal
 * and contains program change numbers to activate/bypass that mode.
 */
class WhammyMode {
  // Creates a new whammy mode
  constructor(id, name, active, bypass) {
    this.id = id;
    this.name = name;
    // program number to activate this mode
    this.active = active;
    // program number to bypass this mode
    this.bypass = bypass;
  }
}

const MODES = {
  SHALLOW: new WhammyMode(0, "Shallow", 0, 17),
  UP_2_OCTAVES: new WhammyMode(1, "Up 1 octave", 2, 19),

  fromId(id) {
    return _.find(this, (mode) => {
      if (!(mode instanceof WhammyMode)) return false;
      return mode.id === id;
    });
  }
};

module.exports = MODES;
