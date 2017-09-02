app.controller("mainController", ['$scope', '$sce', function ($scope, $sce) {
    $scope.$router = new Navigo(null, true, '#!');

    $scope.index = {
        '': {
            "title": "InfinityScript to JavaScript Transpiler",
            "url": 'content/root.json'
        },
        'introduction': {
            "title": "Introduction",
            "url": 'content/introduction.json'
        },
        'transpiling': {
            "title": "Transpiling to JS",
            "url": 'content/transpiling.json'
        }
    };
    
    $scope.loadContent = function (id) {
        $scope.loading = true;
        if(!$scope.$$phase) {
            $scope.$apply();
        }
        if ($scope.index[id].url !== undefined) {
            fetch($scope.index[id].url).then(function(response) {
                return response.json();
            }).then(function(json) {
                $scope.index[id] = json;
                $scope.loadContent(id);
            }).catch(function(ex) {
                $scope.content = { "title": "Failed to load content.", "content": [{ "type": "paragraph", "text": "Failed to fetch content from url: " + id }] };
            });
        } else {
            $scope.selectedContent = id;
            $scope.content = $scope.index[id];
            setTimeout(function () {
                $scope.loading = false; 
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }, 500);
        }
    };

    $scope.$router.on(function () {
        $scope.loadContent('');
    }).on(/^\/?([\-\w]+)$/, function (title) {
        $scope.loadContent(title);
    }).on(/\/?([\-\w]+)\/([\-\w]+)/, function (title, section) {
        $scope.loadContent(title);
        setTimeout(function () {
            document.getElementById(section).scrollIntoView(true);
        }, 1000);
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
        var $text = $text.replace(/\$url\:([A-Za-z0-9]+)\[([\w ]+)\]/, function(match, link, linkText) {
            return "<a class='contentLink' href='" + $links[link] + "'>" + linkText + "</a>";
        });
        $text = $text.replace(/\$img\[((?:(http[s]?|ftp[s]):\/\/)?([^:\/\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^#\s]*)?(#[\w\-]+)?)\,[ ]*([0-9]+)\]/, function(match, imageUrl, height) {
            return "<img src='" + imageUrl + "' height=" + height + " />";
        });
        return $text;
    }

    $scope.formatIMGs = function ($text) {
        var $text = $text.replace(/\$img\[((?:(http[s]?|ftp[s]):\/\/)?([^:\/\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^#\s]*)?(#[\w\-]+)?)\,[ ]*([0-9]+)\]/, function(match, imageUrl) {
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
}]);