starter.service('translateService',['$http', function ($http) {
	this.translate = function(data) {
	    // return $http({
	    //     method: 'POST',
	    //     url:'/php/registration/signup.php',
	    //     data: $.param(data),
     	//     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    // }).then(function(response, status, headers, config) {
	    //     return response.data;
	    // });
	    return data;
	};
}]);