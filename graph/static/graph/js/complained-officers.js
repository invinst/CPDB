(function() {
    var chart = c3.generate({
        bindto: '#complained-officers',
        data: {
            columns: [],
            type: 'area-spline',
            empty: {
                label: {
                    text: 'Loading data...'
                }
            }
        },
        regions: [
            {end: 20, class: 'light'},
            {start: 20, end: 60, class: 'medium'},
            {start: 60, class: 'heavy'},
        ],
        point: {
            show: false
        },
        axis: {
            x: {
                label: {
                    text: 'Number of complaints',
                    position: 'outer-right'
                }
            },
            y: {
                label: {
                    text: 'Number of officers',
                    position: 'outer-top'
                }
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                title: function(d) { return d + ' complaints'; }
            }
        }
    });

    $.get('officer/count/?by=num_complaints', function(data) {
        chart.load({
            columns: [
                ['No. officers'].concat(data)
            ]
        });

        var under20 = 0;
        for (var i = 0; i < 20; i++) {
            under20 += data[i];
        }
        chart.xgrids.add({value: 20, text: under20 + ' under 20 complaints', class: 'under20'});
    });
})();
