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
        setTimeout(function () { hljs.highlightBlock(element); }, 200);
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