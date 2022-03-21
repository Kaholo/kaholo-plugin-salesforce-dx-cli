const _ = require('lodash');

const SFDX = require('./sfdx');

function deployProject(action, settings) {
  const {
    consumerKey,
    jwtKey,
    username,
    sourceDirectory,
    instanceUrl,
    testLevel
  } = _.merge(action.params, settings);
  console.log("App.deploy",action);
/*  SFDX.authenticate({
    consumerKey,
    jwtKey,
    username
  });*/

  return SFDX.deployProject({
    sourceDirectory,
    instanceUrl,
    testLevel
  });
}

function validateProject(action, settings) {
  const {
    username,
    consumerKey,
    jwtKey,
    sourceDirectory,
    instanceUrl,
    testLevel
  } = _.merge(action.params, settings);

  /*SFDX.authenticate({
    consumerKey,
    jwtKey,
    username
  });*/

  return SFDX.validateProject({
    sourceDirectory,
    instanceUrl,
    testLevel
  });
}

module.exports = {
  deployProject,
  validateProject
};


