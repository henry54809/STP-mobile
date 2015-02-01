
stp.service('accountService',['$location','$http','$window', function ($location, $http, $window ) {
  this.userInfo={};
  var notifyLoggedInObservers = function(data,status){
    this.loginState =  status;
    angular.forEach(loggedInCallbacks, function(callback){
        callback(data,status);
    });
  };
  //register an observer
  this.registerLoggedInCallback = function(callback){
    loggedInCallbacks.push(callback);
  };

  var loggedInCallbacks = [];
  this.loginState = false;

  this.signup = function(signupData,callback) {
    var that = this;
    $http.post('http://picwo.com:3100/api/account',signupData,{withCredentials:true}).
      success(function (data, status, headers, config) {
        that.login(signupData,function(success,userInfo){
          callback(success,userInfo);
        })
        that.loginState = true;
      }).
      error(function (data, status, headers, config) {
        that.loginState = false;
        callback(false,data);
      })
  }
  this.getLogInState = function(){
    return this.loginState;
  }
  this.getAccount = function(callback){
    $http.get('http://picwo.com:3100/api/account',{withCredentials: true}).
      success(function (data, status, headers, config){
        this.userInfo = data;
        callback(true,data);
        console.log(data);
      }).
      error(function(data, status, headers, config){
        this.userInfo = data;
        callback(false,data);
        console.log(data);
      })
  }

  this.getAccount(function(status,data){
      notifyLoggedInObservers(data,status);
  });

  this.login = function(loginData, callback){
    var that = this;
    $http.post('http://picwo.com:3100/api/auth',loginData,{withCredentials: true}).
    success(function(data, status, headers, config){
        if(status =="Error"){
          console.log(data, status);
          callback(false,{});
        } else {
          that.getAccount(function(status,data){
          callback(true, data);
          })
        }
        
    }).
    error(function(data, status, headers, config){
      callback({},false);
      console.log(data, status);
    })

  }
  this.logOut = function(){
    this.loginState = false;
    $http.post('http://picwo.com:3100/api/auth?logout=true',{},{withCredentials: true}).
    success(function(data, status, headers, config) {
      console.log(data, status);
    }).
    error(function(data, status, headers, config){
      console.log(data, status);
    })
  }

}]);
