if (!$ISCore) var $ISCore = function () { var t = {}; return t.$makeInstantiable = function (t) { t.$instance = function () { var t = arguments, e = !1, o = void 0; this.$constructors.reverse(), this.$constructors.forEach(function (r) { void 0 === o && 0 === r.length && (o = r), r.length !== t.length || e || (r.apply(this, t), e = !0) }), !e && o && o.apply(this, arguments) } }, t.$ISAccessType = { Public: "$enum:$ISAccessType/Public", Private: "$enum:$ISAccessType/Private", Protected: "$enum:$ISAccessType/Protected", Global: "$enum:$ISAccessType/Global" }, t.$ISType = function (t, e) { var o = { $constructors: [], $prototype: t.$prototype, $type: t, $properties: e }; return o.$constructors.__proto__.$load = function (e, o) { o.$parent = t, e.$constructors.push(o) }, o.toString = function () { return "[" + o.$prototype.$typeName + " object]" }, o }, t.$ISType.$prototype = { $typeName: "$ISType.$ISCore" }, t }();

var Nameable = function () {
    var $this = (global === this) ? $ISCore.$ISType(Nameable, { $access: $ISCore.$ISAccessType.Global }) : this;
    if (!$this.$prototype) $this.$prototype = { $typeName: 'Nameable' };
    $this._name = undefined;

    $this.name = function () {
        return _name;
    };
    Nameable.$instance.apply($this, arguments);
    return $this;
};
Nameable.$prototype = { $typeName: 'Nameable' };
$ISCore.$makeInstantiable(Nameable);

var Rotatable = function () {
    var $this = (global === this) ? $ISCore.$ISType(Rotatable, { $access: $ISCore.$ISAccessType.Global }) : this;
    if (!$this.$prototype) $this.$prototype = { $typeName: 'Rotatable' };

    $this.rotate = function (radians, origin) { };
    Rotatable.$instance.apply($this, arguments);
    return $this;
};
Rotatable.$prototype = { $typeName: 'Rotatable' };
$ISCore.$makeInstantiable(Rotatable);

var Translatable = function () {
    var $this = (global === this) ? $ISCore.$ISType(Translatable, { $access: $ISCore.$ISAccessType.Global }) : this;
    if (!$this.$prototype) $this.$prototype = { $typeName: 'Translatable' };

    $this.translate = function (dx, dy) { };
    Translatable.$instance.apply($this, arguments);
    return $this;
};
Translatable.$prototype = { $typeName: 'Translatable' };
$ISCore.$makeInstantiable(Translatable);

var Point = function () {
    var $this = (global === this) ? $ISCore.$ISType(Point, { $access: $ISCore.$ISAccessType.Global }) : this;
    Rotatable.apply($this, []);
    Translatable.apply($this, []);
    if (!$this.$prototype) $this.$prototype = { $typeName: 'Point' };
    $this._dimensions = [];
    Point.$instance.apply($this, arguments);
    return $this;
};
Point.$prototype = { $typeName: 'Point' };
$ISCore.$makeInstantiable(Point);

var Point2D = function () {
    var $this = (global === this) ? Point() : this;
    $this.$prototype = { $typeName: 'Point2D' };
    $this.$prototype.$parentType = Point;

    $this.$constructors.$load($this, function (x, y) {
        $this._dimensions.push(x);
        $this._dimensions.push(y);
    });

    $this.x = function () {
        return $this._dimensions[0];
    };

    $this.y = function () {
        return $this._dimensions[1];
    };

    $this.rotate = function (radians, origin) {
        var x = $this._dimensions[0] - origin.x();
        var y = $this._dimensions[1] - origin.y();
        $this._dimensions[0] = (x * Math.cos(radians)) - (y * Math.sin(radians)) + origin.x();
        $this._dimensions[1] = (x * Math.sin(radians)) + (y * Math.cos(radians)) + origin.y();
    };

    $this.translate = function (dx, dy) {
        $this._dimensions[0] += dx;
        $this._dimensions[1] += dy;
    };

    $this.toString = function () {
        return "(" + $this._dimensions[0] + ", " + $this._dimensions[1] + ")";
    };
    Point2D.$instance.apply($this, arguments);
    return $this;
};
Point2D.$prototype = { $typeName: 'Point2D' };
$ISCore.$makeInstantiable(Point2D);

var OriginReferenced = function () {
    var $this = (global === this) ? $ISCore.$ISType(OriginReferenced, { $access: $ISCore.$ISAccessType.Global }) : this;
    if (!$this.$prototype) $this.$prototype = { $typeName: 'OriginReferenced' };
    $this._origin = Point2D(0, 0);

    $this.$constructors.$load($this, function (ox, oy) {
        $this._origin = Point2D(ox, oy);
    });

    $this.origin = function () {
        return $this._origin;
    };

    $this.translateOrigin = function (dx, dy) {
        $this._origin.translate(dx, dy);
    };
    OriginReferenced.$instance.apply($this, arguments);
    return $this;
};
OriginReferenced.$prototype = { $typeName: 'OriginReferenced' };
$ISCore.$makeInstantiable(OriginReferenced);

var Polygon = function () {
    var $this = (global === this) ? OriginReferenced() : this;
    Nameable.apply($this, []);
    Rotatable.apply($this, []);
    Translatable.apply($this, []);
    $this.$prototype = { $typeName: 'Polygon' };
    $this.$prototype.$parentType = OriginReferenced;
    $this._vertices = [];

    $this.$constructors.$load($this, function () {
        $this._name = "Polygon";
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

    $this.centroid = function () {
        var cx = 0.0;
        var cy = 0.0;
        var areax6 = 6 * $this.area();
        for (var i = 0; i < $this._vertices.length; i++) {
            cx += ($this._vertices[i].x() + $this._vertices[(i + 1) % $this._vertices.length].x()) * (($this._vertices[i].x() * $this._vertices[(i + 1) % $this._vertices.length].y()) - ($this._vertices[(i + 1) % $this._vertices.length].x() * $this._vertices[i].y()));
            cy += ($this._vertices[i].y() + $this._vertices[(i + 1) % $this._vertices.length].y()) * (($this._vertices[i].x() * $this._vertices[(i + 1) % $this._vertices.length].y()) - ($this._vertices[(i + 1) % $this._vertices.length].x() * $this._vertices[i].y()));
        }
        return Point2D(cx / areax6, cy / areax6);
    };

    $this.rotate = function (radians) {
        for (var i = 0; i < $this._vertices.length; i++) {
            $this._vertices[i].rotate(radians, $this._origin);
        }
    };

    $this.translate = function (dx, dy) {
        for (var i = 0; i < $this._vertices.length; i++) {
            $this._vertices[i].translate(dx, dy);
        }
    };
    Polygon.$instance.apply($this, arguments);
    return $this;
};
Polygon.$prototype = { $typeName: 'Polygon' };
$ISCore.$makeInstantiable(Polygon);

var triangle = Polygon(Point2D(0, 4), Point2D(-2, 0), Point2D(2, 0));
console.log(triangle.area());
var centroid = triangle.centroid();
console.log(centroid.toString());
triangle.translate(0, -2);
triangle.rotate(Math.PI / 2.0);
console.log(triangle.area());
var centroid = triangle.centroid();
console.log(centroid.toString());
