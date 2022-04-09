function errorHandler(fn) {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}

function getCredentials(parameters) {
  return {
    SFDX_KEY: parameters.jwtKey,
    SFDX_USERNAME: parameters.username,
    SFDX_CLIENT_ID: parameters.consumerKey,
  };
}

module.exports = {
  errorHandler,
  getCredentials,
};
