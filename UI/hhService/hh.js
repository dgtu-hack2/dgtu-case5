'use strict';

var HhPageCtrl = angular.module('myApp.hhModule', ['ngRoute']);

HhPageCtrl.controller('HhPageCtrl', function ($scope, hhService, $q) {

    $scope.hhSearch = "";
    $scope.searchList = [];
    $scope.getHhDiagram = function () {
        $scope.middleSalary = 0;
        $scope.countVacancies = 0;
        $scope.dispersion = 0;
        $scope.searchList = [];
        if ($scope.hhSearch) {
            $scope.isLoading = true;
            getHhVacancions($scope.hhSearch, 0);  
        } else {
            alert("Bad search value")
        }

    }

    function calcValues(){
         
                $scope.countVacancies = $scope.searchList.length;
                var middleSalary = 0;
                var salaryCount = 0;

                var salaryes = [];
                angular.forEach($scope.searchList, function (item) {
                    if (item.salary) {
                        if (item.salary.from && item.salary.to) {
                            salaryCount++;
                            var salary = (item.salary.to - item.salary.from) / 2;
                            middleSalary += salary;
                            salaryes.push(salary)
                        } else {
                            if (item.salary.from && !item.salary.to) {
                                salaryCount++;
                                middleSalary += item.salary.from;
                                salaryes.push(item.salary.from);
                            }
                        }
                    }
                });
        
                $scope.middleSalary = middleSalary / salaryCount;
                var sSquare = 0;
                angular.forEach(salaryes, function (salary) {
                    sSquare += ((salary - $scope.middleSalary) * (salary - $scope.middleSalary));
                });
         
                $scope.dispersion = Math.sqrt(sSquare / (salaryCount-1));
    }

    function getHhVacancions(search, page) {
        
        hhService.getVacancies(search, page).then(function (data) {
            if (data && data.items) {
                $scope.searchList.push.apply($scope.searchList, data.items);
                if (data.pages-1 > page) {
                    page++;
                    getHhVacancions(search, page);
                } else {
                    $scope.isLoading = false;
                    calcValues();
                   
                }
            }
        } ,function(){
            calcValues();
             $scope.isLoading = false;
             
        });
       
    }

});