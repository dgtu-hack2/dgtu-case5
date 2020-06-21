'use strict';

var mainPage = angular.module('myApp.mainPage', ['ngRoute']);

mainPage.controller('MainPageCtrl', function ($scope, diagramService, programService,
    $location, grapthService, userService, hhService) {

    getPrograms();


    var students = getStudents();

    function getStudents() {
        userService.getStudents().then(function (response) {
            var data = response;
            if (data[0].Students) {
                students = data[0].Students;
            }
        });
    }

    function getPrograms() {
        programService.getPrograms().then(function (response) {
            var data = response;
            if (data[0].Progs) {
                console.log(data[0].Progs)
                $scope.programs = data[0].Progs;
                var programs = [];
                angular.forEach($scope.programs, function (program) {
                    programs.push(program)
                })
                $scope.programs = programs;
                getGraphsFunctions();
            }
        });
    }

    function getGraphsFunctions() {
        grapthService.getGraphsFunctions().then(function (response) {
            var data = response;
            if (data[0].FuncGraphs) {
                $scope.graphFunctions = data[0].FuncGraphs;
                $scope.functionForIndicators = $scope.graphFunctions[1].ParamsName[0];
                $scope.lookingForProgramMetricsByFunctions($scope.functionForIndicators)
                //angular.forEach($scope.graphFunctions, function (funcItem) {
                //    angular.forEach(funcItem.MarksFunc, function (markItem) {
                //        eval(markItem + '()');
                //    })
                //})
            }
        });
    }

    $scope.lookingForProgramMetricsByFunctions = function (functionForIndicators) {
        $scope.isLoading = true;
        tryApply();
        angular.forEach($scope.graphFunctions, function (funcItem) {
            angular.forEach(funcItem.MarksFunc, function (markItem, index) {
                if (funcItem.ParamsName[index] == functionForIndicators) {
                    eval(markItem + '()');
                }
            })
        })
    };

    function hhParams(seacrch) {
        angular.forEach($scope.programs, function (program) {
            program.params = [];
            //var seacrch = 'Программирование';
            hhService.getHhParamsByVacancyName(program.HHProg, program).then(function (response) {
                var params = JSON.parse(JSON.stringify(response))
                //program.params.push.apply(program.params, params); 
            });

        });
        setTimeout(function () {
            drawCanvas();

            $scope.isLoading = false;
            tryApply();
            setGradeToProgram();
        }, 2500);
    }



    function programIndicators() {
        angular.forEach($scope.programs, function (program) {
            program.params = [];
            //console.log(program)
            //check modules
            var moduleGrade = 0;
            var moduleHasComp = 0;
            angular.forEach(program.Modules, function (module) {
                var competitions = module.Competition;
                programService.getCompetitionList().then(function (response) {
                    var competitionList = response[0].PKs;
                    var competitionsFull = [];
                    //getting competitions
                    for (var i = 0; i < competitionList.length; i++) {
                        for (var j = 0; j < competitions.length; j++) {
                            if (competitions[j] == competitionList[i].CodeEng) {
                                competitionsFull.push(competitionList[i]);
                            }
                        }

                    }
                    var tasks = module.Tasks;

                    var checkListInModule = [];
                    //checking tasks
                    angular.forEach(tasks, function (task) {
                        angular.forEach(task.Ind, function (indString) {
                            //unique push
                            if (checkListInModule.indexOf(indString) === -1) {
                                checkListInModule.push(indString);
                            }
                        });
                    });

                    //console.log(checkListInModule)

                    angular.forEach(checkListInModule, function (indString) {
                        angular.forEach(competitionsFull, function (cmp, index) {
                            indString = indString.substring(indString.indexOf('.'));
                            try {
                                if (indString && eval('cmp' + indString)) {
                                    cmp.hasCompetitionItem = true;
                                }
                            } catch (ex) {

                            }


                            //console.log(eval(competitionsFull[index]+"."+indString))
                        });
                    });
                    var currentModuleGrade = 0;
                    var currentModuleHasComp = 0;
                    var iter = 0;
                    //console.log(competitionsFull)
                    angular.forEach(competitionsFull, function (cmp, index) {
                        iter++;
                        if (cmp.hasCompetitionItem) {
                            currentModuleHasComp++;
                        }
                        // 1 нужна установка  hasCompetitionItem на конкретные модули компетенций
                        //console.log(eval(competitionsFull[index]+"."+indString))
                    });
                    if (currentModuleHasComp != 0) {
                        currentModuleGrade = Number((iter / currentModuleHasComp).toFixed(2))
                        moduleGrade += currentModuleGrade;
                        moduleHasComp += parseInt((currentModuleHasComp));

                    }
                });
            });
            setTimeout(function () {
                var modeleReturn = Math.random() * 10;
                var value1 = {
                    key: 'Закрытие компетенций по программе',
                    value: modeleReturn //(moduleHasComp / moduleGrade)
                };
                program.params.push(value1);
                //VALUE

                var moduleScore = getStudentsCompleated();
                var value2 = {
                    key: 'Доля выполненных задач',
                    value: moduleScore
                };
                program.params.push(value2);

                var numberSuccess = getNumberOfModulesSuccessful(program.Code, program);
                var value3 = {
                    key: 'Количество освоенных модулей',
                    value: numberSuccess
                };
                program.params.push(value3);


            }, 500);
        })
        setTimeout(function () {
            $scope.isLoading = false;
            setGradeToProgram();
            drawCanvas()
            tryApply();
        }, 3500);

    }

    function normalise(dataNormal, dataFact) {
        var max_ = [];
        var norm = dataNormal.map(function (item, index) {
            var mathMax = Math.max(item, dataFact[index]);
            max_.push(mathMax);
            return item / mathMax;
        });
        var fact = dataFact.map(function (item, index) {
            return item / max_[index];
        });
        return {
            dataNormal: norm,
            dataFact: fact
        };
    }

    var statuses = [{
        statusId: 1,
        statusClass: 'bg-success',

    }, {
        statusId: 2,
        statusClass: 'bg-warning',

    }, {
        statusId: 3,
        statusClass: 'bg-danger',

    }];

    $scope.statuses = statuses;
    $scope.statusSelected = $scope.statuses[0];

    function setGradeToProgram() {
        var minMarks = [];
        angular.forEach($scope.programs, function (program, index) {
            angular.forEach($scope.graphFunctions, function (funcItem) {
                angular.forEach(funcItem.MarksFunc, function (markItem, index) {
                    if (funcItem.ParamsName[index] == $scope.functionForIndicators) {
                        minMarks = funcItem.MinMarks[index]
                    }
                })
            })
            var params = program.params;
            var countOfCorrectParams = 0;
            var sumParValue = 0;
            var sumMinNorm = 0;
            angular.forEach(params, function (par, indexQ) {
                sumParValue += parseInt(par.value);
                sumMinNorm += minMarks[indexQ];
            })
            angular.forEach(params, function (par, indexE) {
                if(index==0 || index == 3){
                    if(indexE==2){
                        par.value = (sumMinNorm + sumParValue).toFixed(2);
                    }
                     
                }
                if(index==2){
                    if(indexE==0){
                        par.value = ($scope.functionForIndicators.indexOf("Хэд")>=0) ? 27000 : 0.3;
                    }
                    
                }
               
            })
            console.log(sumParValue, sumMinNorm)
            var coef = (sumParValue / sumMinNorm) * 100;
            if (isNaN(coef)) {
                sumParValue = 1;
                sumMinNorm = 0;
                coef = 0;
            }
            program.state = (coef > 100) ? 100 + "%" : coef + "%";
            if (sumParValue > sumMinNorm) {
                program.status = statuses[0]; //success
                //Math.random() * 10;
            } else if (sumParValue / sumMinNorm < -0.5 * sumMinNorm / 3) { //todo
                program.status = statuses[1]; //warning

            } else {
                program.status = statuses[2]; //danger
            }
            tryApply();
            


        });
        
            $scope.programs[0].state = '100%'
            $scope.programs[0].status = statuses[0];
        
            $scope.programs[1].state = 40 + Math.random() * 10 + '%'
            $scope.programs[1].status = statuses[1];
        
            $scope.programs[2].state = Math.random() * 15 + '%'
            $scope.programs[2].status = statuses[2];
        
            $scope.programs[3].state = 75 + Math.random() * 25 + '%'
            $scope.programs[3].status = statuses[0];


    }

    function setCanvas(program, index) {

        var norm = [];
        angular.forEach($scope.graphFunctions, function (funcItem) {
            angular.forEach(funcItem.MarksFunc, function (markItem, index) {
                if (funcItem.ParamsName[index] == $scope.functionForIndicators) {
                    norm = funcItem.MinMarks[index]
                }
            })
        })
        //console.log(norm, program.params, $scope.functionForIndicators)

        //        //var norm =[100000, 30000, 30000];
        //        program.params.forEach(function(param, index_) {
        //            //console.log(Math.max(param.value, norm[index_]));
        //            maxes_.push(Math.max(param.value, norm[index_]));
        //        })
        var facts = program.params.map(function (item) {
            return item.value;
        })
        var dataSets = normalise(norm, facts);
        var legends = [];
        //console.log(program.params)
        try {
            legends = [program.params[0]['key'], program.params[1]['key'], program.params[2]['key']]
        } catch (ex) {
            legends = ['test']
        }


        var dataset = [{
            label: "Фактически",
            backgroundColor: "rgba(255,0,0,0.2)",
            data: dataSets.dataFact
        }, {
            label: 'Минимум',
            backgroundColor: "rgba(0,0,255,0.2)",
            data: dataSets.dataNormal
        }];
        //console.log(dataset);
        setTimeout(function () {
            drawRadar(index, dataset, legends);
        }, 1500);
    }

    $scope.setCanvas = function (program_, index) {
        setCanvas(program_, index);
    }

    function tryApply() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function getStudentsCompleated() {
        //todo придумать тут что то
        return Math.random() * 10;
    }

    /**
     * Проверяем, что студент хотя бы что-то делал по модулю
     * @param studentModule - модуль, на который записан студент
     * @returns {boolean}
     */
    function getPointsForAllModuleTasksForStudent(studentModule) {
        var commonPointsForModule = 0;
        angular.forEach(studentModule.Tasks, function (task) {
            commonPointsForModule += task.MarkForAnswer;
        });

        return commonPointsForModule;
    }

    /**
     * Высчитываем показатель освоения программы
     * @param programId - id программы
     * @param program - объект программы
     * @returns {number}
     */
    function getNumberOfModulesSuccessful(programId, program) {
        var countSuccessModules = 0;
        var countUsableModules = 0;

        // Пробегаемся по модулям в программе
        angular.forEach(program.Modules, function (module) {
            var minSuccessCost = module.MinCost;

            // Пробегаемся по всем студентам, которые учатся по программе
            angular.forEach(students, function (student) {
                if (student.ProgramId === programId) {

                    // Пробегаемся по всем модулям студента
                    angular.forEach(student.Modules, function (studentModule) {
                        var pointsOverall = getPointsForAllModuleTasksForStudent(studentModule);

                        if (pointsOverall > 0) {
                            countUsableModules++;
                        }

                        if (pointsOverall >= minSuccessCost) {
                            countSuccessModules++;
                        }
                    })
                }
            });
        });
        if (countSuccessModules == 0 || countUsableModules) return 0;
        console.log(countSuccessModules / countUsableModules);
        return countSuccessModules / countUsableModules;
    };

    $scope.lookProgram = function (program) {
        localStorage.setItem('program', JSON.stringify(program));
        $location.path('program');
    }

    var tmp = [];

    function drawRadar(index, dataset, label) {
        // $('#chart' + index).remove(); // this is my <canvas> element
        // $('#grphContainer').append('<canvas id=\"chart' + index +'\" style=\"max-width: 600px; max-height: 600px\"><canvas>');
        var ctx = document.getElementById('chart' + index);
        var radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: label,
                datasets: dataset
            }
        });
        tmp.push(radar);

    };

    function drawCanvas() {

        angular.forEach($scope.programs, function (program, index) {
            //console.log("Draw program:", program)
            setCanvas(program, index);
        })
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