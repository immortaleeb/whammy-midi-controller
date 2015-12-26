"use strict";

const fs = require('fs'),
      WhammyControlAction = require('./WhammyControlAction'),
      WhammyModes = require('./WhammyModes'),
      Sequencer = require('./Sequencer'),
      Timer = require('./Timer'),
      _ = require('underscore');

/**
 * Instances of this class can read and parse JSON files which store sequences of WhammyControlActionS, and properties (such as time interval of the timer) of the sequencer which contains them.
 */
class WhammyControlActionSequencerFileReader {
  constructor(whammyController) {
    this._whammyController = whammyController;
  }

  // Reads a file with the given filename and returns a sequencer via the given callback
  readFile(filename, sequencerCallback) {
    fs.readFile(filename, (err, data) => {
      if (err) throw err;

      let parsedData = JSON.parse(data);
      let options = parsedData.options;

      let timer = new Timer(options.interval);
      let sequence = parsedData.sequence.map(item => {
        let options = _.clone(item);
        if (typeof options.mode !== 'undefined') options.mode = WhammyModes.fromId(options.mode);
        return new WhammyControlAction(this._whammyController, options)
      });
      let sequencer = new Sequencer(timer, sequence);

      sequencerCallback(sequencer);
    });
  }
} 

module.exports = WhammyControlActionSequencerFileReader;
