BASE.require([
    "jQuery",
    "jQuery.support.transform",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.widgets");

    components.ui.widgets.UIDatePicker = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $calendarInner = $(tags['calendar-inner']);
        var $calendarMonth = $(tags['calendar-month']);
        var $calendarYear = $(tags['calendar-year']);
        var $calendarMonths = $(tags['calendar-months']);
        var $calendarYears = $(tags['calendar-years']);
        var $calendarTable = $(tags['calendar-table']);
        var calendarMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var calendarMonthsAbbr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        var setCalendarYearsHtml = function (year, howFarBack) {
            $calendarYears.html('');
            var $div = $('<div ui-button class="link"></div>');
            var beginningYear = year - howFarBack;
            $div.text((beginningYear - 10) + '-' + (beginningYear - 1));
            $calendarYears.append($div.clone().addClass('smaller'));
            for (var i = 0; i < 10; i++) {
                $div.text(beginningYear);
                $calendarYears.append($div.clone());
                beginningYear++;
            }
            $div.text(beginningYear + '-' + (beginningYear + 9));
            $calendarYears.append($div.clone().addClass('smaller'));
        }

        var showMonths = function () {
            if (!$calendarMonths.is(':visible')) {
                $calendarYears.addClass('behind');
                $calendarMonths.removeClass('hide').transition({
                    transform: {
                        from: 'scale(0)',
                        to: 'scale(1)',
                        easing: 'linear',
                        duration: 200
                    }
                }).then(function () {
                    $calendarYears.addClass('hide').removeClass('behind');
                });
            }
        }

        var showYears = function () {
            if (!$calendarYears.is(':visible')) {
                var year = parseInt($calendarYear.text(), 10);
                setCalendarYearsHtml(year, 4);
                $calendarMonths.addClass('behind');
                $calendarYears.removeClass('hide').transition({
                    transform: {
                        from: 'scale(0)',
                        to: 'scale(1)',
                        easing: 'linear',
                        duration: 200
                    }
                }).then(function () {
                    $calendarMonths.addClass('hide').removeClass('behind');
                });
            }
        }

        var showCalendar = function () {
            $calendarYears.transition({
                transform: {
                    to: 'scale(0)',
                    easing: 'linear',
                    duration: 200
                }
            }).then(function () {
                $calendarYears.addClass('hide');
            });
            $calendarMonths.transition({
                transform: {
                    to: 'scale(0)',
                    easing: 'linear',
                    duration: 200
                }
            }).then(function () {
                $calendarMonths.addClass('hide');
            });
        }

        self.reset = function () {
            showCalendar();
        }

        self.setDate = function (date) {
            var month = date.getMonth();
            var day = date.getDate();
            var year = date.getFullYear();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            var startDayOfMonth = new Date(year, month, 1).getDay();
            $calendarMonth.text(calendarMonths[month]);
            $calendarYear.text(year);

            var count = 1;
            var $div = $('<div ui-button class="calendar-cell link"></div>');
            $calendarTable.html('');
            amountOfDivs = startDayOfMonth + daysInMonth;
            for (i = 0; i < amountOfDivs; i++) {
                if (i < startDayOfMonth) {
                    $calendarTable.append($div.clone().addClass('invisible'));
                }
                else {
                    $div.text(count);
                    if (count === day) {
                        $calendarTable.append($div.clone().addClass('text-primary'));
                    }
                    else {
                        $calendarTable.append($div.clone());
                    }
                    count++;
                }
            }
            showCalendar();
        }

        self.getDate = function () {
            var year = parseInt($calendarYear.text(), 10);
            var month = $.inArray($calendarMonth.text(), calendarMonths);
            var numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
            var day = parseInt($calendarTable.find('.text-primary').text(), 10);
            day = day > numberOfDaysInMonth ? numberOfDaysInMonth : day;
            return new Date(year, month, day);
        }

        $calendarMonth.on('click', function () {
            var $this = $(this);
            $calendarMonths.find('.text-primary').removeClass('text-primary');
            showMonths();
            $calendarMonths.find('div').filter(function () {
                return $(this).text() === calendarMonthsAbbr[$.inArray($calendarMonth.text(), calendarMonths)];
            }).addClass('text-primary');
        });

        $calendarYear.on('click', function () {
            var $this = $(this);
            $calendarYears.find('.text-primary').removeClass('text-primary');
            showYears();
            $calendarYears.find('div').filter(function () {
                return $(this).text() === $calendarYear.text();
            }).addClass('text-primary');
        });

        $calendarMonths.on('click', 'div', function () {
            var $this = $(this);
            $calendarMonths.find('.text-primary').removeClass('text-primary');
            $this.addClass('text-primary');
            $calendarMonth.text(calendarMonths[$.inArray($this.text(), calendarMonthsAbbr)]);
            var date = self.getDate();
            self.setDate(date);
        });

        $calendarYears.on('click', 'div', function () {
            var $this = $(this);
            var index = $this.index();
            if (index === 0) {
                var split = $this.text().split('-');
                setCalendarYearsHtml(parseInt(split[1], 10), 9);
            }
            else if (index === 11) {
                var split = $this.text().split('-');
                setCalendarYearsHtml(parseInt(split[0], 10), 0);
            }
            else {
                $calendarYears.find('.text-primary').removeClass('text-primary');
                $this.addClass('text-primary');
                $calendarYear.text($this.text());
                var date = self.getDate();
                self.setDate(date);
            }
        });

        $calendarTable.on('click', 'div[ui-button]', function () {
            var $this = $(this);
            $this.siblings().removeClass('text-primary');
            $this.addClass('text-primary');
            $elem.trigger({
                type: 'dayClicked',
                value: self.getDate()
            });
        });

        self.setDate(new Date());
    };
});