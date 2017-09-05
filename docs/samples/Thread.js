if (!$ISCore) var $ISCore = function () { var e = {}; return e.$ISAccessType = { Public: "$enum:$ISAccessType/Public", Private: "$enum:$ISAccessType/Private", Protected: "$enum:$ISAccessType/Protected", Global: "$enum:$ISAccessType/Global" }, e.$ISType = function (e, t) { var o = { $constructors: [], $prototype: e.$prototype, $type: e, $properties: t }; return o.$constructors.__proto__.$load = function (t) { t.$parent = e, o.$constructors.push(t) }, o.$instance = function () { var e = arguments, t = !1, r = void 0; o.$constructors.reverse(), o.$constructors.forEach(function (c) { void 0 === r && 0 === c.length && (r = c), c.length !== e.length || t || (c.apply(o, e), t = !0) }), !t && r && r.apply(o, arguments) }, o.toString = function () { return "[" + o.$prototype.$typeName + " object]" }, o }, e.$ISType.$prototype = { $typeName: "$ISType.$ISCore" }, e }();

var ThreadState = (function () {
    return {
        Starting: "$enum:ThreadState/Starting",
        Waiting: "$enum:ThreadState/Waiting",
        Running: "$enum:ThreadState/Running",
        Stopped: "$enum:ThreadState/Stopped"
    };
})();

var Thread = function () {
    var $this = $ISCore.$ISType(Thread, { $access: $ISCore.$ISAccessType.Global });
    $this.$prototype = { $typeName: 'Thread' }

    $this.$constructors.$load(function (runCallback) {
        $this._onRun = runCallback;
    });

    $this.$constructors.$load(function (runCallback, parameterList) {
        if (runCallback.arguments.length !== parameterList.length) {
            $this._state = ThreadState.Stopped;
            return;
        }
        $this._onRun = runCallback;
        $this._parameterList = parameterList;
    });

    $this.run = function () {
        if ($this._state === ThreadState.Running || $this._state === ThreadState.Starting) {
            if ($this._onRun !== undefined) {
                $this._onRun();
            }
            setTimeout(function () {
                $this.run();
            }, 0);
        } else if ($this._state === ThreadState.Waiting) {
            if ($this._onWait() !== undefined) {
                $this._onWait();
            }
            setTimeout(function () {
                $this._state = ThreadState.Running;
                $this.run();
            }, $this._waitTimeout);
        } else if ($this._state === ThreadState.Stopped) {
            $this.stop();
        }
    };

    $this.start = function () {
        $this._state = ThreadState.Starting;
        if ($this._onStart !== undefined) {
            $this._onStart();
        }
        $this.run();
    };

    $this.stop = function (onStop) {
        $this._state = ThreadState.Stopped;
        $this._onStop = onStop;
        if ($this._onStop !== undefined) {
            $this._onStop();
        }
    };

    $this.wait = function (milliseconds, onWait) {
        $this._state = ThreadState.Waiting;
        $this._waitTimeout = milliseconds;
        if (onWait !== undefined) {
            $this._onWait = onWait;
        }
    };
    $this.$instance.apply($this, arguments);
    return $this;
};
Thread.$prototype = { $typeName: 'Thread' };

var count = 0;
var printOK = Thread(function () {
    printOK.stop(function () {
        console.log("Stopped");
    });
});
printOK.start();
printOK.wait(5000, function () {
    console.log("Waiting");
});
