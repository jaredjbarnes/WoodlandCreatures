BASE.namespace("components.material.login");

/**
* Object that stores authenication data on a logged in user. 
* @param {object} data OPTIONAL Uses data from object literal data to create AuthenticationResult pre-popualted.
* @return {AuthenticationResult}
*/
components.material.login.AuthenticationResult = function (data) {
    var self = this;

    data = data || {};

    var firstName = "";
    var lastName = "";
    var expirationDate = Date.now();
    var personId = 0;
    var roles = [];
    var token = null;
    var username = "";

    if (data.expirationDate instanceof Date)
        expirationDate = data.expirationDate;

    if (typeof data.username === "string")
        username = data.username;

    if (typeof data.personId === "number")
        personId = data.personId;

    if (typeof data.firstName === "string")
        firstName = data.firstName;

    if (typeof data.lastName === "string")
        lastName = data.lastName;

    if (typeof data.token === "string")
        token = data.token;

    if (Array.isArray(data.roles))
        roles = data.roles;


    Object.defineProperties(self, {
        "token": {
            enumerable: true,
            get: function () {
                return token;
            }
        },
        "firstName": {
            enumerable: true,
            get: function () {
                return firstName;
            }
        },
        "lastName": {
            enumerable: true,
            get: function () {
                return lastName;
            }
        },
        "personId": {
            enumerable: true,
            get: function () {
                return personId;
            }
        },
        "expirationDate": {
            enumerable: true,
            get: function () {
                return expirationDate;
            }
        },
        "roles": {
            enumerable: true,
            get: function () {
                return roles;
            }
        },
        "username": {
            enumerable: true,
            get: function () {
                return username;
            }
        },
        "fullname": {
            enumerable: true,
            get: function () {
                return firstName + " " + lastName;
            }
        }

    });

    self.clearToken = function () {
        expirationDate = Date.now();
        token = null;
    };

    self.saveToLocalStorage = function (localStorageKey) {

        var data = JSON.stringify(self);
        localStorage.setItem(localStorageKey, data);
    };

};


components.material.login.AuthenticationResult.fromLocalStorage = function (localStorageKey) {
    return new components.material.login.AuthenticationResult(JSON.parse(localStorage.getItem(localStorageKey)));
};

