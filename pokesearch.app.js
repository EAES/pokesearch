	var app = angular.module('pokesearch', [])

//TODO:
	//show loading on each query instead of just first
		//maybe clear data on fetch
	//figure out eevee edge case
	//show errors on notfound
	//speed up capture of evo chain

//capitilize filter
app.filter('capitalize', function() {
  return function(input, scope) {
    if (input!=null)
    input = input.toLowerCase();
    return input.substring(0,1).toUpperCase()+input.substring(1);
  }
});

//fixed number length filter
app.filter('numLength', function() {
  return function (n, len) {
	var num = parseInt(n, 10);
	len = parseInt(len, 10);
	if (isNaN(num) || isNaN(len)) {
	    return n;
	}
	num = ''+num;
	while (num.length < len) {
	    num = '0'+num;
	}
	return num;
  }
});

app.controller('MainController', ['$scope', '$http', function($scope, $http){
	$scope.$watch('search', function(){
		if($scope.search === ""){
			$scope.details = "No results.";
		} else {
			fetch();
		}
	})

	//set default search param to first pokemon in pokedex order
	$scope.search = "charmander";

	function fetch(){

		//cature evo chain
		$http.get("http://pokeapi.co/api/v2/pokemon-species/"+$scope.search+"/").then(function(response){
			$scope.pokemonSpecies = response.data;
			$http.get($scope.pokemonSpecies.evolution_chain.url).then(function(response){
				
				var evoChain = [];
				var evoData = response.data.chain;

				do {
				  var evoDetails = evoData['evolution_details'][0];

				  evoChain.push({
				    "species_name": evoData.species.name,
				    "min_level": !evoDetails ? 1 : evoDetails.min_level,
				    "trigger_name": !evoDetails ? null : evoDetails.trigger.name,
				    "item": !evoDetails ? null : evoDetails.item
				  });

				  evoData = evoData['evolves_to'][0];
				} while (!!evoData && evoData.hasOwnProperty('evolves_to'));

				$scope.pokemonEvoChain = evoChain;
			});
		});

		//get basic pokemon data
		$http.get("http://pokeapi.co/api/v2/pokemon/"+$scope.search+"/").then(function(response){
			$scope.pokemon = response.data;

			//get weaknesses after fetching pokemon data
			$http.get("assets/typeweakness.json").then(function(response){

				var typeWeakness = response.data;
				var pokemonTypes = [];

				for(type in $scope.pokemon.types){
					if ($scope.pokemon.types.hasOwnProperty(type)) {
						pokemonTypes.push($scope.pokemon.types[type].type.name);
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