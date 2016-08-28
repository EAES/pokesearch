!function(){"use strict";var e=angular.module("pokesearch",["ui.bootstrap"]);e.filter("dehyphen",function(){return function(e){return null!==e?e.replace(/-/g," "):void 0}}),e.filter("capitalize",function(){return function(e){return null!==e?(e=e.toLowerCase(),e.substring(0,1).toUpperCase()+e.substring(1)):void 0}}),e.filter("numLength",function(){return function(e,n){var r=parseInt(e,10);if(n=parseInt(n,10),isNaN(r)||isNaN(n))return e;for(r=""+r;r.length<n;)r="0"+r;return r}}),e.directive("errSrc",function(){return{link:function(e,n,r){n.bind("error",function(){r.src!==r.errSrc&&r.$set("src",r.errSrc)})}}}),e.controller("MainController",["$scope","$http",function(e,n){e.search="bulbasaur",n.get("assets/pokemon_names.json").then(function(n){e.predictpokemon=n.data}),e.fetch=function(){e.pokemonEvoChain="",e.serviceError="",e.pokemon="",n.get("http://pokeapi.co/api/v2/pokemon-species/"+e.search.toLowerCase()+"/").then(function(r){e.pokemonSpecies=r.data,n.get(e.pokemonSpecies.evolution_chain.url).then(function(n){var r=[],t=n.data.chain;e.pokemonEvoDump=t;do{var o=t.evolution_details[0];r.push({species_name:t.species.name,species_url:t.species.url,min_level:o?o.min_level:1,trigger_name:o?o.trigger.name:null,item:o?o.item:null,held_item:o?o.held_item:null,overworld_rain:o?o.needs_overworld_rain:null,happiness:o?o.min_happiness:null}),t=t.evolves_to[0]}while(t&&t.hasOwnProperty("evolves_to"));e.pokemonEvoChain=r})}),n.get("http://pokeapi.co/api/v2/pokemon/"+e.search.toLowerCase()+"/").then(function(r){e.pokemon=r.data,e.serviceError="",n.get("assets/typeweakness.json").then(function(n){function r(e){for(var n=0;n<t.length;n++)e.toUpperCase()===t[n].name.toUpperCase()&&(i[n]={},i[n].name=t[n].name,i[n].immunes=t[n].immunes,i[n].weaknesses=t[n].weaknesses,i[n].strengths=t[n].strengths)}var t=n.data,o=[];for(var s in e.pokemon.types)e.pokemon.types.hasOwnProperty(s)&&o.push(e.pokemon.types[s].type.name);var i={};e.typeEffectiveness=i;for(var a=0;a<o.length;a++)r(o[a])})},function(n){404===n.status?e.serviceError="Sorry, could not find pokemon you requested.":504===n.status?e.serviceError="Sorry, service is currently not available. Please check back later.":200!==n.status&&(e.serviceError="Unknown error, please try again later.")})},e.fetch(e.search),e.getPokemonIdFromUrl=function(e){return e=e.slice(0,-1),e=e.substring(e.lastIndexOf("/")+1)},e.changePokemon=function(n){e.search=n,e.fetch(n)},e.select=function(){this.setSelectionRange(0,this.value.length)}}])}();