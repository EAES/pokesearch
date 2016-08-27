/*global angular:true */
/* exported scope */

//IIFE
(function(){
	"use strict";

	var app = angular.module('pokesearch', []);

	//capitilize filter
	app.filter('capitalize', function() {
	  return function(input) {
	    if (input!==null){
	    	input = input.toLowerCase();
		    return input.substring(0,1).toUpperCase()+input.substring(1);
	    }
	  };
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
	  };
	});

	//display placeholder image if no pokemon sprite found
	app.directive('errSrc', function() {
	  return {
	    link: function(scope, element, attrs) {
	      element.bind('error', function() {
	        if (attrs.src !== attrs.errSrc) {
	          attrs.$set('src', attrs.errSrc);
	        }
	      });
	    }
	  };
	});

	app.controller('MainController', ['$scope', '$http', function($scope, $http){
		$scope.$watch('search', function(){
			if($scope.search === ""){
				$scope.details = "No results.";
			} else {
				$scope.search = $scope.search.toLowerCase();
				fetch();
			}
		});

		//set default search param to first pokemon in pokedex order
		$scope.search = "Bulbasaur";

		function fetch(){

			$scope.pokemonEvoChain = '';
			$scope.serviceError = '';

			//cature evo chain
			$http.get("http://pokeapi.co/api/v2/pokemon-species/"+$scope.search+"/").then(function(response){
				$scope.pokemonSpecies = response.data;
				$http.get($scope.pokemonSpecies.evolution_chain.url).then(function(response){
					
					//thanks Ryan @ stackoverflow!
					var evoChain = [];
					var evoData = response.data.chain;
					$scope.pokemonEvoDump = evoData;

					do {
					  var evoDetails = evoData.evolution_details[0];

					  evoChain.push({
					    "species_name": evoData.species.name,
					    "species_url": evoData.species.url,
					    "min_level": !evoDetails ? 1 : evoDetails.min_level,
					    "trigger_name": !evoDetails ? null : evoDetails.trigger.name,
					    "item": !evoDetails ? null : evoDetails.item,
					    "held_item": !evoDetails ? null : evoDetails.held_item,
					    "overworld_rain": !evoDetails ? null : evoDetails.needs_overworld_rain,
					    "happiness": !evoDetails ? null : evoDetails.min_happiness
					  });

					  evoData = evoData.evolves_to[0];
					} while (!!evoData && evoData.hasOwnProperty('evolves_to'));

					$scope.pokemonEvoChain = evoChain;

				});
			});

			$scope.pokemon = "";

			//get basic pokemon data
			// TODO: don't connect each time, try and fetch main object and cache in localStorage
			$http.get("http://pokeapi.co/api/v2/pokemon/"+$scope.search+"/").then(function(response){
				
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
		}

		$scope.getPokemonIdFromUrl = function(url){
			url = url.slice(0, -1);
			url = url.substring(url.lastIndexOf('/')+1);
			return url;
		};

		$scope.changePokemon = function(newSearch){
			$scope.search = newSearch;
		};

		//select all when clicking inside text input box
		$scope.select = function(){
			this.setSelectionRange(0, this.value.length);
		};

	}]);

//end IIFE	
})();

