function scheduleThisMonth() {
    new Scheduler(true).run();
}
function scheduleNextMonth() {
    new Scheduler(false).run();
}


function Scheduler(thisMonth) {
    this.thisMonth = thisMonth;
}

Scheduler.prototype = {
    run: function () {
        var sheet = SpreadsheetApp.getActiveSpreadsheet(),
            targetMonth = this.getTargetMonth(this.thisMonth),
            taregtSheetName = this.getTargetSheetName(targetMonth);

        var targetSheet = this.getOrCreateTargetSheet(sheet, taregtSheetName);

        var templateEvents = this.getTemplateEvents(sheet.getSheetByName("Expenses"));
        var definedEvents = this.getDefinedEvents(targetSheet);

        var templateBoundEvents = this.getEventsFromTemplates(templateEvents, targetMonth);
        var mergedEvents = this.mergeEvents(definedEvents, templateBoundEvents);

        this.populateSheet(targetSheet, mergedEvents);
    },

    getTargetMonth: function (thisMonth) {
        var now = new Date();
        return new Date(now.getFullYear(), thisMonth ? now.getMonth() : now.getMonth() + 1, 1)
    },

    getTargetSheetName: function (targetMonth) {
        return "" + targetMonth.getFullYear() + "." + (targetMonth.getMonth() + 1);
    },

    getOrCreateTargetSheet: function (sheet, taregtSheetName) {
        var targetSheet = sheet.getSheetByName(taregtSheetName);
        if (targetSheet == null) {
            targetSheet = sheet.insertSheet(taregtSheetName, 2);
        }
        targetSheet.autoResizeColumn(1);
        return targetSheet;
    },

    getTemplateEvents: function (sheet) {
        return TemplateEvent.parseSheet(sheet)
    },

    getDefinedEvents: function (sheet) {
        return ScheduledEvent.parseSheet(sheet)
    },

    getEventsFromTemplates: function (templateEvents, targetMonth) {
        return templateEvents
            .map(function (event) {
                return event.produceEvents(targetMonth)
            })
            .reduce(function (acc, cur) {
                return acc.concat(cur)
            }, []);
    },

    mergeEvents: function (defined, templated) {
        var map = {};
        var key = function (event) {
            return event.title + event.category
        };

        defined.forEach(function (event) {
            map[key(event)] = true
        });

        return defined.concat(
            templated.filter(function (event) {
                return !map.hasOwnProperty(key(event))
            })
        );
    },

    populateSheet: function (sheet, events) {
        sheet.clearContents();
        sheet.appendRow(ScheduledEvent.headers());
        events.forEach(function (event) {
            sheet.appendRow(event.toRow())
        });

        sheet.setFrozenRows(1);
        sheet.getRange('A1:Z1').setFontWeight('bold');
    }
};
