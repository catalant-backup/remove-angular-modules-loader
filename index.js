var utils = require('loader-utils');

var tpl = function(moduleName) {
    return "\n\
(function(a, moduleName) {\n\
    //remove angular module system, everything is now in the `moduleName` module ;)\n\
    var _module = a.bind(a, a.module);\n\
    var m = _module(moduleName, []);\n\
    a.module = function () { return m;};\n\
    document.querySelectorAll('[ng-app]')[0].setAttribute('ng-app', moduleName);\n\
})(window.angular, '"+moduleName+"');\n\
";
};

module.exports = function (content) {
    this.cacheable && this.cacheable();
    //lets make double sure we only add it on the right stuff
    if(this.resourcePath.match(/\/angular(\.min)?\.js$/)){
        var opt = utils.parseQuery(this.query);
        return content + tpl(opt.moduleName || 'app');
    }
    return content;
};