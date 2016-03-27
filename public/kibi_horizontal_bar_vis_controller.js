define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  // var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana','nvd3ChartDirectives']);
  var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana','nvd3']);
  var d3 = require('d3');

  module.controller('KbnHorizontalBarVisController', function ($scope, $element, $rootScope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    var data, config, chart_vis;
    var margin, width, height;

    // declare data
    var tableGroups = null;

    var svg_root = $element[0] ; 
    // d3.select($element[0]).selectAll("svg").remove();

    var _updateDimensions = function () {
      var delta = 18;
      var w = $element.parent().width();
      var h = $element.parent().height();
      if (w) {
        if (w > delta) {
          w -= delta;
        }
        width = w;
      }
      if (h) {
        if (h > delta) {
          h -= delta;
        }
        height = h;
      }
    };

    var off = $rootScope.$on('change:vis', function () {
      _updateDimensions();
      _initConfig();
      $scope.processTableGroups(tableGroups);
      _updateConfig();
    });

    $scope.$on('$destroy', off);

    $scope.options = {
      chart: {
          type: 'multiBarHorizontalChart',
          height: 450,
          width: 850,
          x: function(d){return d.label;},
          y: function(d){return d.value;},
          showControls: false,
          stacked: true,
          tooltips: true,
          showValues: true,
          duration: 500,
          xAxis: {
              showMaxMin: false
          },
          yAxis: {
              axisLabel: 'Values',
              tickFormat: function(d){
                  return d3.format(',.2f')(d);
              }
          },                
          dispatch: {
              elementClick: function(e){ console.log('click') },
              elementMouseover: function(e){ console.log('mouseover') },
              elementMouseout: function(e){ console.log('mouseout') },
              renderEnd: function(e){ console.log('renderEnd') }
          },
          legend: {
              dispatch: {
                  legendClick: function(e) {
                    console.log("legend click");
                    _updateConfig();
                  }
              }
          }                
      }
  };
    $scope.data = [
        {
            "key": "Series1",
            "color": "#d62728",
            "values": [
                {
                    "label" : "Group A" ,
                    "value" : -1.8746444827653
                } ,
                {
                    "label" : "Group B" ,
                    "value" : -8.0961543492239
                } ,
                {
                    "label" : "Group C" ,
                    "value" : -0.57072943117674
                } ,
                {
                    "label" : "Group D" ,
                    "value" : -2.4174010336624
                } ,
                {
                    "label" : "Group E" ,
                    "value" : -0.72009071426284
                } ,
                {
                    "label" : "Group F" ,
                    "value" : -0.77154485523777
                } ,
                {
                    "label" : "Group G" ,
                    "value" : -0.90152097798131
                } ,
                {
                    "label" : "Group H" ,
                    "value" : -0.91445417330854
                } ,
                {
                    "label" : "Group I" ,
                    "value" : -0.055746319141851
                }
            ]
        },
        {
            "key": "Series2",
            "color": "#1f77b4",
            "values": [
                {
                    "label" : "Group A" ,
                    "value" : 25.307646510375
                } ,
                {
                    "label" : "Group B" ,
                    "value" : 16.756779544553
                } ,
                {
                    "label" : "Group C" ,
                    "value" : 18.451534877007
                } ,
                {
                    "label" : "Group D" ,
                    "value" : 8.6142352811805
                } ,
                {
                    "label" : "Group E" ,
                    "value" : 7.8082472075876
                } ,
                {
                    "label" : "Group F" ,
                    "value" : 5.259101026956
                } ,
                {
                    "label" : "Group G" ,
                    "value" : 0.30947953487127
                } ,
                {
                    "label" : "Group H" ,
                    "value" : 0
                } ,
                {
                    "label" : "Group I" ,
                    "value" : 0
                }
            ]
        }
    ];

    var chart;
   
    var long_short_data = [
        {
            key: 'Series1',
            values: [
                {
                    "label" : "Group A" ,
                    "value" : -1.8746444827653
                } ,
                {
                    "label" : "Group B" ,
                    "value" : -8.0961543492239
                } ,
                {
                    "label" : "Group C" ,
                    "value" : -0.57072943117674
                } ,
                {
                    "label" : "Group D" ,
                    "value" : -2.4174010336624
                } ,
                {
                    "label" : "Group E" ,
                    "value" : -0.72009071426284
                } ,
                {
                    "label" : "Group F" ,
                    "value" : -2.77154485523777
                } ,
                {
                    "label" : "Group G" ,
                    "value" : -9.90152097798131
                } ,
                {
                    "label" : "Group H" ,
                    "value" : 14.91445417330854
                } ,
                {
                    "label" : "Group I" ,
                    "value" : -3.055746319141851
                }
            ]
        },
        {
            key: 'Series2',
            values: [
                {
                    "label" : "Group A" ,
                    "value" : 25.307646510375
                } ,
                {
                    "label" : "Group B" ,
                    "value" : 16.756779544553
                } ,
                {
                    "label" : "Group C" ,
                    "value" : 18.451534877007
                } ,
                {
                    "label" : "Group D" ,
                    "value" : 8.6142352811805
                } ,
                {
                    "label" : "Group E" ,
                    "value" : 7.8082472075876
                } ,
                {
                    "label" : "Group F" ,
                    "value" : 5.259101026956
                } ,
                {
                    "label" : "Group G" ,
                    "value" : 7.0947953487127
                } ,
                {
                    "label" : "Group H" ,
                    "value" : 8
                } ,
                {
                    "label" : "Group I" ,
                    "value" : 21
                }
            ]
        },
        {
            key: 'Series3',
            values: [
                {
                    "label" : "Group A" ,
                    "value" : -14.307646510375
                } ,
                {
                    "label" : "Group B" ,
                    "value" : 16.756779544553
                } ,
                {
                    "label" : "Group C" ,
                    "value" : -18.451534877007
                } ,
                {
                    "label" : "Group D" ,
                    "value" : 8.6142352811805
                } ,
                {
                    "label" : "Group E" ,
                    "value" : -7.8082472075876
                } ,
                {
                    "label" : "Group F" ,
                    "value" : 15.259101026956
                } ,
                {
                    "label" : "Group G" ,
                    "value" : -0.30947953487127
                } ,
                {
                    "label" : "Group H" ,
                    "value" : 0
                } ,
                {
                    "label" : "Group I" ,
                    "value" : 0
                }
            ]
        }
    ];

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        data = [];
        var cols = table.columns;
        table.rows.forEach(function(row,i){
            var group = {};
            group['group'] = row[0];
            var axes = [];
            for (var i = 1; i < row.length; i++) {
                var item = {};
                item.axis = cols[i].aggConfig.params.field.displayName;
                item.value = row[i];
                axes.push(item);              
            }
            group.axes = axes;
            data.push(group);
        });
      });
    };

  // set default config  
    var _initConfig = function(){
        margin = 20;
      config = {
        w: width,
        h: height,        
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showControls: false,
        showValues: true,
        showTooltips: true,
        showStacked: true,
        showGrouped: false
    };
  }

   // $scope.$on('legendClick.directive', function(angularEvent, event){
   //    console.log("legend click");
   //    // _updateConfig();
   //  });

   var _updateConfig = function() {    
        config.showLegend = $scope.vis.params.addLegend;
        config.showTooltips = $scope.vis.params.addTooltip;
        config.showStacked = $scope.vis.params.addStacked;
        config.showGrouped = $scope.vis.params.addGrouped;
        config.w = width;
        config.h = height;
        config.showValues = $scope.vis.params.addValues;

        $scope.options = {
            chart: {
                type: 'multiBarHorizontalChart',
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                width: config.w,
                height: config.h,
                showControls: config.showControls,
                showValues: config.showValues,
                stacked: config.showStacked,
                grouped: config.showGrouped,
                showLegend: config.showLegend,
                tooltips: config.showTooltips,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                },                
                dispatch: {
                    elementClick: function(e){ console.log('click') },
                    elementMouseover: function(e){ console.log('mouseover') },
                    elementMouseout: function(e){ console.log('mouseout') },
                    renderEnd: function(e){ console.log('renderEnd') }
                },
                legend: {
                    dispatch: {
                        legendClick: function(e) {
                          console.log("legend click");
                          _updateConfig();
                        }
                    }
                }                
            }
        };
        // $scope.data = long_short_data;
        
    };

    $scope.$watch('esResponse', function (resp) {
      _initConfig();
      if (resp) {
        tableGroups = tabifyAggResponse($scope.vis, resp);
        if(tableGroups.tables.length>0){
          if(tableGroups.tables[0].columns.length > 1){
            _updateDimensions();
            $scope.processTableGroups(tableGroups);
            _updateConfig();
          }
        }        
      }
    });
  });
});
