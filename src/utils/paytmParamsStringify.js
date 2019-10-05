const paramsToString = (params, mandatoryflag) => {
    var data = '';
    var tempKeys = Object.keys(params);
    tempKeys.sort();
    tempKeys.forEach(function (key) {
        var n = params[key].includes("REFUND");
        var m = params[key].includes("|");
        if (n == true) {
            params[key] = "";
        }
        if (m == true) {
            params[key] = "";
        }
        if (key !== 'CHECKSUMHASH') {
            if (params[key] === 'null') params[key] = '';
            if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
                data += (params[key] + '|');
            }
        }
    });
    return data;
}

module.exports = paramsToString;