const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os')

function authenticate() {
    console.log("AUTHENTICATE");
}

function deployProject(command) {
    //exec(`sfdx ${command}`);
    console.log("DEPLOY PROJECT")
}

function validateProject() {
    console.log("VALIDATE PROJECT")
}

module.exports = {
    authenticate,
    deployProject,
    validateProject,
};