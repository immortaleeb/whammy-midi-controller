"use strict";

/**
 * A WhammyMode represents one of the modes on the whammy pedal
 * and contains program change numbers to activate/bypass that mode.
 */
class WhammyMode {
  // Creates a new whammy mode
  constructor(name, active, bypass) {
    this.name = name;
    // program number to activate this mode
    this.active = active;
    // program number to bypass this mode
    this.bypass = bypass;
  }
}

const MODES = {
  SHALLOW: new WhammyMode("Shallow", 0, 17),
  UP_2_OCTAVES: new WhammyMode("Up 1 octave", 2, 19)
};

module.exports = MODES;
