'use strict';

angular.module('appDemo.table', ['ngRoute','ngTable','ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/table', {
            templateUrl: 'views/table.html',
            controller: 'tableCtrl'
        });
    }])

    .controller('tableCtrl', ['$scope','NgTableParams','$filter','$uibModal','$window',
        function($scope,NgTableParams, $filter,$uibModal,$window) {
            var data = [{
                id:1,
                description:'Flight ticket',
                amount: 300,
                date:new Date(2017,7,12),
                type:{id:1,name:'Leisure'}
            },{
                id:2,
                description:'Medical cover',
                amount: 41,
                date:new Date(2017,7,14),
                type:{id:2,name:'Medical'}
            },{
                id:3,
                description:'Supermarket',
                amount: 89,
                date:new Date(2017,7,13),
                type:{id:3,name:'Food'}
            }];
            var nextID = 4;
            $scope.tableDemo = new NgTableParams({
                page: 1,
                count: 10,
                sorting: {
                    description: 'asc'
                }
            }, {
                total: data.length,
                dataset: data
            });
            var $win = $($window);

            $scope.showModal = function (expense) {
                expense = expense || {id:null};
                var title = 'Add New Expenses';
                if(null !== expense.id) {
                    title = "Edit Expense for: "+expense.description;
                }
                $uibModal.open({
                    templateUrl: './views/modal.html',
                    controller: 'modalCtrl',
                    resolve: {
                        expense: function() {
                            return angular.copy(expense);
                        },
                        title: function () {
                            return title;
                        }
                    }
                }).result.then(function (expense) {
                    if(!_.isUndefined(expense)) {
                        if(null === expense.id){
                            expense.id = nextID;
                            data.push(expense);
                            $scope.tableDemo.reload();
                            nextID++;
                        } else {
                            _.each(data, function (item, index) {
                                if(expense.id === item.id) {
                                    data[index] = expense;
                                }
                            });
                            $scope.tableDemo.reload();
                        }
                    }
                });
            };

            $scope.removeExpense = function (expense) {
                _.each(data, function (item, index) {
                    if(expense.id === item.id) {
                        data.splice(index,1);
                        $scope.tableDemo.reload();
                    }
                });
            };

            $win.on('resize', function () {
                $scope.$apply();
                $scope.tableDemo.reload();
            });

            $scope.viewDetails = function (expense) {
                $uibModal.open({
                    templateUrl: './views/detail.html',
                    controller: 'detailCtrl',
                    resolve: {
                        expense: function() {
                            return expense;
                        }
                    }
                });
            };
    }])

    .controller('modalCtrl', ['$scope', 'expense', 'title', '$uibModalInstance',
        function($scope, expense, title, $uibModalInstance){

            $scope.expense = expense;
            $scope.title = title;
            $scope.types = [{id:1,name:'Leisure'},{id:2,name:'Medical'},{id:3,name:'Food'}];
            $scope.dateFormat = 'dd.MM.yyyy';
            $scope.datepickerOptions = {
                showWeeks: false,
                startingDay: 1
            };
            $scope.opened = false;
            $scope.openDatePicker = function () {
                $scope.opened = !$scope.opened;
            };
            $scope.saveExpense = function () {
                $uibModalInstance.close($scope.expense);
            };
            $scope.close = function () {
                $uibModalInstance.close($scope.expense);
            }
    }])

    .controller('detailCtrl', ['$scope', 'expense',
        function($scope, expense){
            $scope.expense = expense;
    }]);