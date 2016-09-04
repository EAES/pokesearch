angular
	.module('pokesearch')

	.controller('HomeController', ['$scope', '$http', function($scope, $http){

	//set default search param to first pokemon in pokedex order
	$scope.search = "bulbasaur";
 
	//typeahead search
	$http.get("assets/pokemon_names.json").then(function(response){
		$scope.predictpokemon  = response.data;
	});

	$scope.fetch = function(){

		$scope.pokemonEvoChain = '';
		$scope.serviceError = '';
		$scope.pokemon = "";

		//cature evo chain
		$http.get("http://pokeapi.co/api/v2/pokemon-species/"+$scope.search.toLowerCase()+"/").then(function(response){
			
			$scope.pokemonSpecies = response.data;
			
			$http.get($scope.pokemonSpecies.evolution_chain.url).then(function(response){
				
				//thanks Ryan @ stackoverflow && /u/Geldan @ /r/Javascript!
				var evoChain = [];
				var evoData = response.data.chain;
				

				function buildEvoChain(evoLink){
					evoChain.push({
						"species_name" : evoLink.species.name,
						"species_url": evoLink.species.url,
						"details": evoLink.evolution_details[0]
					});

					if(evoLink.hasOwnProperty('evolves_to')){
						evoLink.evolves_to.forEach(buildEvoChain);
					}
				}

				buildEvoChain(evoData);
				
				$scope.pokemonEvoChain = evoChain;

			});
		});

		//get basic pokemon data
		$http.get("http://pokeapi.co/api/v2/pokemon/"+$scope.search.toLowerCase()+"/").then(function(response){
			
			$scope.pokemon = response.data;
			$scope.serviceError = '';

			//get weaknesses after fetching pokemon data
			$http.get("assets/typeweakness.json").then(function(response){

				var typeWeakness = response.data;
				var pokemonTypes = [];

				for(var type in $scope.pokemon.types){
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
						if(type.toUpperCase() === typeWeakness[i].name.toUpperCase()){
							currPokeWeaknesses[i] = {};
							currPokeWeaknesses[i].name = typeWeakness[i].name;
							currPokeWeaknesses[i].immunes = typeWeakness[i].immunes;
							currPokeWeaknesses[i].weaknesses = typeWeakness[i].weaknesses;
							currPokeWeaknesses[i].strengths = typeWeakness[i].strengths;
						}
					}
				}

				//get weakness for each current pokemon type
				for(var i=0; i < pokemonTypes.length; i++){
					captureWeaknesses(pokemonTypes[i]);
				}
			});

		},
		//error handling
		function(response) {
			if(response.status === 404){
				$scope.serviceError = "Sorry, could not find pokemon you requested.";
			} else if(response.status === 504){
				$scope.serviceError = "Sorry, service is currently not available. Please check back later.";
			} else if(response.status !== 200){
				$scope.serviceError = "Unknown error, please try again later.";
			}
		}

		);
	};

	//initial search on first load
	$scope.fetch($scope.search);

	$scope.getPokemonIdFromUrl = function(url){
		url = url.slice(0, -1);
		url = url.substring(url.lastIndexOf('/')+1);
		return url;
	};

	$scope.changePokemon = function(newSearch){
		$scope.search = newSearch;
		$scope.fetch(newSearch);
	};

	//select all when clicking inside text input box
	$scope.select = function(){
		this.setSelectionRange(0, this.value.length);
	};

}]);
