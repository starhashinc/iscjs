var app = angular.module("iscjsApp", [ 'angular-bind-html-compile' ]);

app.directive('html', [ function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.html(attrs.html);
      }
    }
  }]);

(function (angular) {
    'use strict';

    var bindHtmlCompile = angular.module('angular-bind-html-compile', []);

    bindHtmlCompile.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = bindHtmlCompile.name;
    }
}(window.angular));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function highlightElement(id) {
    var element = document.getElementById(id);
    if (element !== undefined && element !== null) {
        if (element.childNodes[0].dataset !== undefined && element.childNodes[0].dataset.load !== undefined) {
            fetch('https://api.github.com/repos/starhashstudios/iscjs/contents/docs/' + element.childNodes[0].dataset.load).then(function (response) {
                return response.json();
            }).then(function (json) {
                element.innerHTML = atob(json.content);
                setTimeout(function () {
                    hljs.highlightBlock(element);
                    hljs.lineNumbersBlock(element);
                }, 200);
            }).catch(function (reason) {
                console.log(reason);
            })
        } else {
            setTimeout(function () { hljs.highlightBlock(element); }, 200);
        }
    }
}

function getLatestReleaseInfo(id) {
    if (getLatestReleaseInfo.prototype.latestReleaseTag === undefined) {
        fetch("https://api.github.com/repos/starhashstudios/iscjs/releases/latest").then(function (response) {
            if (response.status === 403) {
                return null;
            }
            return response.json();
        }).then(function(data) {
            getLatestReleaseInfo.prototype.latestReleaseTag = data.tag_name;
            document.getElementById(id).innerHTML = data.tag_name;
            document.getElementById(id).href = "https://github.com/starhashstudios/iscjs/releases/download/" + data.tag_name + "/iscjs-setup.exe";
        }).catch(function () {
            document.getElementById(id).innerHTML = "Latest Release";
            document.getElementById(id).href = "https://github.com/starhashstudios/iscjs/releases/latest";
        });
    } else {
        document.getElementById(id).innerHTML = getLatestReleaseInfo.prototype.latestReleaseTag;
        document.getElementById(id).href = "https://github.com/starhashstudios/iscjs/releases/download/" + getLatestReleaseInfo.prototype.latestReleaseTag + "/iscjs-setup.exe";
    }
}

Object.defineProperty(Object.prototype, "indexOf", { 
    value: function(skey) {
        var keys = Object.keys(this);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === skey) {
                return i;
            }
        }
        return -1;
    }
});

app.filter('search', function() {
    return function(items, scope) {
        if (scope.findInDocument === true) {
            return items;
        }
        var result = {};
        if (history.replaceState) {
            window.history.replaceState(null, null,
                window.location.protocol + "//" + 
                window.location.host + 
                window.location.pathname + 
                ((scope['search'].length !== 0) ? "?search=" + scope['search'] : '') + 
                window.location.hash
            );
        }
        if (scope['search'].length === 0) { return items; }
        angular.forEach(items, function(value, key) {
            if (value.title.toLowerCase().indexOf(scope['search'].toLowerCase()) !== -1) {
                result[key] = value;
            }
        });
        return result;
    };
});

function utf8Encode(unicodeString) {
    if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
    const utf8String = unicodeString.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    ).replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
    return utf8String;
}