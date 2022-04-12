const kaholo = require("kaholo-plugin-library");
const SFDX = require("./sfdx");
const utils = require("./utils");

async function deployProject(parameters) {
  const {
    sourceDirectory,
    testLevel,
    outputJson,
  } = parameters;

  const credentials = utils.getCredentials(parameters);

  return SFDX.deployProject({
    credentials,
    sourceDirectory,
    testLevel,
    outputJson,
  });
}

async function validateProject(parameters) {
  const {
    sourceDirectory,
    testLevel,
    outputJson,
  } = parameters;

  const credentials = utils.getCredentials(parameters);

  return SFDX.validateProject({
    credentials,
    sourceDirectory,
    testLevel,
    outputJson,
  });
}

async function runCommand(parameters) {
  const credentials = utils.getCredentials(parameters);

  return SFDX.runCommand({
    credentials,
    command: parameters.command,
    outputJson: parameters.outputJson,
  });
}

module.exports = kaholo.bootstrap({
  runCommand,
  deployProject,
  validateProject,
}, {});
