define(function (require, exports, module) {
    var textContent = "it works";
    var init = function () {
        return textContent;
    }
    module.exports = {
        init: init
    };
})