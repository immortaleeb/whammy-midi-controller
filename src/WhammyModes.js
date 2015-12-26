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
  // Detune
  SHALLOW: new WhammyMode(0, "Shallow", 0, 17),
  DEEP: new WhammyMode(1, "Deep", 1, 18),

  // Whammy
  UP_2_OCTAVES: new WhammyMode(2, "Up 2 octaves", 2, 19),
  UP_1_OCTAVE: new WhammyMode(3, "Up 1 octave", 3, 20),
  DOWN_1_OCTAVE: new WhammyMode(4, "Down 1 octave", 4, 21),
  DOWN_2_OCTAVES: new WhammyMode(5, "Down 2 octaves", 5, 22),
  DIVE_BOMB: new WhammyMode(6, "Dive bomb", 6, 23),
  DROP_TUNE: new WhammyMode(7, "Drop tune", 7, 24),

  // Harmony
  HARMONY_OCTAVE: new WhammyMode(8, "Octave up/Octave down", 8, 25),
  HARMONY_5D_4D: new WhammyMode(9, "5th down/4th down", 9, 26),
  HARMONY_4D_3D: new WhammyMode(10, "4th down/3rd down", 10, 27),
  HARMONY_5U_7U: new WhammyMode(11, "5th up/7th up", 11, 28),
  HARMONY_5U_6U: new WhammyMode(12, "5th up/6th up", 12, 29),
  HARMONY_4U_5U: new WhammyMode(13, "4th up/5th up", 13, 30),
  HARMONY_3U_4U: new WhammyMode(14, "3rd up/4th up", 14, 31),
  HARMONY_MIN3U_3U: new WhammyMode(15, "Minor 3th up/3th up", 15, 32),
  HARMONY_2U_3U: new WhammyMode(16, "2nd up/3th up", 16, 33),

  fromId(id) {
    return _.find(this, (mode) => {
      if (!(mode instanceof WhammyMode)) return false;
      return mode.id === id;
    });
  }
};

module.exports = MODES;
