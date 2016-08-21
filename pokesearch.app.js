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

			$http.get("assets/typeweakness.json").then(function(response){
				//capture pokemon types
				var pokemonTypes = [];
				for(type in $scope.details.types){
					if ($scope.details.types.hasOwnProperty(type)) {
						pokemonTypes.push($scope.details.types[type].type.name);
					}
					
				}
				console.log(pokemonTypes);
				//search weakness list for each type
				//return immunes, weaknesses, and strengths from weakness list
			});

		});
	}

	$scope.select = function(){
		this.setSelectionRange(0, this.value.length);
	}
}])