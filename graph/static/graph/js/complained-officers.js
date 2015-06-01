(function() {
    var cols = [];
    var rotated = false;
    drawChart();

    $.get('officer/count/?by=num_complaints', function(data) {
        cols = data;
        drawChart();
    });

    $('#complained-officers').find('.swap-axes').click(function() {
        rotated = !rotated;
        drawChart();
    });

    function drawChart() {
        var chart = c3.generate({
            bindto: '#complained-officers .graph',
            data: {
                columns: [
                    ['No. officers'].concat(cols)
                ],
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
                rotated: rotated,
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

        var under20 = 0;
        for (var i = 0; i < 20; i++) {
            under20 += cols[i];
        }
        chart.xgrids.add({value: 20, text: under20 + ' under 20 complaints', class: 'under20'});
    }
})();
