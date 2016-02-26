class SunburstChartTestMixin(object):
    def click_on_sunburst(self, index):
        self.browser.execute_script(
            '''
                var path = d3
                    .select('g#sunburstd3-chart-container')
                    .select('path:nth-child({index})');

                path.on('click').call(path.node(), path.datum());
            '''
            .format(index=index)
            )
        self.until_ajax_complete()
