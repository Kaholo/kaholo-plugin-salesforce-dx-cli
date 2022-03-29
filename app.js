const SFDX = require("./sfdx");
const {
  mergeInputs,
  errorHandler,
} = require("./utils");

async function deployProject(action, settings) {
  const {
    consumerKey,
    jwtKey,
    username,
    sourceDirectory,
    instanceUrl,
    testLevel,
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    sourceDirectory,
  });

  return SFDX.deployProject({
    sourceDirectory,
    instanceUrl,
    testLevel,
    username,
  });
}

async function validateProject(action, settings) {
  const {
    username,
    consumerKey,
    jwtKey,
    sourceDirectory,
    instanceUrl,
    testLevel,
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    sourceDirectory,
  });

  return SFDX.validateProject({
    sourceDirectory,
    instanceUrl,
    testLevel,
    username,
  });
}

module.exports = {
  deployProject: errorHandler(deployProject),
  validateProject: errorHandler(validateProject),
};
