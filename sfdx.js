const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os')
const {
    open: openFile,
    unlink: deleteFile,
} = require('fs/promises');

const CLI = 'sfdx';
const COMMANDS = {
    AUTHENTICATE: 'auth:jwt:grant',
    DEPLOY: 'force:source:deploy',
};

const JWT_KEY_FILE_DIRECTORY = './.temp_jwtkey';

const FILE_SYSTEM_FLAGS = 'ax'; // append and fail if file exists

async function authenticate({ consumerKey, jwtKey, username, instanceUrl }) {
    console.log("AUTHENTICATE", { consumerKey, jwtKey, username, instanceUrl });

    let fileHandle;
    try {
        fileHandle = await openFile(JWT_KEY_FILE_DIRECTORY, FILE_SYSTEM_FLAGS);
        await fileHandle.writeFile(jwtKey);

        let params = `\
--clientid ${consumerKey} \
--jwtkeyfile ${JWT_KEY_FILE_DIRECTORY}
--username ${username}
`;
        if (instanceUrl) {
            params += ` --instanceUrl ${instanceUrl}`;
        }

        const output = await exec(`${CLI} ${COMMANDS.AUTHENTICATE} ${params}`);
        return output;

    } catch (error) {
        throw new SFDXError(`authentication failed: ${error}`);

    } finally {
        await fileHandle.close();
        await deleteFile(fileHandle);
    }
}

async function deployProject({
    sourceDirectory,
    testLevel,
}) {
    console.log("DEPLOY PROJECT", { sourceDirectory, testLevel })

    /*return callDeployCommand({
        sourceDirectory,
        testLevel,
    });*/
}

function validateProject({
     sourceDirectory,
     testLevel
 }) {
    console.log("VALIDATE PROJECT", { sourceDirectory, testLevel })

    /*return callDeployCommand({
        sourceDirectory,
        testLevel,
        extraParamsString: '--checkonly',
    });*/
}

async function callDeployCommand({
    sourceDirectory,
    testLevel,
    extraParamsString
}) {
    try {
        let params = `-p ${sourceDirectory}`;
        if (testLevel) {
            params += ` --testLevel ${testLevel}`;
        }
        if (extraParamsString) {
            params += ' ' + extraParamsString;
        }

        const output = await exec(`${CLI} ${COMMANDS.DEPLOY} ${params}`);
        return output;
    } catch (error) {
        throw new SFDXError(`deployment failed: ${error}`);
    }
}

class SFDXError extends Error {
    constructor(message) {
        super(`SFDX Error - ${message}`);
    }

    toString() {
        return this.message;
    }
}

module.exports = {
    authenticate,
    deployProject,
    validateProject,
};