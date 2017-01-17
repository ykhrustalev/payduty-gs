function Schedule(dayOfMonth, dayOfWeek) {
    this.dayOfMonth = dayOfMonth;
    this.dayOfWeek = dayOfWeek;
}

Schedule.parseValue = function (value) {
    var dayOfWeek = null,
        dayOfMonth = null;

    if (typeof value !== "string") {
        value = value.toString();
    }

    value = value.trim();
    if (value == "") {
        dayOfMonth = 10;
    } else if (value[0] == 'w') {
        dayOfWeek = parseInt(value.split(':')[1]);
        if (isNaN(dayOfWeek)) {
            Logger.log("bad value for row " + value);
            return null
        }
    } else {
        dayOfMonth = parseInt(value);
        if (isNaN(dayOfMonth)) {
            Logger.log("bad value for row " + value);
            return null
        }
    }

    return new Schedule(dayOfMonth, dayOfWeek)
};

Schedule.prototype = {
    produceDates: function (targetMonth) {
        if (this.dayOfMonth !== null) {
            return [this._day(targetMonth, this.dayOfMonth)];
        }

        var res = [];
        for (var theDay = 1, len = 31; theDay < len; theDay++) {
            var date = this._day(targetMonth, theDay);
            if (date.getMonth() != targetMonth.getMonth()) {
                break;
            }
            if (date.getDay() == this.dayOfWeek) {
                res.push(date);
            }
        }

        return res;
    },

    _day: function (target, day) {
        return new Date(target.getFullYear(), target.getMonth(), day);
    }
};
