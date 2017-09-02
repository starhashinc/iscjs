var $this = {};
$this.ThreadState = (function () {
    return {
        Starting: "$enum:ThreadState/Starting",
        Waiting: "$enum:ThreadState/Waiting",
        Running: "$enum:ThreadState/Running",
        Stopped: "$enum:ThreadState/Stopped"
    };
})();

$this.Thread = function () {
    var $this = { $constructors: [] };
    $this.$constructors.push(function (runCallback) {
        $this._onRun = runCallback;
    });
    $this.$constructors.push(function (runCallback, parameterList) {
        if (runCallback.arguments.length !== parameterList.length) {
            $this._state = ThreadState.Stopped;
            return;
        }
        $this._onRun = runCallback;
        $this._parameterList = parameterList;
    });

    $this.run = function () {
        if ($this._state === ThreadState.Running || $this._state === ThreadState.Starting) {
            $this._onRun();
            $this.run();
        }
    };

    $this.start = function () {
        $this._state = ThreadState.Starting;
        if ($this._onStart !== undefined) {
            $this._onStart();
        }
        $this.run();
    };

    $this.stop = function () {
        $this._state = ThreadState.Stopped;
        if ($this._onStop !== undefined) {
            $this._onStop();
        }
    };

    $this.wait = function (milliseconds) {
        $this._state = ThreadState.Waiting;
        $this._waitTimeout = milliseconds;
    };

    var $arguments = arguments, $constructed = false; $this.$constructors.reverse();
    $this.$constructors.forEach(function ($constructor) {
        if ($constructor.length === $arguments.length && !$constructed) {
            $constructor.apply($this, $arguments); $constructed = true;
        }
    });
    return $this;
};

