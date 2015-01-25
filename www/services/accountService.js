
stp.service('accountService',['$location','$http','$window', function ($location, $http, $window ) {
  this.userInfo={};
  var notifyLoggedInObservers = function(data,status){
    this.loggedStatus =  status;
    angular.forEach(loggedInCallbacks, function(callback){
        callback(data,status);
    });
  };
  //register an observer
  this.registerLoggedInCallback = function(callback){
    loggedInCallbacks.push(callback);
  };

  var loggedInCallbacks = [];
  this.loggedStatus = false;

  // $http.get('http://picwo.com:3100/api/account',{withCredentials: true}).
  // success(function(data, status, headers, config){
  //   notifyLoggedInObservers(true);
  //   this.userInfo=data;
  // }).
  // error(function(data, status, headers, config){
  //   notifyLoggedInObservers(false);
  // })
  
  this.getLogInState = function(){
    console.log(this.loggedStatus)
    return this.loggedStatus;
  }
  var getAccount = function(callback){
    $http.get('http://picwo.com:3100/api/account',{withCredentials: true}).
      success(function(data, status, headers, config){
        this.userInfo = data;
        callback(data,true);
        console.log(data);
      }).
      error(function(data, status, headers, config){
        this.userInfo = data;
        callback(data,false);
        console.log(data);
      })
  }

  getAccount(function(data,status){
      notifyLoggedInObservers(data,status);
  });

  this.login = function(loginData, callback){
    $http.post('http://picwo.com:3100/api/auth',loginData,{withCredentials: true}).
    success(function(data, status, headers, config){
        if(status =="Error"){
          console.log(data, status);
          callback({},false);
        } else {
          getAccount(function(data,status){
          callback(data, true);
          })
        }

    }).
    error(function(data, status, headers, config){
      callback({},false);
      console.log(data, status);
    })

  }
  this.logOut = function(){
    this.loggedStatus = false;
  }

}]);
