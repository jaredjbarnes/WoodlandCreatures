BASE.require([], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.material.inputs");

    components.material.inputs.ValidEmailBehavior = function (elem) {
        var self = this;

        var validateEmail = function (value) {
            var email = value;
            var regx = new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z0-9_\-\.]{2,20})(\]?)$/);
            var emailOK = regx.test(email);

            if (emailOK) {
                return Future.fromResult(emailOK);
            } else {
                return Future.fromError("Please enter a valid email address.");
            }

        };

        self.registerValidator(validateEmail);

    };

});
