BASE.require([
    "BASE.data.Edm",
    "String.prototype.toEnum",
    "String.prototype.toEnumFlag",
    "Number.prototype.toEnumString",
    "Number.prototype.toEnumFlagString",
    "Date.prototype.format",
    "String.prototype.trim",
    "BASE.query.Queryable"
], function () {
    var prettifyRegex = /([A-Z]*?[A-Z]|^.)/g;
    var Queryable = BASE.query.Queryable;
    var Future = BASE.async.Future;

    var prettifyName = function (name) {
        return name.replace(prettifyRegex, function (match, part1, offset) {
            if (offset === 0) {
                return part1.toUpperCase();
            }
            return " " + part1.toUpperCase();
        });
    };

    var createStringInput = function (propertyName, modelProperty) {
        var property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            span: 6
        };

        if (typeof modelProperty.length === "number" && modelProperty.length > 255) {
            property.component = {
                name: "gem-textarea-input"
            };
        } else {
            property.component = {
                name: "gem-text-input"
            };
        }
        return property;
    };

    var createBooleanInput = function (propertyName) {
        var property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            span: 6
        };

        property.component = {
            name: "gem-select-input",
            options: [{
                label: "Yes",
                value: true
            }, {
                label: "No",
                value: false
            }]
        };

        property.map = function (value) {
            return value === "true";
        };

        return property;
    };

    var createNumberInput = function (propertyName) {
        return property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            component: {
                name: "gem-number-input"
            },
            span: 6
        };
    };

    var createDateInput = function (propertyName) {
        var property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            span: 6
        };

        property.component = {
            name: "gem-date-input"
        };

        return property;
    };

    var createEnumInput = function (propertyName, modelProperty) {
        var property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            span: 6
        };

        var Type = modelProperty.genericTypeParameters[0];

        var options = Object.keys(Type).filter(function (key) {
            return Type[key] instanceof Enum;
        }).map(function (key) {
            var enumumeration = Type[key];
            return {
                label: enumumeration.displayName || enumumeration.name,
                value: enumumeration.valueOf()
            };
        });

        property.component = {
            name: "gem-select-input",
            options: options
        };

        property.map = function (value) { return parseInt(value, 10); };

        return property;
    };

    var createEnumFlagInput = function (propertyName, modelProperty) {
        var property = {
            name: propertyName,
            propertyName: propertyName,
            label: function () {
                return prettifyName(propertyName);
            },
            span: 6
        };
        var Type = modelProperty.genericTypeParameters[0];

        var options = Object.keys(Type).filter(function (key) {
            return Type[key] instanceof EnumFlag;
        }).map(function (key) {
            var enumumeration = Type[key];
            return {
                label: enumumeration.displayName || enumumeration.name,
                value: enumumeration.valueOf()
            };
        });

        property.component = {
            name: "gem-select-input",
            options: options
        };

        property.map = function (value) { return parseInt(value, 10); };

        return property;
    };

    BASE.namespace("components.gem");

    var TypeDisplay = function (Type, service, config) {
        var self = this;
        var edm = service.getEdm();
        var numberPropertyNames = [];
        var datePropertyNames = [];
        var stringPropertyNames = [];
        var booleanPropertyNames = [];
        var model = this.model = edm.getModelByType(Type);
        var relationships = this.createRelationshipProperties(edm, model);
        var keys = edm.getAllKeyProperties(Type).concat(edm.getAllKeyProperties(Type));

        var createStringSearchByListProperty = function (propertyName) {
            return function (queryable, text, orderByAsc, orderByDesc) {
                var tokens = text.split(" ").map(function (token) {
                    return token.trim();
                }).filter(function (token) {
                    return token.length > 0;
                });

                if (tokens.length > 0) {
                    queryable = queryable.and(function (expBuilder) {
                        var ors = tokens.map(function (token) {
                            return expBuilder.property(propertyName).contains(token);
                        });

                        return expBuilder.or.apply(expBuilder, ors);
                    });
                }

                if (orderByAsc) {
                    queryable = queryable.orderBy(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                } else if (orderByDesc) {
                    queryable = queryable.orderByDesc(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                }

                return queryable;
            };
        };

        var createNumberSearchByListProperty = function (propertyName) {
            return function (queryable, text, orderByAsc, orderByDesc) {
                var tokens = text.split(" ").map(function (token) {
                    return parseFloat(token.trim());
                }).filter(function (token) {
                    return !isNaN(token);
                });

                if (tokens.length > 0) {
                    queryable = queryable.or(function (expBuilder) {
                        var ors = tokens.map(function (token) {
                            return expBuilder.property(propertyName).isEqualTo(token);
                        });

                        return expBuilder.or.apply(expBuilder, ors);
                    });
                }

                if (orderByAsc) {
                    queryable = queryable.orderBy(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                } else if (orderByDesc) {
                    queryable = queryable.orderByDesc(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                }

                return queryable;
            };
        };

        var createDateSearchByListProperty = function (propertyName) {
            return function (queryable, text, orderByAsc, orderByDesc) {

                var tokens = text.split(" ");
                var textDate = new Date(text);

                if (!isNaN(textDate.getTime())) {
                    textDate.setHours(0, 0, 0, 0);
                    tokens.push(textDate);
                } else {
                    tokens = tokens.map(function (token) {
                        var date = new Date(token.trim());
                        date.setHours(0, 0, 0, 0);
                        return date;
                    }).filter(function (date) {
                        return !isNaN(date.getTime());
                    });
                }


                if (tokens.length > 0) {
                    queryable = queryable.or(function (expBuilder) {
                        var ors = tokens.map(function (date) {
                            var nextDate = new Date(date);
                            nextDate.setDate(nextDate.getDate() + 1);
                            return expBuilder.and(
                                expBuilder.property(propertyName).isGreaterThanOrEqualTo(date),
                                expBuilder.property(propertyName).isLessThan(nextDate)
                                );
                        });

                        return expBuilder.or.apply(expBuilder, ors);
                    });
                }

                if (orderByAsc) {
                    queryable = queryable.orderBy(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                } else if (orderByDesc) {
                    queryable = queryable.orderByDesc(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                }

                return queryable;
            };
        };

        var createBooleanSearchByListProperty = function (propertyName) {
            return function (queryable, text, orderByAsc, orderByDesc) {
                if (orderByAsc) {
                    queryable = queryable.orderBy(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                } else if (orderByDesc) {
                    queryable = queryable.orderByDesc(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                }

                return queryable;
            };
        };

        var createEnumSearchByListProperty = function (propertyName) {
            return function (queryable, text, orderByAsc, orderByDesc) {
                if (orderByAsc) {
                    queryable = queryable.orderBy(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                } else if (orderByDesc) {
                    queryable = queryable.orderByDesc(function (expBuilder) {
                        return expBuilder.property(propertyName);
                    });
                }

                return queryable;
            };
        };

        this.type = model.type;
        this.isExpirable = false;
        this.service = null;

        this.search = function (text, orderByAsc, orderByDesc) {
            var queryable = service.asQueryable(Type);

            return this.listProperties.reduce(function (queryable, listProperty) {
                var isOrderByAsc = orderByAsc.indexOf(listProperty.propertyName) > -1;
                var isOrderByDesc = orderByDesc.indexOf(listProperty.propertyName) > -1;

                var newQueryable = listProperty.search(queryable, text, isOrderByAsc, isOrderByDesc);
                if (!(newQueryable instanceof Queryable)) {
                    throw new Error("Expected a Queryable to be returned from list property: " + listProperty.name);
                }
                return newQueryable;
            }, queryable);

        };

        var mainInputs = this.mainInputs = [];
        var tools = this.tools = [];
        var listProperties = this.listProperties = [];

        Object.keys(model.properties).filter(function (propertyName) {
            return keys.indexOf(propertyName) === -1;
        }).forEach(function (propertyName) {
            var modelProperty = model.properties[propertyName];
            var input = null;
            var tool = null;
            var property = null;
            var listProperty = {
                name: propertyName,
                propertyName: propertyName,
                label: function () {
                    return prettifyName(propertyName);
                },
                display: function (value) {
                    if (value == null) {
                        return "";
                    }
                    return value;
                },
                width: 200
            };
            var relationshipConfig = relationships[propertyName];
            if (relationshipConfig) {

                if (relationshipConfig.relationship.withOne === propertyName) {
                    // One to many target will be an input instead of a tool.
                    mainInputs.push(relationshipConfig);
                } else {
                    // All other relationships are handled as tools.
                    tools.push(relationshipConfig);
                }

            } else if (modelProperty.type === String) {

                stringPropertyNames.push(propertyName);
                mainInputs.push(createStringInput(propertyName, modelProperty));
                listProperty.search = createStringSearchByListProperty(propertyName);

                listProperties.push(listProperty);


            } else if (modelProperty.type === Boolean) {

                booleanPropertyNames.push(propertyName);
                mainInputs.push(createBooleanInput(propertyName));
                listProperty.search = createBooleanSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Double) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Float) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Integer) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Binary) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Byte) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Decimal) {

                numberPropertyNames.push(propertyName);
                mainInputs.push(createNumberInput(propertyName));
                listProperty.search = createNumberSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === DateTimeOffset) {

                datePropertyNames.push(propertyName);
                mainInputs.push(createDateInput(propertyName));
                listProperty.display = function (value) {
                    if (value == null) {
                        return "";
                    }
                    return value.format("mm/dd/yyyy");
                };

                listProperty.search = createDateSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Date) {

                datePropertyNames.push(propertyName);
                mainInputs.push(createDateInput(propertyName));
                listProperty.search = createDateSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === Location) {
                //throw new Error("Not yet implemented yet.");
            } else if (modelProperty.type === Enum) {
                mainInputs.push(createEnumInput(propertyName, modelProperty));
                listProperty.search = createEnumSearchByListProperty(propertyName);
                listProperties.push(listProperty);

            } else if (modelProperty.type === EnumFlag) {
                mainInputs.push(createEnumFlagInput(propertyName, modelProperty));
                listProperty.search = createEnumSearchByListProperty(propertyName);
                listProperties.push(listProperty);
            }

        });

    };

    TypeDisplay.prototype.labelInstance = function () {
        var model = this.model;

        if (typeof model.labelInstance === "function") {
            return model.labelInstance();
        } else if (typeof model.labelInstance === "string") {
            return model.labelInstance;
        } else {
            return prettifyName(model.collectionName);
        }
    };

    TypeDisplay.prototype.labelList = function () {
        var model = this.model;

        if (typeof model.labelList === "function") {
            return model.labelList();
        } else if (typeof model.labelList === "string") {
            return model.labelList;
        } else {
            return prettifyName(model.collectionName);
        }
    };

    TypeDisplay.prototype.displayInstance = function (instance) {
        var model = this.model;

        if (typeof model.displayInstance === "function") {
            return model.displayInstance(instance);
        } else {
            return Object.keys(instance).map(function (key) {
                return instance[key];
            }).join(", ");
        }
    };

    TypeDisplay.prototype.displayList = function (array) {
        var self = this;
        var model = this.model;

        if (typeof model.displayList === "function") {
            return model.displayList(instance);
        } else {
            return "( " + array.map(function (instance) {
                self.displayInstance(instance);
            }).join(" ), (") + " )"
        }
    };

    TypeDisplay.prototype.getInputByName = function (name) {
        var input = this.mainInputs.filter(function (input) {
            return input.name === name;
        })[0];

        if (input == null) {
            throw new Error("Couldn't find input with name: " + name);
        }

        return input;
    };

    TypeDisplay.prototype.getListPropertyByName = function (name) {
        var property = this.listProperties.filter(function (property) {
            return property.name === name;
        })[0];

        if (property == null) {
            throw new Error("Couldn't find list property with name: " + name);
        }

        return property;
    };

    TypeDisplay.prototype.getToolByName = function (name) {
        var tool = this.tools.filter(function (tool) {
            return tool.name === name;
        })[0];

        if (tool == null) {
            throw new Error("Couldn't find tool with name: " + name);
        }

        return tool;
    };

    TypeDisplay.prototype.hideByNames = function (arrayOfNames) {

    };

    TypeDisplay.prototype.setSortOrderByNames = function (arrayOfNames) {
        var inputs = this.mainInputs.reduce(function (hash, input) {
            hash[input.propertyName] = input;
            return hash;
        }, {});

        var tools = this.tools.reduce(function (hash, tool) {
            hash[tool.name] = tool;
            return hash;
        }, {});

        var listProperties = this.listProperties.reduce(function (hash, property) {
            hash[property.propertyName] = property;
            return hash;
        }, {});

        arrayOfNames.forEach(function (name, index) {
            if (inputs[name]) {
                inputs[name].sortOrder = index;
            }

            if (tools[name]) {
                tools[name].sortOrder = index;
            }

            if (listProperties[name]) {
                listProperties[name].sortOrder = index;
            }
        });
    };

    TypeDisplay.prototype.setToolSortOrderByName = function (name, value) {
        var tool = this.getToolByName(name);
        tool.sortOrder = value;
    };

    TypeDisplay.prototype.setInputValidationByName = function (name, validationAsync) {
        var input = this.getInputByName(name);
        input.validationAsync = validationAsync;
    };

    TypeDisplay.prototype.setInputSortOrderByName = function (name, value) {
        var input = this.getInputByName(name);
        input.sortOrder = value;
    };

    TypeDisplay.prototype.setInputAsReadOnlyByName = function (name) {
        var input = this.getInputByName(name);
        input.readOnly = true;
    };

    TypeDisplay.prototype.setListPropertySortOrderByName = function (name, value) {
        var property = this.getListPropertyByName(name);
        property.sortOrder = value;
    };

    TypeDisplay.prototype.setPropertySortOrderByName = function (name, value) {
        var input = this.getInputByName(name);
        var property = this.getListPropertyByName(name);

        input.sortOrder = value;
        property.sortOrder = value;
    };

    TypeDisplay.prototype.setAsExpirable = function () {
        if (!this.isExpirable) {
            this.isExpirable = true;

            // Remove these inputs from showing up on the main form.
            this.mainInputs = this.mainInputs.filter(function (input) {
                return input.propertyName !== "endDate" && input.propertyName !== "isExpired"
            });

            // Remove these inputs from showing up on the main form.
            this.listProperties = this.listProperties.filter(function (property) {
                return property.propertyName !== "endDate" && property.propertyName !== "isExpired"
            });

            var startDateInput;

            try {
                startDateInput = this.getInputByName("startDate")
            } catch (e) {

                console.log("Model missing startDate!!!  Expirable objects always have startDates. Collection " + this.model.collectionName);
            }

            if (startDateInput)
                startDateInput.readOnly = true;

            var oldSearch = this.search;
            var typeDisplay = this;

            this.search = function (text, orderByAsc, orderByDesc) {

                   var  queryable = oldSearch.apply(typeDisplay, arguments);
                return queryable.and(function (expBuilder) {
                    return expBuilder.property("isExpired").isEqualTo(false);
                });
            };
        }
    };


    TypeDisplay.prototype.setToolAsHistoricalCollection = function (name) {
        var tool = this.getToolByName(name);

        if (tool == null) {
            throw new Error("Couldn't find tool by the name: " + name + ".");
        }

        // Remove these inputs from showing up on the main form.
        this.mainInputs = this.mainInputs.filter(function (input) {
            return input.propertyName !== "endDate" && input.propertyName !== "isExpired"
        });

        // Remove these inputs from showing up on the main form.
        this.listProperties = this.listProperties.filter(function (property) {
            return property.propertyName !== "endDate" && property.propertyName !== "isExpired"
        });

        tool.component = {
            name: "gem-historical-collection"
        };
    };

    TypeDisplay.prototype.setInputPropertiesAsRequired = function (propertyNames) {
        var self = this;
        var inputs = propertyNames.forEach(function (name) {
            var input = self.getInputByName(name);

            input.validateAsync = function (value) {
                if (value === null) {
                    return Future.fromError(new Error("Required"));
                }
                return Future.fromResult();
            };
        });

    };

    TypeDisplay.prototype.setToolAsSingleHistoricalCollection = function (name) {
        var tool = this.getToolByName(name);

        if (tool == null) {
            throw new Error("Couldn't find tool by the name: " + name + ".");
        }

        // Remove these inputs from showing up on the main form.
        this.mainInputs = this.mainInputs.filter(function (input) {
            return input.propertyName !== "endDate" && input.propertyName !== "startDate"
        });

        tool.component = {
            name: "gem-single-historical-collection"
        };
    };

    TypeDisplay.prototype.asQueryable = function () {
        return this.service.asQueryable(this.type);
    };

    TypeDisplay.prototype.createRelationshipProperties = function (edm, model) {
        var instance = new model.type();
        var relationships = {};
        var oneToOne = edm.getOneToOneRelationships(instance);
        var oneToMany = edm.getOneToManyRelationships(instance);
        var manyToMany = edm.getManyToManyRelationships(instance);
        var oneToOneTargets = edm.getOneToOneAsTargetRelationships(instance);
        var oneToManyTargets = edm.getOneToManyAsTargetRelationships(instance);
        var manyToManyTargets = edm.getManyToManyAsTargetRelationships(instance);

        oneToOne.forEach(function (relationship) {
            relationships[relationship.hasOne] = {
                name: relationship.hasOne,
                relationship: relationship,
                label: function () {
                    return prettifyName(relationship.hasOne);
                },
                component: {
                    name: "gem-one-to-one-form"
                }
            };
        });

        oneToMany.forEach(function (relationship) {
            relationships[relationship.hasMany] = {
                name: relationship.hasMany,
                relationship: relationship,
                label: function () {
                    return prettifyName(relationship.hasMany);
                },
                component: {
                    name: "gem-one-to-many-collection-form"
                }
            };
        });

        manyToMany.forEach(function (relationship) {
            relationships[relationship.hasMany] = {
                name: relationship.hasMany,
                relationship: relationship,
                label: function () {
                    return prettifyName(relationship.hasMany);
                },
                component: {
                    name: "gem-many-to-many-form"
                }
            };
        });

        oneToOneTargets.forEach(function (relationship) {
            //relationships[relationship.withOne] = {
            //    name: relationship.withOne,
            //    relationship: relationship,
            //    label: function () {
            //        return prettifyName(relationship.withOne);
            //    },
            //    component: {
            //        name: "gem-one-to-one-target-form"
            //    }
            //};
        });

        oneToManyTargets.forEach(function (relationship) {
            relationships[relationship.withOne] = {
                name: relationship.withOne,
                propertyName: relationship.withOne,
                relationship: relationship,
                label: function () {
                    return prettifyName(relationship.withOne);
                },
                component: {
                    name: "gem-one-to-many-target-input"
                },
                span: 6
            };
        });

        manyToManyTargets.forEach(function (relationship) {
            relationships[relationship.withMany] = {
                name: relationship.withMany,
                relationship: relationship,
                label: function () {
                    return prettifyName(relationship.withMany);
                },
                component: {
                    name: "gem-many-to-many-target-form"
                }
            };
        });

        return relationships;
    };

    components.gem.TypeDisplay = TypeDisplay;

});