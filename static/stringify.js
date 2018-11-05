define(function (require, exports, module) {
    // var $ = require('jquery');
    // var changeText = require('changeText')
    // var showText = function () {
    //     $('#title').text(changeText.init());
    // }
    // exports.showText = showText;
    var jsonStringify = function (param) {
        var result = JSON.stringify(param, null, 4)
        return result;
    }
    exports.jsonStringify = jsonStringify;
})