BASE.require([
    "jQuery",
    "Date.prototype.format"
], function () {

    BASE.namespace("components.ui.inputs");

    components.ui.inputs.UIDatePickerLabel = function (elem, tags) {
	    var self = this;
	    var $elem = $(elem);
		var $date = $(tags["date"]);
		var $display = $(tags["display"]);
		var dateController = $date.controller();

		var setDisplayDate = function (date) {
		    $display.val(date.format("mmmm d, yyyy"));
		};

		$date.on("change", function (e) {
			setDisplayDate(e.value);
		});

		$display.on("change", function (event) {
		    event.stopPropagation();
		    $elem.next('.text-warning').remove();
		    var date = new Date(Date.parse($display.val()));
		    if (isNaN(date.getTime())) {
		        $elem.after('<span class="text-danger help-inline">Please enter a valid date.</span>');
		        $elem.trigger({ type: 'change', value: null });
		    }
		    else {
		        //setDisplayDate(date);
		        dateController.setValue(date);
		        $elem.trigger({ type: 'change', value: date });
		    }   
		});

		self.getValue = function () {
			return dateController.getValue();
		};

		self.setValue = function (value) {
			dateController.setValue(value);
		};

		setDisplayDate(dateController.getValue());

	};

});