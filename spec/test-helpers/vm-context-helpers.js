const vm = require('vm');
const fs = require('fs');

/**
 * 
 * @param {Object} fileInfo 
 * @param {string} fileInfo.filePath - filepath to load
 * @param {string} fileInfo.fileName - fileName to display in the stack traces
 * @param  {...any} rest - such as user, context, callback, etc...
 * @returns 
 */
 const runFile = ({ filePath, fileName }, ...rest) => {
    var vmResult = vm.runInThisContext(
        '(()=>{return ' + fs.readFileSync(filePath) + ' })();', {
        // filename for stack traces
        filename: fileName,
        displayErrors: true
    }
    )(...rest);

    return vmResult;
};


module.exports = runFile;