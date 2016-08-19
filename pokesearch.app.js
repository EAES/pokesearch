var app = angular.module('pokesearch', [])

app.controller('MainController', ['$scope', '$http', function($scope, $http){
	$scope.$watch('search', function(){
		if($scope.search === ""){
			$scope.details = "No results.";
		} else {
			fetch();
		}
	})

	$scope.search = "bulbasaur";

	function fetch(){
		$http.get("http://pokeapi.co/api/v2/pokemon/"+$scope.search+"/").then(function(response){
			$scope.details = response.data;
		});
	}

	$scope.select = function(){
		this.setSelectionRange(0, this.value.length);
	}
}])