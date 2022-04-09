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

  try {
    const output = await SFDX.execute(credentials, parameters.command);
    return output.stdout;
  } catch (error) {
    throw new SFDX.SFDXError(`deployment failed: ${error.stderr}`);
  }
}

module.exports = {
  ...kaholo.bootstrap({
    runCommand: utils.errorHandler(runCommand),
    deployProject: utils.errorHandler(deployProject),
    validateProject: utils.errorHandler(validateProject),
  }, {}),
};
