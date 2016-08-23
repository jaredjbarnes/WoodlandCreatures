BASE.require([
    "BASE.async.Future"
], function () {
    BASE.namespace("components.ui.states");

    components.ui.states.UIStateBehavior = function () {
        var self = this;

        if (!self._hasStateBehavior) {

            self.init = function (stateManager) {
                // Override to do one-time set-up tasks.
                // Remember to keep hold of the state manager if you override.
                self.stateManager = stateManager;
            };

            self.prepareToActivate = function (options) {
                return BASE.async.Future.fromResult(null);
            };

            self.prepareToDeactivate = function () {
                return BASE.async.Future.fromResult(null);
            };

            self.updateState = function (options) {
                return BASE.async.Future.fromResult(null);
            };

            // called when the state is officially active (after transitions have completed);
            self.stateActive = function () { };

            self.activated = function () { };

            // called when the state has been deactivated or has been covered by another state
            self.stateBlur = function () { };

            self.deactivated = function () { };

            // called when the state becomes the top state, either through being pushed, or a higher state having been popped off.
            self.stateFocus = function () { };

            self.stateManager = null;

            self.getContextActions = function () {

            };

            self._hasStateBehavior = true;
        }

    };
});