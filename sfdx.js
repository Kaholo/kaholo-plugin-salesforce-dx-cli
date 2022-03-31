const util = require("util");
const exec = util.promisify(require("child_process").exec);

const {
  createJWTFile,
  deleteJWTFile,
  JWT_KEY_FILE_DIRECTORY,
} = require("./jwtFile");

const CLI = "sfdx";
const COMMANDS = {
  AUTHENTICATE: "auth:jwt:grant",
  DEPLOY: "force:source:deploy",
};

async function authenticate({
  consumerKey, jwtKey, username, instanceUrl, sourceDirectory, outputJson,
}) {
  try {
    await createJWTFile({
      sourceDirectory,
      jwtKey,
    });
    await callAuthenticateCommand({
      username,
      consumerKey,
      instanceUrl,
      sourceDirectory,
      outputJson,
    });
  } finally {
    await deleteJWTFile({
      sourceDirectory,
    });
  }
}

function validateProject({
  sourceDirectory,
  testLevel,
  username,
  outputJson,
}) {
  return callDeployCommand({
    sourceDirectory,
    testLevel,
    username,
    outputJson,
    extraParamsString: "--checkonly",
  });
}

async function callAuthenticateCommand({
  username, consumerKey, instanceUrl, sourceDirectory, outputJson,
}) {
  let params = `\
--clientid ${consumerKey} \
--jwtkeyfile ${JWT_KEY_FILE_DIRECTORY} \
--username ${username}`;

  if (outputJson) {
    params += " --json";
  }
  if (instanceUrl) {
    params += ` --instanceUrl ${instanceUrl}`;
  }

  try {
    const output = await exec(
      `${CLI} ${COMMANDS.AUTHENTICATE} ${params}`,
      { cwd: sourceDirectory },
    );

    return output.stdout;
  } catch (error) {
    throw new SFDXError(`authentication failed: ${error}`);
  }
}

async function callDeployCommand({
  sourceDirectory,
  testLevel,
  username,
  outputJson,
  extraParamsString,
}) {
  let params = `\
-p ${sourceDirectory} \
-u ${username}`;

  if (outputJson) {
    params += " --json";
  }
  if (testLevel) {
    params += ` --testlevel ${testLevel}`;
  }
  if (extraParamsString) {
    params += ` ${extraParamsString}`;
  }

  try {
    const output = await exec(
      `${CLI} ${COMMANDS.DEPLOY} ${params}`,
      { cwd: sourceDirectory },
    );

    return output.stdout;
  } catch (error) {
    const { stdout } = error;
    throw new SFDXError(`deployment failed: ${error}. ${stdout}`);
  }
}

class SFDXError extends Error {
  toString() {
    return `${this.message} ${this.stack}`;
  }
}

module.exports = {
  authenticate,
  deployProject: callDeployCommand,
  validateProject,
};
