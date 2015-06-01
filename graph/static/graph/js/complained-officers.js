(function() {
    var GRAPH_ELEM_SEL = '#complained-officers .graph';

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
            bindto: GRAPH_ELEM_SEL,
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
                },
                position: function (data, width, height, element) {
                    return {
                        top: -15,
                        left: 300
                    }
                },
                contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                    var point = d[0];
                    var numOfficers = point.value;
                    var numComplaints = point.index;
                    return '<strong>'+numOfficers + '</strong> officers with <strong>' + numComplaints + '</strong> complaints';
                }
            }
        });
    }
})();
