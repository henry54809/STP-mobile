
stp.service('friendService',['$location','$http','$window', function ($location, $http, $window ) {

  this.searchFriend = function(searchText, callback){
    var that = this;
    $http.get('http://picwo.com:3100/api/user/?search='+searchText,{withCredentials: true}).
    success(function(data, status, headers, config){
        if(status =="Error"){
          console.log(data, status);
          callback(false,{});
        } else {
          console.log(data);
          callback(true, data);
        }
        
    }).
    error(function(data, status, headers, config){
      callback({},false);
      console.log(data, status);
    })

  }


}]);
