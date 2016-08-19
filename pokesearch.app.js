var app = angular.module('pokesearch', [])

app.controller('MainController', ['$scope', function($scope){
	$scope.pokemon = "BULBASAUR!";
}])