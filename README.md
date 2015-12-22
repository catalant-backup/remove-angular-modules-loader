# remove-angular-modules-loader
angular modules suck when you already have require. lets remove them by putting everything into a module called 'app'


# Usage

```bash
npm install remove-angular-modules-loader
```

in your webpack config's loaders section:

```js
{
    test: /\/angular(.min)?\.js$/,
    loader: 'remove-angular-modules'
},
```

moduleName is optional, default module name is 'app'. It is recommended that you update your html with this module name.

# Query params

 - `moduleName` name of the module that everything will go into
 - `whiteList[]` allow these modules to be created under their original module name
 - `blackList[]` ignore creation of these modules. no code registered to these modules will ever run
 - `testing` valid values: 'unit' or 'e2e'. ngMock contains both types of modules, so this will properly configure the blacklist property for you. Use this only when testing with ngMock or ngMockE2E

example

```js
{
    test: /\/angular(.min)?\.js$/,
    loader: 'remove-angular-modules?moduleName=hourlynerd&whiteList[]=foo&whiteList[]=bar&blackList[]=skillbridge&testing=e2e'
}
```

# How it works

It patches angular to put everything into a single module*.
You no longer need to define module dependencies when creating modules, or names for that matter.


* - `protractorBaseModule_` remains its own module because otherwise protractor tests don't work. (you can still blacklist it)


This is now valid:

```js
angular.module().controller('MyController', ....)
```

but your old code will still work too.

Now you can focus on requiring angular things with webpack just like you require everything else.

# Secret Sauce

The magic happens when we append the following script to the end of angular.js (ok, its a bit longer now...)

```js
(function(a, moduleName) {
    //remove angular module system, everything is now in the `moduleName` module ;)
    var _module = a.bind(a, a.module);
    var m = _module(moduleName, []);
    a.module = function () { return m;};
    document.querySelectorAll('[ng-app]')[0].setAttribute('ng-app', moduleName);
})(window.angular, 'moduleNameFromConfig');
```