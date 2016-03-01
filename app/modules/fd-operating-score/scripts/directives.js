angular.module('operatingScore.directives', [])
    .directive('fdOperatingScore', [
        '$templateCache',
        '$state',
        function ($templateCache,
                  $state) {
            return {
                restrict: 'EA',
                template: $templateCache.get('fd-operating-score.htm'),
                replace: true,
                scope: {
                },
                link: function (scope, iElement, iAttrs) {

                },
                controller: [
                    '$rootScope',
                    '$scope',
                    function ($rootScope, scope) {
                        console.log('Loaded operating score!');
                        scope.potentialGrossPercent = 38;
                        var colors = ['#E2AC03','#E6E6E6'];

                        scope.chartConfig = {

                            options: {
                                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                                //will be overriden by values specified below.
                                chart: {
                                    renderTo: 'container',
                                    type: 'pie'
                                },
                            },
                            //The below properties are watched separately for changes.

                            //Series object (optional) - a list of series using normal Highcharts series options.
                            series: [{
                                data:  [
                                    {y:scope.potentialGrossPercent, color: colors[0]},
                                    {y:100 - scope.potentialGrossPercent, color: colors[1]}
                                ],
                                size: '100%',
                                innerSize: '50%',
                                borderWidth: 4,
                                dataLabels: {
                                    enabled: false
                                }
                            }],
                            title: {
                                //text: '38',
                                //verticalAlign: 'middle',
                                //floating: true
                                text:''
                            },
                            //Boolean to control showing loading status on chart (optional)
                            //Could be a string if you want to show specific loading text.
                            loading: false,
                            //size (optional) if left out the chart will default to size of the div or something sensible.
                            size: {
                                width: 400,
                                height: 300
                            },
                            func: function (chart) {
                                // Option 1
                                //var circleradius = 102;
                                //
                                //chart.innerText = chart.renderer.text(38, 150, 160).css({
                                //    width: circleradius,
                                //    color: '#333333',
                                //    fontSize: '50.61px',
                                //    textAlign: 'center'
                                //}).attr({
                                //    zIndex: 999
                                //}).add();

                                // Option 2
                                var textX = chart.plotLeft + (chart.plotWidth  * 0.5);
                                var textY = chart.plotTop  + (chart.plotHeight * 0.5);
                                var span2 = $templateCache.get('fd-operating-donut-desc.htm');
                                $("#addText").append(span2);
                                var span = $('#pieChartInfoText');
                                span.css('left', textX + (span.width() * -0.5));
                                span.css('top', textY + (span.height() * -0.5));
                                span.css('zIndex', 999);
                            }
                        };
                    }]
            }
        }]);