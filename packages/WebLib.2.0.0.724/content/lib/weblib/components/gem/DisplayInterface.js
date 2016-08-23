var display = {
    type: Person,
    search: function (text, orderBy) {

    },
    labelArray: function () {
        return "People";
    },
    labelInstance: function () {
        return "Person";
    },
    displayArray: function (array) {
        return array.map(this.displayInstance).join(", ");
    },
    displayInstance: function (person) {
        return person.firstName + " " + person.lastName;
    },
    windowSize: {
        width: 400,
        height: 500
    },
    validateAsync: function () { },
    listProperties: [{
        name: "firstName",
        propertyName: "firstName",
        label: function () {
            return "First Name";
        },
        display: function (value) {
            return value;
        },
        search: function (queryable, search, orderByAsc, orderByDesc) {

        },
        validateAsync: function (value) {

        },
        width: 200 // Default is 200
    }],
    // Tools is where you can handle complex tools per entity. This is where all relationships will be handled.
    tools: [{
        name: "hrAccount",
        label: function () { },
        component: {
            url: "string/or/alias.html"
        },
        config: {
            //Additional information passed to the component
        },
        saveAsync: function () {

        },
        validateAsync: function (entity) {

        }
    }],
    mainInputs: [{
        name: "",
        propertyName: "firstName",
        label: function () {
            return "First Name";
        },
        component: {
            url: "gem-text-input"
        },
        validateAsync: function (entity) {

        },
        span: 12 // This is a 12 group system
    }]

};