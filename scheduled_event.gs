function ScheduledEvent(fields) {
    var self = this;
    Object.keys(fields).forEach(function (key) {
        self[key] = fields[key];
    });
}

ScheduledEvent.headers = function () {
    return [
        'done',
        'date',
        'title',
        'category',
        'amount',
        'arguments',
        'method',
        'comment',
        'paymentLink'
    ]
};

ScheduledEvent.parseSheet = function (sheet) {
    return sheet.getDataRange().getValues().splice(1)
        .map(ScheduledEvent.parseRow)
        .filter(function (item) {
            return item instanceof ScheduledEvent;
        });
};

ScheduledEvent.parseRow = function (row) {
    if (Utils.isRowEmpty(row)) {
        return null;
    }

    return new ScheduledEvent({
        done: Utils.toBool(row[0]),
        date: row[1],
        title: row[2],
        category: row[3],
        amount: row[4],
        arguments: row[5],
        method: row[6],
        comment: row[7],
        paymentLink: row[8]
    });
};

ScheduledEvent.prototype = {
    toRow: function () {
        return [
            this.done ? "yes" : "no",
            this.date.toISOString().slice(0, 10),
            this.title,
            this.category,
            this.amount,
            this.arguments,
            this.method,
            this.comment,
            this.paymentLink
        ]
    }
};
