const _ = require('lodash');

const SFDX = require('./sfdx');

async function deployProject(action, settings) {
  const {
    consumerKey,
    jwtKey,
    username,
    sourceDirectory,
    instanceUrl,
    testLevel
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    sourceDirectory
  });

  return SFDX.deployProject({
    sourceDirectory,
    instanceUrl,
    testLevel,
    username
  });
}

async function validateProject(action, settings) {
  const {
    username,
    consumerKey,
    jwtKey,
    sourceDirectory,
    instanceUrl,
    testLevel
  } = mergeInputs(action.params, settings);

  await SFDX.authenticate({
    consumerKey,
    jwtKey,
    username,
    sourceDirectory
  });

  return SFDX.validateProject({
    sourceDirectory,
    instanceUrl,
    testLevel,
    username
  });
}

function mergeInputs(params, settings) {
  const inputs = {};

  _.mergeWith(
      inputs,
      params,
      settings,
      (destinationValue, sourceValue) => (
          !sourceValue && destinationValue ? destinationValue : sourceValue
      ));

  return inputs;
}

function errorHandler(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  deployProject: errorHandler(deployProject),
  validateProject: errorHandler(validateProject),
};


