BASE.require([
    "jQuery",
    "BASE.web.ajax",
    "BASE.web.cookies"
], function () {
    BASE.namespace("components.leavitt");

    var ajax = BASE.web.ajax;

    components.leavitt.SignIn = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var $username = $(tags["username"]);
        var $password = $(tags["password"]);
        var $submit = $(tags["submit"]);
        var $status = $(tags["status"]);
        var $message = $(tags["status-message"]);
        
        $elem.on("keydown", function (e) {
            if (e.which === 13) {
                $submit.trigger("click");
            }
        });

        var fillMessage = function (text) {
            $message.text(text);
        };

        var notifyUserOfError = function (text) {
            clearStatusType();
            $status.addClass("error");
            fillMessage(text);
            showStatus();
            setTimeout(hideStatus, 1500);
        };

        var clearStatusType = function () {
            $status.removeClass("error");
        };

        var showStatus = function () {
            $status.removeClass('hide').fadeIn();
        };

        var hideStatus = function () {
            $status.fadeOut(function () {
                $status.addClass('hide');
                $status.trigger('hidden');
            });
        };

        var setButtonToError = function () {
            $submit.text("Error").attr({
                'class': 'danger',
                disabled: ''
            });
        }

        var setButtonToSignedIn = function () {
            $submit.text("Signed In").attr({
                disabled: ''
            });
        }

        var setButtonToSigningIn = function () {
            $submit.text("Signing In...").attr({
                'class': 'primary',
                disabled: ''
            });
        };

        var setButtonToDefault = function () {
            $submit.text("Sign In").removeAttr("disabled").attr('class', 'primary');
        };

        var root = "";
        self.setRoot = function (value) {
            root = value;
        };
        self.getRoot = function () {
            return root;
        };

        self.signIn = function (username, factors) {
            var data = {
                Username: username,
                Factors: factors
            }
            return ajax.POST(root + "/Login", {
                data: JSON.stringify(data)
            });
        };

        self.reset = function () {
            setButtonToDefault();
        }

        $submit.on("click", function () {
            setButtonToSigningIn();
            var username = $username.val().split("@")[0];
            self.signIn(username, {
                PasswordFactor: $password.val()
            }).then(function (data) {
                setButtonToSignedIn();
                var token = data.data.Data.Token;
                BASE.web.cookies.setItem("cdsc", token, 604800, "/", ".leavitt.com", true); // one week
                $elem.trigger({
                    type: "signedIn",
                    token: token,
                    personId: data.data.Data.PersonId,
                    firstName: data.data.Data.FirstName,
                    lastName: data.data.Data.LastName,
                    expirationDate: data.data.Data.ExpirationDate
                });
            }).ifError(function (error) {
                var response;
                try {
                    response = JSON.parse(error.xhr.responseText);

                } catch (e) {
                    response = { Message: "Unknown server error." };
                }

                notifyUserOfError(response.Message);
                setButtonToError();
                $status.one('hidden', function () {
                    setButtonToDefault();
                });
            });
        });

        $elem.on('enteredView', function () {
            $username.focus();
        });

    };
});