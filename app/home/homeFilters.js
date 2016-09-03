
angular
	.module('pokesearch')

	//dehyphen filter
	.filter('dehyphen', function() {
	  return function(input) {
	    if (input!==null){
	    	// input = input.toLowerCase();
		    return input.replace(/-/g, " ");
	    }
	  };
	})

	//capitilize filter
	.filter('capitalize', function() {
	  return function(input) {
	    if (input!==null){
	    	input = input.toLowerCase();
		    return input.substring(0,1).toUpperCase()+input.substring(1);
	    }
	  };
	})

	//fixed number length filter
	.filter('numLength', function() {
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