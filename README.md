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
    loader: 'remove-angular-modules?moduleName=modules-are-bad'
},
```

moduleName is optional, default module name is 'app'.


# How it works

It patches angular to put everything into a single module*.
You no longer need to define module dependencies when creating modules, or names for that matter.


* - `protractorBaseModule_` remains its own module because otherwise protractor tests don't work.


This is now valid:

```js
angular.module().controller('MyController', ....)
```

but your old code will still work too.

Now you can focus on requiring angular things with webpack just like you require everything else.

# Secret Sauce

The magic happens when we append the following script to the end of angular.js

```js
(function(a, moduleName) {
    //remove angular module system, everything is now in the `moduleName` module ;)
    var _module = a.bind(a, a.module);
    var m = _module(moduleName, []);
    a.module = function () { return m;};
    document.querySelectorAll('[ng-app]')[0].setAttribute('ng-app', moduleName);
})(window.angular, 'moduleNameFromConfig');
```