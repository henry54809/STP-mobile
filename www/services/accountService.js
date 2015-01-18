
starter.service('accountService',['$location','$http','$window', function ($location, $http, $window ) {


  var loggedInCallbacks = [];


  
  //register an observer
  this.registerLoggedInCallback = function(callback){
    loggedInCallbacks.push(callback);
  };


  this.notifyLoggedInObservers = function(status){
    this.loggedStatus =  status;
    angular.forEach(loggedInCallbacks, function(callback){
        callback(status);
    });
  };
  
  this.getLogInState = function(){
    return this.loggedStatus;
  }
  this.logOut = function(){
    $cookieStore.remove('uid');
    $cookieStore.remove('sid');
    $cookieStore.remove('uname');
    this.notifyLoggedInObservers(false);
  }


  var that = this;
  this.logIn = function(user){
    console.log("accountService called")
     $http.post('./php/login.php', user,null)
      .success(function (data, status, headers, config)
        { 
          // console.log(data);
          if (typeof data['isvalid'] == 'undefined') {
            $window.alert('验证失败')
            // errorCode = 1;
          } else {
            if (data['isvalid'] == true) {
                // console.log(data['entity_pk']['entity']);
                // console.log($cookies.uid);
                that.notifyLoggedInObservers(true);
                $location.path("/home/"+data['entity_pk']['entity']); //should route to user's homepage. code here used for test
            } else {
                $window.alert('用户名或密码错误');
                // errorCode = 2;
            }
          }
        })
        .error(function (data, status, headers, config)
        {
                $window.alert('Something went wrong...');
                //errorCode = 3;
        });
  }

}]);
