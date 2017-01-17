Utils = {
    toBool: function (value) {
        if (typeof value == "boolean")
            return value;
        return ['yes', 'да', '1', 'true', 'правда'].indexOf(value.toLowerCase()) >= 0
    },

    isRowEmpty: function (row) {
        var empty = true;
        row.map(function (column) {
            if (typeof column == "string" && column.trim() != "") {
                empty = false;
            } else if (column) {
                empty = false
            }
        });
        return empty;
    }
};

