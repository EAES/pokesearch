!function(){"use strict";var e=angular.module("pokesearch",[]);e.filter("capitalize",function(){return function(e){return null!==e?(e=e.toLowerCase(),e.substring(0,1).toUpperCase()+e.substring(1)):void 0}}),e.filter("numLength",function(){return function(e,n){var r=parseInt(e,10);if(n=parseInt(n,10),isNaN(r)||isNaN(n))return e;for(r=""+r;r.length<n;)r="0"+r;return r}}),e.directive("errSrc",function(){return{link:function(e,n,r){n.bind("error",function(){r.src!==r.errSrc&&r.$set("src",r.errSrc)})}}}),e.controller("MainController",["$scope","$http",function(e,n){function r(){e.pokemonEvoChain="",e.serviceError="",n.get("http://pokeapi.co/api/v2/pokemon-species/"+e.search+"/").then(function(r){e.pokemonSpecies=r.data,n.get(e.pokemonSpecies.evolution_chain.url).then(function(n){var r=[],t=n.data.chain;e.pokemonEvoDump=t;do{var o=t.evolution_details[0];r.push({species_name:t.species.name,species_url:t.species.url,min_level:o?o.min_level:1,trigger_name:o?o.trigger.name:null,item:o?o.item:null,held_item:o?o.held_item:null,overworld_rain:o?o.needs_overworld_rain:null,happiness:o?o.min_happiness:null}),t=t.evolves_to[0]}while(t&&t.hasOwnProperty("evolves_to"));e.pokemonEvoChain=r})}),e.pokemon="",n.get("http://pokeapi.co/api/v2/pokemon/"+e.search+"/").then(function(r){e.pokemon=r.data,e.serviceError="",n.get("assets/typeweakness.json").then(function(n){function r(e){for(var n=0;n<t.length;n++)e.toUpperCase()===t[n].name.toUpperCase()&&(a[n]={},a[n].name=t[n].name,a[n].immunes=t[n].immunes,a[n].weaknesses=t[n].weaknesses,a[n].strengths=t[n].strengths)}var t=n.data,o=[];for(var s in e.pokemon.types)e.pokemon.types.hasOwnProperty(s)&&o.push(e.pokemon.types[s].type.name);var a={};e.typeEffectiveness=a;for(var i=0;i<o.length;i++)r(o[i])})},function(n){404===n.status?e.serviceError="Sorry, could not find pokemon you requested.":504===n.status?e.serviceError="Sorry, service is currently not available. Please check back later.":200!==n.status&&(e.serviceError="Unknown error, please try again later.")})}e.$watch("search",function(){""===e.search?e.details="No results.":(e.search=e.search.toLowerCase(),r())}),e.search="Bulbasaur",e.getPokemonIdFromUrl=function(e){return e=e.slice(0,-1),e=e.substring(e.lastIndexOf("/")+1)},e.changePokemon=function(n){e.search=n},e.select=function(){this.setSelectionRange(0,this.value.length)}}])}();