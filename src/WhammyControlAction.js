"use strict";

/**
 * A WhammyControlAction uses a WhammyController to set the mode and treadle level
 * of a whammy pedal to specific values when execute() is called.
 */
class WhammyControlAction {
  // Creates a new action. If mode or treadleLevel are undefined, the mode resp. treadle level of the pedal will not be changed
  constructor(whammyController, options) {
    options = options || {};

    this._whammyController = whammyController;
    this.mode = options.mode;
    this.treadleLevel = options.treadleLevel;
  }

  // Sets the mode and treadle level of the whammy pedal
  execute() {
    let controller = this._whammyController;

    if (this.mode) controller.mode = this.mode;
    if (typeof this.treadleLevel !== 'undefined') controller.treadleLevel = this.treadleLevel;
  }
}

module.exports = WhammyControlAction;
