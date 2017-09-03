if (!$ISCore) var $ISCore = function () { var t = {}; return t.$makeInstantiable = function (t) { t.$instance = function () { var t = arguments, e = !1, o = void 0; this.$constructors.reverse(), this.$constructors.forEach(function (r) { void 0 === o && 0 === r.length && (o = r), r.length !== t.length || e || (r.apply(this, t), e = !0) }), !e && o && o.apply(this, arguments) } }, t.$ISAccessType = { Public: "$enum:$ISAccessType/Public", Private: "$enum:$ISAccessType/Private", Protected: "$enum:$ISAccessType/Protected", Global: "$enum:$ISAccessType/Global" }, t.$ISType = function (t, e) { var o = { $constructors: [], $prototype: t.$prototype, $type: t, $properties: e }; return o.$constructors.__proto__.$load = function (e) { e.$parent = t, o.$constructors.push(e) }, o.toString = function () { return "[" + o.$prototype.$typeName + " object]" }, o }, t.$ISType.$prototype = { $typeName: "$ISType.$ISCore" }, t }();

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
    $this._rotation = undefined;

    $this.rotation = function () {
        return _rotation;
    };

    $this.rotate = function () { };
    Rotatable.$instance.apply($this, arguments);
    return $this;
};
Rotatable.$prototype = { $typeName: 'Rotatable' };
$ISCore.$makeInstantiable(Rotatable);

var Object2D = function () {
    var $this = (global === this) ? $ISCore.$ISType(Object2D, { $access: $ISCore.$ISAccessType.Global }) : this;
    if (!$this.$prototype) $this.$prototype = { $typeName: 'Object2D' };
    $this._originX = undefined;
    $this._originY = undefined;

    $this.$constructors.$load(function (ox, oy) {
        $this._originX = ox;
        $this._originY = oy;
    });

    $this.translateOrigin = function (dx, dy) {
        $this._originX += dx;
        $this._originY += dy;
    };
    Object2D.$instance.apply($this, arguments);
    return $this;
};
Object2D.$prototype = { $typeName: 'Object2D' };
$ISCore.$makeInstantiable(Object2D);

var Shape = function () {
    var $this = (global === this) ? Object2D() : this;
    Nameable.apply($this, []);
    Rotatable.apply($this, []);
    $this.$prototype = { $typeName: 'Shape' };
    $this.$prototype.$parentType = Object2D;
    $this._vertices = [];
    Shape.$instance.apply($this, arguments);
    return $this;
};
Shape.$prototype = { $typeName: 'Shape' };
$ISCore.$makeInstantiable(Shape);

var t = Shape();
console.log(t);
