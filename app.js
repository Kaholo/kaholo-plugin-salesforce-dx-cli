const SFDX = require('./sfdx');

function deployProject(action, settings) {
  console.log("API DEPLOY", action, settings)

  SFDX.authenticate();

  return SFDX.deployProject();
}

function validateProject(action, settings) {
  console.log("API VALIDATE", action, settings)

  SFDX.authenticate();

  return SFDX.validateProject();
}

module.exports = {
  deployProject,
  validateProject
};


