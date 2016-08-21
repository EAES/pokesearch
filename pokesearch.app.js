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

				var typeWeakness = response.data;
				var pokemonTypes = [];

				for(type in $scope.details.types){
					if ($scope.details.types.hasOwnProperty(type)) {
						pokemonTypes.push($scope.details.types[type].type.name);
					}
					
				}

				function captureWeaknesses(type){
					for(var i=0; i < typeWeakness.length; i++){
						if(type.toUpperCase() == typeWeakness[i].name.toUpperCase()){
							console.log(type);
							console.log(typeWeakness[i].immunes);
							console.log(typeWeakness[i].weaknesses);
							console.log(typeWeakness[i].strengths);
						}
					}
				}

				for(var i=0; i < pokemonTypes.length; i++){
					captureWeaknesses(pokemonTypes[i]);
				}
				//return immunes, weaknesses, and strengths from weakness list
			});

		});
	}

	$scope.select = function(){
		this.setSelectionRange(0, this.value.length);
	}
}])