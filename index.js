var utils = require('loader-utils');

var tplFn = function(moduleName) {/*
 (function(a, moduleName, whiteList, blackList, allowMockModules) {
     // remove angular module system, everything is now in the `moduleName` module ;)
     var mockMethods = ['animation', 'config', 'constant', 'controller', 'decorator', 'run',
                        'directive', 'factory', 'filter', 'provider', 'service', 'value'];
     var dummy = function(){ return dummy };
     for(var i in mockMethods){
        dummy[mockMethods[i]] = dummy;
     }
     var _module = a.bind(a, a.module);
     var m = _module(moduleName, []);
     a.module = function (n, d) {
         if(~blackList.indexOf(n)){
            return dummy;
         }
         if(~whiteList.indexOf(n)){
            return _module(n, d);
         }
         if(allowMockModules && n.match(/Mock$/)){
            return _module(n, []);
         }
         return m;
     };
     var node = document.querySelectorAll('[ng-app]');
     node && node[0] && node[0].setAttribute('ng-app', moduleName);
 })(window.angular, §1, §2, §3, §4);
 ;
 */};
var tpl = function(opt){
    var str = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//.exec(tplFn.toString())[1];
    var whiteList = opt.whiteList || [];
    var blackList = opt.blackList || [];
    whiteList.push('protractorBaseModule_');

    if (opt.testing == 'e2e') {
        blackList.push('ngMock');
        blackList.push('ngAnimateMock');
    } else if (opt.testing == 'unit') {
        blackList.push('ngMockE2E');
    }

    str = str.replace('§1', JSON.stringify(opt.moduleName || 'app'));
    str = str.replace('§2', JSON.stringify(whiteList));
    str = str.replace('§3', JSON.stringify(blackList));
    str = str.replace('§4', JSON.stringify(!!opt.testing));
    return str;
}

module.exports = function (content) {
    this.cacheable && this.cacheable();
    //lets make double sure we only add it on the right stuff
    if(this.resourcePath.match(/\/angular(\.min)?\.js$/)){
        return content + tpl(utils.parseQuery(this.query));
    }
    return content;
};
