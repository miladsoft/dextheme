"use strict";

// Class definition
var DEXCardWidget12 = function () {
    var chart = {
        self: null,
        rendered: false
    };

    // Private methods
    var initChart = function(chart) {
        var element = document.getElementById("dex_card_widget_12_chart");

        if (!element) {
            return;
        }

        var height = parseInt(DEXUtil.css(element, 'height'));       
        var borderColor = DEXUtil.getCssVariableValue('--dex-border-dashed-color');
        var baseColor = DEXUtil.getCssVariableValue('--dex-gray-800');
        var lightColor = DEXUtil.getCssVariableValue('--dex-success');

        var options = {
            series: [{
                name: 'Sales',
                data: [3.5, 5.7, 2.8, 5.9, 4.2, 5.6, 4.3, 4.5, 5.9, 4.5, 5.7, 4.8, 5.7]
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'area',
                height: height,
                toolbar: {
                    show: false
                }
            },             
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: 'solid',
                opacity: 0
            },
            stroke: {
                curve: 'smooth',
                show: true,
                width: 2,
                colors: [baseColor]
            },
            xaxis: {                 
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    show: false
                },
                crosshairs: {
                    position: 'front',
                    stroke: {
                        color: baseColor,
                        width: 1,
                        dashArray: 3
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: undefined,
                    offsetY: 0,
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                x: {
                    formatter: function (val) {
                        return "Feb " + val;
                    }
                },
                y: {
                    formatter: function (val) {
                        return val * "10" + "K"
                    }
                }
            },
            colors: [lightColor],
            grid: { 
                borderColor: borderColor,                 
                strokeDashArray: 4,
                padding: {
                    top: 0,
                    right: -20,
                    bottom: -20,
                    left: -20
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            markers: {               
                strokeColor: baseColor,
                strokeWidth: 2
            }
        }; 

        chart.self = new ApexCharts(element, options);

        // Set timeout to properly get the parent elements width
        setTimeout(function() {
            chart.self.render();
            chart.rendered = true;
        }, 200);   
    }

    // Public methods
    return {
        init: function () {
            initChart(chart);

            // Update chart on theme mode change
            DEXThemeMode.on("DEX.thememode.change", function() {                
                if (chart.rendered) {
                    chart.self.destroy();
                }

                initChart(chart);
            });
        }     
    }
}();

// Webpack support
if (typeof module !== 'undefined') {
    module.exports = DEXCardWidget12;
}

