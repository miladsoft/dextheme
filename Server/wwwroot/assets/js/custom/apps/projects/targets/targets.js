"use strict";

// Class definition
var DEXProjectTargets = function () {

    var initDatatable = function () {
        const table = document.getElementById('dex_profile_overview_table');

        // set date data order
        const tableRows = table.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const realDate = moment(dateRow[1].innerHTML, "MMM D, YYYY").format();
            dateRow[1].setAttribute('data-order', realDate);
        });

        // init datatable --- more info on datatables: https://datatables.net/manual/
        const datatable = $(table).DataTable({
            "info": false,
            'order': [],
            "paging": false,
        });

    }

    // Public methods
    return {
        init: function () {
            initDatatable();
        }
    }
}();


