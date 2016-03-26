define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['nvd3ChartDirectives']);
  // var module = require('ui/modules').get('kibana/kibi_horizontal_bar_vis', ['kibana','nvd3']);
  var d3 = require('d3');

  module.controller('KbnHorizontalBarVisController', function ($scope, $element, $rootScope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    var data, config, chart_vis;
    var margin, width, height;

    //mouse events
    var over = "ontouchstart" in window ? "touchstart" : "mouseover";
    var out = "ontouchstart" in window ? "touchend" : "mouseout";

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
      // _updateDimensions();
      // _initConfig();
      $scope.processTableGroups(tableGroups);
      // _updateConfig();
      // _render();
    });
    $scope.$on('$destroy', off);

     // $scope.options = {
     //        chart: {
     //            type: 'multiBarHorizontalChart',
     //            width: 100%,
     //            height: 100%,
     //            x: function(d){return d.label;},
     //            y: function(d){return d.value;},
     //            showControls: true,
     //            showValues: true,
     //            duration: 500,
     //            xAxis: {
     //                showMaxMin: false
     //            },
     //            yAxis: {
     //                axisLabel: 'Values',
     //                tickFormat: function(d){
     //                    return d3.format(',.2f')(d);
     //                }
     //            }
     //        }
     //    };

     //    $scope.data = [
     //        {
     //            "key": "Series1",
     //            "color": "#d62728",
     //            "values": [
     //                {
     //                    "label" : "Group A" ,
     //                    "value" : -1.8746444827653
     //                } ,
     //                {
     //                    "label" : "Group B" ,
     //                    "value" : -8.0961543492239
     //                } ,
     //                {
     //                    "label" : "Group C" ,
     //                    "value" : -0.57072943117674
     //                } ,
     //                {
     //                    "label" : "Group D" ,
     //                    "value" : -2.4174010336624
     //                } ,
     //                {
     //                    "label" : "Group E" ,
     //                    "value" : -0.72009071426284
     //                } ,
     //                {
     //                    "label" : "Group F" ,
     //                    "value" : -0.77154485523777
     //                } ,
     //                {
     //                    "label" : "Group G" ,
     //                    "value" : -0.90152097798131
     //                } ,
     //                {
     //                    "label" : "Group H" ,
     //                    "value" : -0.91445417330854
     //                } ,
     //                {
     //                    "label" : "Group I" ,
     //                    "value" : -0.055746319141851
     //                }
     //            ]
     //        },
     //        {
     //            "key": "Series2",
     //            "color": "#1f77b4",
     //            "values": [
     //                {
     //                    "label" : "Group A" ,
     //                    "value" : 25.307646510375
     //                } ,
     //                {
     //                    "label" : "Group B" ,
     //                    "value" : 16.756779544553
     //                } ,
     //                {
     //                    "label" : "Group C" ,
     //                    "value" : 18.451534877007
     //                } ,
     //                {
     //                    "label" : "Group D" ,
     //                    "value" : 8.6142352811805
     //                } ,
     //                {
     //                    "label" : "Group E" ,
     //                    "value" : 7.8082472075876
     //                } ,
     //                {
     //                    "label" : "Group F" ,
     //                    "value" : 5.259101026956
     //                } ,
     //                {
     //                    "label" : "Group G" ,
     //                    "value" : 0.30947953487127
     //                } ,
     //                {
     //                    "label" : "Group H" ,
     //                    "value" : 0
     //                } ,
     //                {
     //                    "label" : "Group I" ,
     //                    "value" : 0
     //                }
     //            ]
     //        }
     //    ];

    $scope.toolTipContentFunction = function(){
      return function(key, x, y, e, graph) {
          return  'Super New Tooltip' +
              '<h1>' + key + '</h1>' +
                '<p>' +  y + ' at ' + x + '</p>'
      }
    };

    $scope.exampleData = [
                {
                    "key": "Series1",
                    "color": "#d62728",
                    "values": [
                        ["Group A" , -1.8746444827653 ],
                        ["Group B" , -8.0961543492239 ],
                        ["Group C" , -0.57072943117674],
                        ["Group D" , -2.4174010336624 ],
                        ["Group E" , -0.72009071426284],
                        ["Group F" , -0.77154485523777],
                        ["Group G" , -0.90152097798131],
                        ["Group H" , -0.91445417330854],
                        ["Group I" , -0.055746319141851]
                    ]
                },
                {
                    "key": "Series2",
                    "color": "#1f77b4",
                    "values": [
                        ["Group A" , 25.307646510375],
                        ["Group B" , 16.756779544553],
                        ["Group C" , 18.451534877007],
                        ["Group D" , 8.6142352811805],
                        ["Group E" , 7.8082472075876],
                        ["Group F" , 5.259101026956],
                        ["Group G" , 0.30947953487127],
                        ["Group H" , 0],
                        ["Group I" , 0]
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
      // var chart_w = 450;
      // var chart_h = 450;
      // var chart_w = width/3;
      // var chart_h = width/3;
      
    };

   
    var _render = function(){
       // d3.select(svg_root).selectAll("svg").remove();     
       
    };

    var _buildVis = function(data) {
       
    };

   

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        // $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
        // var tableGroups = tabifyAggResponse($scope.vis, resp);
        tableGroups = tabifyAggResponse($scope.vis, resp);
        if(tableGroups.tables.length>0){
          if(tableGroups.tables[0].columns.length > 2){
            _updateDimensions();
            _initConfig();
            $scope.processTableGroups(tableGroups);
            _render();
          }
        }        
      }
    });
  });
});
