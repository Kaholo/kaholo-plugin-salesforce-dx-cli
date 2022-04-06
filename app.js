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
    outputJson,
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    instanceUrl,
    sourceDirectory,
    outputJson,
  });

  return SFDX.deployProject({
    sourceDirectory,
    testLevel,
    username,
    outputJson,
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
    outputJson,
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    instanceUrl,
    sourceDirectory,
    outputJson,
  });

  return SFDX.validateProject({
    sourceDirectory,
    testLevel,
    username,
    outputJson,
  });
}

module.exports = {
  deployProject: errorHandler(deployProject),
  validateProject: errorHandler(validateProject),
};
