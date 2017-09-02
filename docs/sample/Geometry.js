var $this = {};
var Geometry = (function () {
    var $this = {};
    $this.Point2D = function () {
        var $this = { $constructors: [] };
        $this._dimension0 = NaN;
        $this._dimension1 = NaN;
        $this.$constructors.push(function (x, y) {
            $this._dimension0 = x;
            $this._dimension1 = y;
        });

        $this.distance = function (second) {
            return Geometry.Point2D.distance($this, second);
        };

        $this.translate = function (translateXY) {
            return Geometry.Point2D.translate($this, translateXY);
        };

        var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
        $this.$constructors.forEach(function ($constructor) {
            if ($constructor.length === $arguments.length && !$constructed) {
                $constructor.apply($this, $arguments); $constructed = true;
            }
        });
        return $this;
    };


    $this.Point2D.translate = function (point, translateXY) {
        return Geometry.Point2D(point._dimension0 + translateXY._dimension0, point._dimension1 + translateXY._dimension1);
    };


    $this.Point2D.distance = function (first, second) {
        return Math.sqrt(Math.pow(first._dimension0 - second._dimension0, 2) + Math.pow(first._dimension1 - second._dimension1, 2));
    };

    return $this;
})();
$this.Geometry = Geometry;

