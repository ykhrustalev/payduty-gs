function TemplateEvent(fields) {
    var self = this;
    Object.keys(fields).forEach(function (key) {
        self[key] = fields[key];
    });
}

TemplateEvent.parseSheet = function (sheet) {
    return sheet.getDataRange().getValues().splice(1)
        .map(TemplateEvent.parseRow)
        .splice(1)
        .filter(function (item) {
            return item instanceof TemplateEvent;
        });
};

TemplateEvent.parseRow = function (row) {
    if (Utils.isRowEmpty(row)) {
        return null;
    }

    var schedule = Schedule.parseValue(row[3]);
    if (schedule == null) {
        Logger.log(["Can't parse schedule in row", row]);
        return null
    }

    return new TemplateEvent({
        title: row[0],
        category: row[1],
        amount: row[2],
        schedule: schedule,
        method: row[4],
        comment: row[5],
        paymentLink: row[6]
    })
};

TemplateEvent.prototype = {
    produceEvents: function (targetMonth) {
        var self = this;
        return this.schedule.produceDates(targetMonth).map(function (date) {
            return new ScheduledEvent({
                done: false,
                date: date,
                title: self.title,
                category: self.category,
                amount: self.amount,
                arguments: "",
                method: self.method,
                comment: self.comment,
                paymentLink: self.paymentLink
            })
        })
    }
};
