if (!$ISCore) var $ISCore = function () { var e = {}; return e.$ISAccessType = { Public: "$enum:$ISAccessType/Public", Private: "$enum:$ISAccessType/Private", Protected: "$enum:$ISAccessType/Protected", Global: "$enum:$ISAccessType/Global" }, e.$ISType = function (e, t) { var o = { $constructors: [], $prototype: e.$prototype, $type: e, $properties: t }; return o.$constructors.__proto__.$load = function (t) { t.$parent = e, o.$constructors.push(t) }, o.$instance = function () { var e = arguments, t = !1, r = void 0; o.$constructors.reverse(), o.$constructors.forEach(function (c) { void 0 === r && 0 === c.length && (r = c), c.length !== e.length || t || (c.apply(o, e), t = !0) }), !t && r && r.apply(o, arguments) }, o.toString = function () { return "[" + o.$prototype.$typeName + " object]" }, o }, e.$ISType.$prototype = { $typeName: "$ISType.$ISCore" }, e }();

var Geometry = (function () {
    var $this = {};
    $this.Point2D = function () {
        var $this = $ISCore.$ISType(Geometry.Point2D, { $access: $ISCore.$ISAccessType.Global });
        $this.$prototype = { $typeName: 'Geometry.Point2D' }
        $this._dimension0 = NaN;
        $this._dimension1 = NaN;

        $this.$constructors.$load(function (x, y) {
            $this._dimension0 = x;
            $this._dimension1 = y;
        });

        $this.distance = function (second) {
            return Geometry.Point2D.distance($this, second);
        };

        $this.translate = function (translateXY) {
            return Geometry.Point2D.translate($this, translateXY);
        };
        $this.$instance.apply($this, arguments);
        return $this;
    };

    $this.Point2D.translate = function (point, translateXY) {
        return Geometry.Point2D(point._dimension0 + translateXY._dimension0, point._dimension1 + translateXY._dimension1);
    };


    $this.Point2D.distance = function (first, second) {
        return Math.sqrt(Math.pow(first._dimension0 - second._dimension0, 2) + Math.pow(first._dimension1 - second._dimension1, 2));
    };

    $this.Point2D.$prototype = { $typeName: 'Geometry.Point2D' };

    return $this;
})();
