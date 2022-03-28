const {
    open: openFile,
    unlink: deleteFile,
    writeFile: writeFile,
} = require('fs/promises');

const JWT_KEY_FILE_DIRECTORY = './.temp_jwtkey';
const NO_SUCH_FILE_OR_DIRECTORY_SYSTEM_ERROR = 'ENOENT';
const CREATE_APPEND_FAIL_IF_EXISTS_FLAGS = 'ax';

async function createJWTFile({ sourceDirectory, jwtKey }) {
    let fileHandle;
    try {
        fileHandle = await openFile(
            `${sourceDirectory}/${JWT_KEY_FILE_DIRECTORY}`,
            CREATE_APPEND_FAIL_IF_EXISTS_FLAGS
        );
        await writeFile(fileHandle, jwtKey);
        await fileHandle.close();
    } catch (error) {
        if (error.code === NO_SUCH_FILE_OR_DIRECTORY_SYSTEM_ERROR) {
            throw new Error(`Directory ${sourceDirectory} does not exist`);
        } else {
            throw error;
        }
    }
}

async function deleteJWTFile({ sourceDirectory }) {
    try {
        await deleteFile(`${sourceDirectory}/${JWT_KEY_FILE_DIRECTORY}`);
    } catch {}
}

module.exports = {
    createJWTFile,
    deleteJWTFile,
    JWT_KEY_FILE_DIRECTORY,
}