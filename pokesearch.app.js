var app = angular.module('pokesearch', [])

app.controller('MainController', ['$scope', '$http', function($scope, $http){
	$scope.$watch('search', function(){
		if($scope.search === ""){
			$scope.details = "No results.";
		} else {
			fetch();
		}
	})

	//set default search param to first pokemon in pokedex order
	$scope.search = "bulbasaur";

	function fetch(){
		//get basic pokemon data
		$http.get("http://pokeapi.co/api/v2/pokemon/"+$scope.search+"/").then(function(response){
			$scope.details = response.data;

			//get weaknesses after fetching pokemon data
			$http.get("assets/typeweakness.json").then(function(response){

				var typeWeakness = response.data;
				var pokemonTypes = [];

				for(type in $scope.details.types){
					if ($scope.details.types.hasOwnProperty(type)) {
						pokemonTypes.push($scope.details.types[type].type.name);
					}
					
				}

				//create new weaknesses object
				var currPokeWeaknesses = {};
				$scope.typeEffectiveness = currPokeWeaknesses;

				//create nested object with name, immunes, weaks, and strs
				function captureWeaknesses(type){
					for(var i=0; i < typeWeakness.length; i++){
						if(type.toUpperCase() == typeWeakness[i].name.toUpperCase()){
							currPokeWeaknesses[i] = {};
							currPokeWeaknesses[i]["name"] = typeWeakness[i].name;
							currPokeWeaknesses[i]["immunes"] = typeWeakness[i].immunes.join(', ');
							currPokeWeaknesses[i]["weaknesses"] = typeWeakness[i].weaknesses.join(', ');
							currPokeWeaknesses[i]["strengths"] = typeWeakness[i].strengths.join(', ');
						}
					}
				}

				//get weakness for each current pokemon type
				for(var i=0; i < pokemonTypes.length; i++){
					captureWeaknesses(pokemonTypes[i]);
				}
			});

		});
	}

	//select all when clicking inside text input box
	$scope.select = function(){
		this.setSelectionRange(0, this.value.length);
	}
}])