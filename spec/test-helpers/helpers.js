const _ = require('lodash');
const { defaultConfig } = require('./default-data');

// https://stackoverflow.com/a/53451196
const flushPromises = () => new Promise(resolve => setTimeout(resolve));

const setGlobals = () => {
    global.configuration = _.cloneDeep(defaultConfig);
    global.DEBUG = (...args) => console.log(...args);
}

const restoreGlobals = () => {
    global.configuration = undefined;
    global.DEBUG = undefined;
    global.helpers = undefined;
}

module.exports = { flushPromises, setGlobals, restoreGlobals };