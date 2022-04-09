const util = require("util");
const _ = require("lodash");
const childProcess = require("child_process");

const exec = util.promisify(childProcess.exec);

// eslint-disable-next-line no-multi-str
const SFDX_AUTH_COMMAND = "\
export KEY_FILE=$(mktemp) && \
echo \"$SFDX_KEY\" > $KEY_FILE && \
sfdx auth:jwt:grant \
--username $SFDX_USERNAME \
--clientid $SFDX_CLIENT_ID \
--jwtkeyfile $KEY_FILE 1>/dev/null && \
rm $KEY_FILE && \
unset KEY_FILE";

// eslint-disable-next-line no-multi-str
const DOCKER_SFDX_CLI_COMMAND = "\
docker run \
-e SFDX_KEY \
-e SFDX_USERNAME \
-e SFDX_CLIENT_ID \
-e SFDX_AUTH_COMMAND \
-e SANITIZED_COMMAND \
-e PROJECT_PATH \
-v $PROJECT_PATH:/project \
-w /project \
--rm salesforce/salesforcedx:latest-full  \
bash -c \"$SFDX_AUTH_COMMAND && sfdx $SANITIZED_COMMAND \"";

const COMMANDS = {
  DEPLOY: "force:source:deploy",
};

function sanitizeCommand(command) {
  let sanitized = command;
  if (_.startsWith(command.toLowerCase(), "sfdx ")) {
    sanitized = command.slice(5);
  }

  // This is the safest way to escape the user provided command.
  // By putting the command in double quotes, we can be sure that
  // every character within the command is escaped, including the
  // ones that could be used for shell injection (e.g. ';', '|', etc.).
  // The escaped string needs then to be echoed back to the docker command
  // in order to be properly executed - simply passing the command in double quotes
  // would result in docker confusing the quotes as a part of the command.
  return `$(echo "${sanitized}")`;
}

function validateProject({
  credentials,
  sourceDirectory,
  testLevel,
  outputJson,
}) {
  return callDeployCommand({
    credentials,
    sourceDirectory,
    testLevel,
    outputJson,
    extraParamsString: "--checkonly",
  });
}

async function callDeployCommand({
  credentials,
  sourceDirectory,
  testLevel,
  outputJson,
  extraParamsString,
}) {
  let params = `\
-p /project \
-u ${credentials.SFDX_USERNAME}`;

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
    const output = await execute(credentials, `${COMMANDS.DEPLOY} ${params}`, sourceDirectory);
    return output.stdout;
  } catch (error) {
    const { stdout } = error;
    throw new SFDXError(`deployment failed: ${stdout}`);
  }
}

async function execute(credentials, command, projectPath) {
  return exec(DOCKER_SFDX_CLI_COMMAND, {
    env: {
      ...credentials,
      SFDX_AUTH_COMMAND,
      RAW_COMMAND: command,
      SANITIZED_COMMAND: sanitizeCommand(command),
      PROJECT_PATH: projectPath,
    },
  });
}

class SFDXError extends Error {
  toString() {
    return `${this.message} ${this.stack}`;
  }
}

module.exports = {
  execute,
  deployProject: callDeployCommand,
  validateProject,
  SFDXError,
};
