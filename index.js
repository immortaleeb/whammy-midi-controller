"use strict";

const minimist = require('minimist'),
      easymidi = require('easymidi');

function parseArguments() {
  let argv = minimist(process.argv.slice(2));

  if (argv.h || argv.help) return { mode: 'help' };
  if (argv.l || argv.list) return { mode: 'list' };

  // Parse midi output index
  let midiOutputIndex = typeof argv.o === 'undefined' ? argv.output : argv.o;
  if (typeof midiOutputIndex === 'undefined') throw new Error("Please supply a midi output number");

  // Get midi output corresponding to the given index
  let midiOutputs = easymidi.getOutputs();
  if (midiOutputIndex < 0 || midiOutputIndex >= midiOutputs.length)
    throw new Error(`${midiOutputIndex} is an invalid midi output number`);
  let midiOutput = midiOutputs[midiOutputIndex];

  // Parse the midi channel
  let midiChannel = typeof argv.c === 'undefined' ? argv.channel : argv.c;
  if (typeof midiChannel === 'undefined') throw new Error("Please supply a valid midi output channel");
  if (midiChannel < 0 || midiChannel > 15)
    throw new Error(`Invalid midi channel '${midiChannel}' outside of the range of [0,15] was given`);

  // Return options
  return { midiOutput, midiChannel };
}

function listMidiOutputs() {
  console.log('Available outputs:');
  let outputsList = easymidi.getOutputs()
    .map((output, i) => `${i} - ${output}`)
    .join('\n');
  console.log(outputsList);
}

function printHelp() {
  console.log(`Usage: ${process.argv[1]} -o midi_output_index -c midi_channel`);
  console.log(`       ${process.argv[1]} --output midi_output_index --channel midi_channel`);
  console.log(`       ${process.argv[1]} -l`);
  console.log(`       ${process.argv[1]} --list`);
  console.log(`       ${process.argv[1]} -h`);
  console.log(`       ${process.argv[1]} --help`);
}

function main() {
  console.log('hello');
}

const modeHandlers = {
  'help': printHelp,
  'list': listMidiOutputs,
  'default': main
};

// Parse the command line arguments
let options;
try { options = parseArguments(); } catch (e) { console.log(e.message); printHelp(); process.exit(1); }

// Execute different functions depending on the selected mode
let modeHandler = modeHandlers[options.mode || 'default'];
modeHandler();
