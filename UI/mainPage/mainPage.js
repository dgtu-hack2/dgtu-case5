'use strict';

var mainPage = angular.module('myApp.mainPage', ['ngRoute']);

mainPage.controller('MainPageCtrl', function ($scope, diagramService, programService, $location, grapthService) {

    $scope.modelValue = "test";

    getPrograms();
    getGraphsFunctions();
        function getPrograms() {
            programService.getPrograms().then(function (response) {
                var data = response;

                if (data[0].Progs) {
                    console.log(data[0].Progs)
                    $scope.programs = data[0].Progs;
                }
            });
        }

    function getGraphsFunctions() {
        grapthService.getGraphsFunctions().then(function (response) {
            var data = response;
            if (data[0].FuncGraphs) {
                console.log(data[0].FuncGraphs)
                $scope.graphFunctions = data[0].FuncGraphs;
                angular.forEach($scope.graphFunctions, function(funcItem){
                    angular.forEach(funcItem.MarksFunc, function(markItem){
                        console.log(markItem);
                        if(typeof fn === 'function') {
                            fn(t.parentNode.id);
                        }
                        eval(markItem + '()');
                    })
                })
            }
        });
    }
    
    function functionHrParams(seacrch){
        
         hhService.getHhParamsByVacancyName(seacrch).then(function(response){
             console.log(response)
              return response;
         });
        
        console.log("func A");
       
    }
    
    function functionB(){
        console.log("func B")
    }
    
    function functionC(){
        console.log("func C")
    }



    $scope.lookProgram = function (program) {
        localStorage.setItem('program', JSON.stringify(program));
        $location.path('program');
    }


    $scope.drawCanvas = function (program, index) {
        setTimeout(function () {
            drawRadar(index);
        }, 1500)


    }






    // var massive = [['Name', 'Value']];
    // var options = {
    //     title: "",
    //     legend: {
    //         position: 'none'
    //     },
    // };

    // getDiagram();


    //drawRadar();


    // translate("текст");
    //
    // function getDiagram() {
    //     diagramService.getDiagram().then(function (response) {
    //         var data = response;
    //         //console.log(response)
    //         if (data[0].DocTitle[1]) {
    //             var doc = data[0].DocTitle[1];
    //             var title = doc.DiagTitle;
    //             for (var i = 0 ; i< doc.Marks.length; i++) {
    //                 var item = [doc.Params[i], doc.Marks[i]];
    //                 massive.push(item);
    //             }
    //             options.title = title;
    //             //console.log(massive)
    //             google.charts.load("current", {
    //                 packages: ["corechart"]
    //             });
    //             google.charts.setOnLoadCallback(drawGistChart);
    //         }
    //     });
    // }
    //
    //
    // function drawGistChart() {
    //     var data = google.visualization.arrayToDataTable(massive);
    //
    //
    //     var chart = new google.visualization.LineChart(document.getElementById('gistogram'));
    //
    //     chart.draw(data, options);
    //     //var chart = new google.visualization.Histogram(document.getElementById('gistogram'));
    //     //chart.draw(data, options);
    // }

    function drawRadar(index) {
        var ctx = document.getElementById('chart' + index);
        var radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ["Параметр1", "Параметр2", "Параметр3", "Параметр4", "Параметр5", "Параметр6"],
                datasets: [{
                    label: "Label 1",
                    backgroundColor: "rgba(169, 209, 140, 0.1)",
                    data: [65, 75, 70, 80, 60, 80]
                }, {
                    label: "Label 2",
                    backgroundColor: "rgba(106, 34, 112, 0.1)",
                    data: [80, 70, 10, 30, 25, 83]
                }, {
                    label: "Label 3",
                    backgroundColor: "rgba(34, 69, 112, 0.1)",
                    data: [21, 72, 50, 12, 64, 34]
                }, {
                    label: "Label 4",
                    backgroundColor: "rgba(199, 121, 132, 0.1)",
                    data: [32, 34, 41, 74, 35, 60]
                }]
            }
        });
    };

    // function translate(text) {
    //     var trans = new Trans.Trans({
    //         handles: false,
    //         worker: 3,
    //         initPageTimeout: 0,
    //         responseCb: async response => {
    //             const url = response.url();
    //             console.log(url);
    //             try {
    //                 const text = await response.text();
    //                 const status = response.status();
    //
    //                 let ret = JSON.parse(text);
    //                 ret = ret[0]
    //                 let data = ""
    //                 for (let i = 0; i < ret.length; i++) {
    //                     if (ret[i][0]) {
    //                         data += ret[i][0]
    //                     }
    //                 }
    //                 return Promise.resolve(data);
    //             } catch (err) {
    //                 console.error(`Failed getting data from: ${url}`);
    //                 console.error(err);
    //             }
    //         }
    //     });
    //
    //     trans.init().then(res => res < 0 && new Error("[error] init error")).catch(e => console.log(e));
    //
    //     var result = trans.trans(text);
    //     console.log(result);
    // };



    /* 

        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawSeriesChart);
        var legend = [['ID', 'Life Expectancy', 'Fertility Rate', 'Region', 'Population']];

        function drawSeriesChart() {

            var data = google.visualization.arrayToDataTable(legend);

            var options = {
                title: 'Correlation between life expectancy, fertility rate ' +
                    'and population of some world countries (2010)',
                hAxis: {
                    title: 'Life Expectancy'
                },
                vAxis: {
                    title: 'Fertility Rate'
                },
                bubble: {
                    textStyle: {
                        fontSize: 11
                    }
                }
            };

            var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
            chart.draw(data, options);
        }
        visualize();

        function GaussRand() {
            var s = 2 * Math.random() - 1;
            var m = 2 * Math.random() - 1;
            var u = s * s + m * m;
            if (u == 0 || u > 1) return GaussRand();
            var k = Math.sqrt(-2 * Math.log(u) / u);
            return s * m;
        }


        function visualize() {
            var time = 0;
            var x1 = 80.5;
            var y1 = 1.5;
            var x2 = 80.5;
            var y2 = 1.5;
            var x3 = 80.5;
            var y3 = 1.5;
            var x4 = 80.5;
            var y4 = 1.5;
            var x5 = 80.5;
            var y5 = 1.5;
            var startValue1 = 2555;
            var startValue2 = 2555;
            var startValue3 = 2555;
            var startValue4 = 2555;
            var startValue5 = 2555;
            var iter = 0;
            var time = 0;
            var intervalTest = setInterval(function () {
                time += 10;
                iter++;
                x1 +=   time;
                y1 += GaussRand() 
                x2 +=  time;
                y2 += GaussRand() 
                x3 +=   time;
                y3 += GaussRand() 
                x4 +=   time;
                y4 += GaussRand() 
                x5 +=   time;
                y5 += GaussRand() 
                
                startValue1 += Math.random() * 10 - GaussRand() * 10;
                startValue2 += Math.random() * 10 - GaussRand() * 10;
                startValue3 += Math.random() * 10 - GaussRand() * 10;
                startValue4 += Math.random() * 10 - GaussRand() * 10;
                startValue5 += Math.random() * 10 - GaussRand() * 10;

                var val1 = ['CAN', x1, y1, 'С', startValue1];
                var val2 = ['DEU', x2, y2, 'Е', startValue2];
                var val3 = ['DNK', x3, y3, 'Р', startValue3];
                var val4 = ['EGY', x4, y4, 'Ё', startValue4];
                var val5 = ['GBR', x5, y5, 'Г', startValue5];
                var val6 = ['2GBR', y2, x4, 'А', startValue5];
                
                legend.push(val1);
                //legend.push(val2);
                //legend.push(val3);
                //legend.push(val4);
                //legend.push(val5);
                //legend.push(val6);
                
                drawSeriesChart();

                if (iter == 125) clearInterval(intervalTest);
            }, 250)

        }





        var mass = [['VALUE', 'COS']];
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var startValue1 = 1000;
            var startValue2 = 1170;
            var startValue3 = 660;
            var startValue4 = 1030;
            var time = 0;
            var cnt = 0;
            var intervalTest = setInterval(function () {
                time = time + 0.1 * Math.random() * 0, 1;
                cnt++;
                //var y = 100 * 0.5 - ((Math.random() * 4 - Math.random() * 2) + ((Math.random() * 10 >= 5) ? Math.cos(time + cnt * 0.05) * 20 : Math.sin(time + cnt * 0.05) * 20));
                var y = GaussRand();
                mass.push([cnt, y])


                // Define the chart to be drawn.
                var data = google.visualization.arrayToDataTable(mass);

                var options = {
                    title: 'Company Performance',
                    curveType: 'function',
                    legend: {
                        position: 'bottom'
                    }
                };

                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                if (cnt == 500) clearInterval(intervalTest);
                chart.draw(data, options);
            }, 100)
        }*/

});