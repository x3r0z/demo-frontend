'use strict';

angular.module('appDemo', [
    'ngRoute',
    'appDemo.table'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/table'});
}]);