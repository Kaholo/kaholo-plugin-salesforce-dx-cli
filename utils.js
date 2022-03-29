const _ = require("lodash");

function mergeInputs(params, settings) {
  const inputs = {};

  _.mergeWith(
    inputs,
    params,
    settings,
    (destinationValue, sourceValue) => (
      !sourceValue && destinationValue ? destinationValue : sourceValue
    ),
  );

  return inputs;
}

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

module.exports = {
  mergeInputs,
  errorHandler,
};
