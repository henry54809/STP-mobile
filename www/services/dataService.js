stp.service('dataService',['$http', function ($http) {
	this.signup = function(data) {
	    return $http({
	        method: 'POST',
	        url:'/php/registration/signup.php',
	        data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).then(function(response, status, headers, config) {
	        return response.data;
	    });
	};

	this.login = function(data) {
	    return $http({
	        method: 'POST',
	        url:'/php/login.php',
	        data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).then(function(response, status, headers, config) {
	        return response.data;
	    });
	};
}]);