app.controller("mainController", ['$scope', '$sce', function ($scope, $sce) {
    $scope.$router = new Navigo(null, true, '#!');

    $scope.index = {
        "": {
            "title": "InfinityScript to JavaScript Transpiler",
            "url": 'content/root.json'
        },
        "introduction": {
            "title": "Introduction",
            "url": 'content/introduction.json'
        },
        "introduction/object-oriented": {
            "title": "Object-Oriented approach",
            "url": "content/introduction/object-oriented.json"
        },
        "introduction/inheritance": {
            "title": "Inheritance",
            "url": "content/introduction/inheritance.json"
        },
        "introduction/static-dynamic": {
            "title": "Static and Dynamic members",
            "url": "content/introduction/static-dynamic.json"
        },
        "introduction/constructors": {
            "title": "Constructors",
            "url": "content/introduction/constructors.json"
        },
        "introduction/enums": {
            "title": "Enums for typed constants",
            "url": "content/introduction/enums.json"
        },
        "samples": {
            "title": "Samples",
            "url": 'content/samples.json'
        },
        "samples/inheritance": {
            "title": "Sample Inheritance scenarios",
            "url": 'content/samples/inheritance.json'
        },
    };

    $scope.cleanHTML = function (html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    $scope.updateIndex = function (id, index) {
        if ($scope.selectedContent == id) {
            $scope.selectedIndex = index;
        }
    };

    $scope.getNavigation = function () {
        if ($scope.selectedContent !== undefined) {
            var index = $scope.index.indexOf($scope.selectedContent);
            var previous = (index > 0) ? $scope.index[Object.keys($scope.index)[index - 1]] : undefined;
            var next = (index < Object.keys($scope.index).length - 1) ? $scope.index[Object.keys($scope.index)[index + 1]] : undefined;
            return {
                previousUrl: Object.keys($scope.index)[index - 1],
                previous: previous,
                nextUrl: Object.keys($scope.index)[index + 1],
                next: next,
                hasPrevious: previous !== undefined,
                hasNext: next !== undefined
            }
        }
    };

    $scope.resolveId = function (id) {
        var index = $scope.index[id], ids = id.split("/");
        return {
            available: index !== undefined && index.url === undefined,
            indexed: index,
            level: ids.length - 1
        }
    }

    $scope.loadContent = function (id, $this) {
        if ($this === undefined) {
            $this = {
                doneAction: undefined,
                on: function (action) { action(); },
                done: function (action) { $this.doneAction = action; }
            };
        }
        $scope.loading = true;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        var params = location;
        var resolvedId = $scope.resolveId(id);
        $scope.selectedContent = id;
        $scope.nav = $scope.getNavigation();
        if (!resolvedId.available) {
            fetch(resolvedId.indexed.url).then(function (response) {
                return response.json();
            }).then(function (json) {
                $scope.index[id] = json;
                $scope.loadContent(id, $this);
            }).catch(function (ex) {
                $scope.content = {
                    "title": $scope.index[id].title,
                    "content": [{
                        "type": "paragraph",
                        "text": "<h5>Uh, oh.</h5>"
                    },{
                        "type": "paragraph",
                        "text": "Something doesn't seem right."
                    }, {
                        "type": "paragraph",
                        "text": "The content you are looking for isn't available right now. Please try again in sometime."
                    }, {
                        "type": "paragraph",
                        "text": "<i>This can happen due to several reasons, either you are offline or the content is unavailable.</i>"
                    }]
                };
                $scope.loading = false;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        } else {
            $scope.content = $scope.index[id];
            if ($scope.findInDocument === true) $scope.search = "";
            setTimeout(function () {
                $scope.loading = false;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                if ($this.doneAction ) $this.doneAction();
            }, 500);
        }
        return $this;
    };

    $scope.$router.on(function () {
        $scope.loadContent('');
    }).on(/\/?([\-\w\/]+)\/\/([\-\w]+)/, function (title, section) {
        if ($scope.selectedContent !== title) {
            $scope.loadContent(title).on(function () {
                setTimeout(function () { document.getElementById(section).scrollIntoView(true) }, 1000);
            });
        } else {
            document.getElementById(section).scrollIntoView(true);
        }
    }).on(/^\/?([\-\w\/]+)(\?([\w]+))?$/, function (title) {
        var query = this.query;
        $scope.loadContent(title).done(function () {
            $("#content").animate({ scrollTop: 0 }, "fast");
            if (query) {
                var t = $scope.content.actions[query];
                eval.apply(this, [t]);
                window.history.pushState(null, null,
                    window.location.protocol + "//" + 
                    window.location.host + 
                    window.location.pathname + 
                    window.location.hash.replace('?' + query, "")
                );
                $scope.$router.resolve();
            }
        });
    }).on(/(.+)/, function (all) {
        var id = location.href.substring(location.href.lastIndexOf('#!') + 2);
        $scope.loadContent(id);
    }).resolve();
    $scope.$router.notFound(function (a) {
        console.log("Not Found");
        $scope.$router.resolve();
    });

    $scope.isValidKey = function (key, object) {
        if (object === undefined || object === null) {
            return false;
        }
        return object[key] !== undefined;
    };

    $scope.formatURLs = function ($text, $links) {
        var $text = $text.replace(/\$url\:([A-Za-z0-9]+)\[([\w ]+)\]/, function (match, link, linkText) {
            return "<a class='contentLink' href='" + $links[link] + "'>" + linkText + "</a>";
        });
        $text = $text.replace(/\$img\[((?:(http[s]?|ftp[s]):\/\/)?([^:\/\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^#\s]*)?(#[\w\-]+)?)\,[ ]*([0-9]+)\]/, function (match, imageUrl, height) {
            return "<img src='" + imageUrl + "' height=" + height + " />";
        });
        return $text;
    }

    $scope.formatIMGs = function ($text) {
        var $text = $text.replace(/\$img\[((?:(http[s]?|ftp[s]):\/\/)?([^:\/\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^#\s]*)?(#[\w\-]+)?)\,[ ]*([0-9]+)\]/, function (match, imageUrl) {
            return "<img src='" + imageUrl + "' height=" + arguments[arguments.length - 2] + " />";
        });
        return $text;
    }

    $scope.formatText = function (text) {
        if (text === undefined) return text;
        var $text = text;
        $text = $text.replaceAll("&tb;", "&nbsp;&nbsp;&nbsp;&nbsp;");
        $text = $text.replaceAll("&br;", "<br />");
        if (text.indexOf("class='code") !== -1 && text.indexOf("pre id=") !== -1) {
            text.match(/pre id='([\w\- ]+)'/g).forEach(function (id) {
                id = /pre id='([\w\- ]+)'/g.exec(id)[1];
                highlightElement(id);
            });
        }
        return $sce.trustAsHtml($text);
    };
    
    $scope.formatCode = function (object) {
        if (object === undefined) return object;
        var $text = "";
        if (object.text !== undefined && object.text.indexOf("pre id=") !== -1) {
            object.text.match(/pre id='([\w\- ]+)'/g).forEach(function (id) {
                id = /pre id='([\w\- ]+)'/g.exec(id)[1];
                highlightElement(id);
            });
        } else {
            $text = "<h6>" + object.title + "</h6><pre class='infinityscript' id='" + object.id + "'><code data-load='" + object.url + "'></code></pre>";
            setTimeout(function () {
                highlightElement(object.id);
            }, 100);
        }
        return $sce.trustAsHtml($text);
    };

    $scope.formatParagraph = function (paragraph) {
        var $text = paragraph.text;
        $text = $text.replaceAll("&tb;", "&nbsp;&nbsp;&nbsp;&nbsp;");
        $text = $text.replaceAll("&br;", "<br />");
        if (paragraph.links !== undefined) {
            $text = $scope.formatURLs($text, paragraph.links);
        }
        $text = $scope.formatIMGs($text);
        return $sce.trustAsHtml($text);
    };

    $scope.searchClick = function() {
        if ($scope.findInDocument == false) {
            $scope.findInDocument = true;
            if ($scope.search.length > 0) {
                $scope.mark();
            }
        } else if ($scope.findInDocument == true) {
            $scope.findInDocument = false;
            $scope.marker.unmark();
        }
        $('#searchinput').focus();
    }

    $scope.marker = new Mark(document.getElementById('content'));
    $scope.mark = function performMark($event) {
        if ($scope.findInDocument === true) {// && $event.keyCode === 13) {
            setTimeout(function () {
                $scope.marker.unmark({
                    done: function() {
                        if ($scope.search.length > 0) {
                            if (history.replaceState) {
                                window.history.replaceState(null, null,
                                    window.location.protocol + "//" + 
                                    window.location.host + 
                                    window.location.pathname + 
                                    "?find=" + $scope.search + 
                                    window.location.hash
                                );
                            }
                            $scope.marker.mark($scope.search, {
                                separateWordSearch: true,
                                diacritics: false,
                                debug: false,
                                exclude: [ ".footer *" ]
                            });
                        } else {
                            window.history.pushState(null, null,
                                window.location.protocol + "//" + 
                                window.location.host + 
                                window.location.pathname + 
                                window.location.hash
                            );
                        }
                    }
                });
            }, 0);
        }
    };

    $scope.consoleOutput = "";
    $scope.run = function (id) {
        $scope.consoleOutput = "";
        var _log = console.log;
        console.log = function (out) {
            $scope.consoleOutput += out + "\n";
        }
        try {
            var code = document.getElementById(id), codeText = "";
            code = code.firstChild.firstChild.childNodes.forEach(function (node) {
                codeText += node.innerText + "\n";
            });
            this.showIS = undefined;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            eval.call(window, codeText.replace(/global/g, "window"));
            $scope.consoleOutput = $sce.trustAsHtml($scope.consoleOutput);
        } catch(e) {
            console.log(e);
        } finally {
            console.log = _log;
        }
    };
}]);