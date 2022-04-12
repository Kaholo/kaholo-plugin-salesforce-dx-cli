function getCredentials(parameters) {
  return {
    SFDX_KEY: parameters.jwtKey,
    SFDX_USERNAME: parameters.username,
    SFDX_CLIENT_ID: parameters.consumerKey,
  };
}

module.exports = {
  getCredentials,
};
