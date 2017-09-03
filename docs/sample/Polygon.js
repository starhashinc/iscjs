if (!$ISCore) var $ISCore = function () { var e = {}; return e.$ISAccessType = { Public: "$enum:$ISAccessType/Public", Private: "$enum:$ISAccessType/Private", Protected: "$enum:$ISAccessType/Protected", Global: "$enum:$ISAccessType/Global" }, e.$ISType = function (e, t) { var o = { $constructors: [], $prototype: e.$prototype, $type: e, $properties: t }; return o.$constructors.__proto__.$load = function (t) { t.$parent = e, o.$constructors.push(t) }, o.$instance = function () { var e = arguments, t = !1, r = void 0; o.$constructors.reverse(), o.$constructors.forEach(function (c) { void 0 === r && 0 === c.length && (r = c), c.length !== e.length || t || (c.apply(o, e), t = !0) }), !t && r && r.apply(o, arguments) }, o.toString = function () { return "[" + o.$prototype.$typeName + " object]" }, o }, e.$ISType.$prototype = { $typeName: "$ISType.$ISCore" }, e }();

var Point = function () {
    var $this = $ISCore.$ISType(Point, { $access: $ISCore.$ISAccessType.Global });
    $this.$prototype = { $typeName: 'Point' }
    $this._dimensions = [];

    $this.translate = function () {
        for (var i = 0; i < _dimensions.length; i++) {
            $this._dimensions[i] += arguments[i];
        }
    };
    $this.$instance.apply($this, arguments);
    return $this;
};
Point.$prototype = { $typeName: 'Point' };

var Point2D = function () {
    var $this = Point();
    $this.$prototype = { $typeName: 'Point2D' }

    $this.$constructors.$load(function (x, y) {
        $this._dimensions.push(x);
        $this._dimensions.push(y);
    });

    $this.x = function () {
        return $this._dimensions[0];
    };

    $this.y = function () {
        return $this._dimensions[1];
    };
    $this.$instance.apply($this, arguments);
    return $this;
};
Point2D.$prototype = { $typeName: 'Point2D' };

var Polygon2D = function () {
    var $this = $ISCore.$ISType(Polygon2D, { $access: $ISCore.$ISAccessType.Global });
    $this.$prototype = { $typeName: 'Polygon2D' }
    $this._vertices = [];

    $this.$constructors.$load(function () {
        for (var i = 0; i < arguments.length; i++) {
            $this._vertices.push(arguments[i]);
        }
    });

    $this.area = function () {
        var _area = 0.0;
        var _vertices = $this._vertices;
        for (var i = 0; i < _vertices.length; i++) {
            _area += Math.abs(0.5 * ((_vertices[i].x() * _vertices[((i + 1) % _vertices.length)].y()) - (_vertices[i].y() * _vertices[((i + 1) % _vertices.length)].x())));
        }
        return _area;
    };
    $this.$instance.apply($this, arguments);
    return $this;
};
Polygon2D.$prototype = { $typeName: 'Polygon2D' };

var polygon = Polygon2D(Point2D(0, 0), Point2D(0, 2), Point2D(2, 0), Point2D(2, 2));
var area = polygon.area();
console.log(area);
