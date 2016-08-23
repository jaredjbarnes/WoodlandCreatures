BASE.namespace("lg.oauth");

/**
* Object that stores authenication data on a logged in user. 
* @param {object} data OPTIONAL Uses data from object literal data to create AuthenticationResult pre-popualted.
* @return {AuthenticationResult}
*/

lg.oauth.User = function (data) {
    var self = this;

    data = data || {};

    var firstName = typeof data.firstName === "string" ? data.firstName : "";
    var lastName = typeof data.lastName === "string" ? data.lastName : "";
    var expirationDate = data.expirationDate instanceof Date ? data.expirationDate : Date.now();
    var personId = typeof data.personId === "number" ? data.personId : 0;
    var roles = Array.isArray(data.roles) ? data.roles : [];
    var refreshToken = typeof data.refreshToken === "string" ? data.refreshToken : "";
    var accessToken = typeof data.accessToken === "string" ? data.accessToken : null;
    var username = typeof data.username === "string" ? data.username : "";
    var fullName = typeof data.fullName === "string" ? data.fullName : "";

    Object.defineProperties(self, {
        "refreshToken": {
            enumerable: true,
            get: function () {
                return refreshToken;
            }
        },
        "accessToken": {
            enumerable: true,
            get: function () {
                return accessToken;
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
        "fullName": {
            enumerable: true,
            get: function () {
                return fullName;
            }
        }

    });

    self.clearToken = function () {
        expirationDate = Date.now();
        refreshToken = null;
        accessToken = null;
    };

    self.saveToLocalStorage = function (localStorageKey) {
        var data = JSON.stringify(self);
        localStorage.setItem(localStorageKey, data);
    };

};

lg.oauth.User.fromLocalStorage = function (localStorageKey) {
    return new lg.oauth.User(JSON.parse(localStorage.getItem(localStorageKey)));
};

