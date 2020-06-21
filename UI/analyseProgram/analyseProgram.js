'use strict';

var analyseProgram = angular.module('myApp.analyseProgram', ['ngRoute']);

analyseProgram.controller('AnalyseProgCtrl', function ($scope, analyseService, $q) {
    
    $scope.compare = function(){
        compare();
    };
    
    function compare() {
        if ($scope.urlForComparison){
            var url = {
                'url': $scope.urlForComparison
            };

            $scope.isLoading = true;
            analyseService.compareTo(url).then(function (response) {
                if (!response) {
                    alert('На нашем сервере возникли временные неполадки. Уже исправляем ');
                }

                $scope.isLoading = false;
                var similar = parseFloat(response) * 100;
                var differ = 100 - similar;

                var ctx = document.getElementById('compareResult');
                var pie = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Различия', 'Совпадения'],
                        datasets: [{
                            data: [differ.toFixed(2), similar.toFixed(2)],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });
            });
        } else {
            alert("bad url")
        }
        
    }
});