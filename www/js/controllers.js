angular.module('stp.controllers', [])

.factory('myTrips', function($rootScope) {
    if (myTrips == undefined) {
      var myTrips = [
    {
      title:"blank trip" , 
      description:"no date",
      // img: "assets/pic13.jpg"
    }, 
    {
      title:"My trip to HK" , 
      description:"Start at Jan",
      img: "assets/pic13.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    },
    {
      title:"My trip to Japan" , 
      description:"Start at Feb",
      img: "assets/pic10.jpg"
    }
  ];
    }
    

    return myTrips;
})


// .controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $http, accountService, iteneraryService) {
//   $scope.loggedIn = false;
  // Form data for the login modal

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $http,$ionicSideMenuDelegate, accountService) {
  accountService.registerLoggedInCallback(function(userInfo,status){
    $scope.loggedIn = status;
    $scope.userInfo = userInfo;
  })


  $scope.loginData = {};
  $scope.signupData = {};
$ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    id: 2,
    $scope.signup_modal = modal;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    id: 1,
    $scope.signin_modal = modal;
  });

  

  $scope.doSignup = function() {
    // console.log($event);
    console.log('Doing signup', $scope.signupData);
    if($scope.signupData.password == $scope.signupData.password_repeat){
      accountService.signup($scope.signupData, function(success, data){
        if (success){
            $scope.userInfo = data;
            $scope.loggedIn = true;
            $scope.signup_modal.hide();
        } else {
           console.log('something went wrong:',data);
        }
      })
    }
  }

  $scope.logOut = function() {
    accountService.logOut();
    $scope.loggedIn = false;
    $location.path('app/home');
    $ionicSideMenuDelegate.toggleLeft();
  }
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.signin_modal.hide();
  };

  // Open the login modal
  $scope.showLogin = function() {
    $scope.signin_modal.show();
  };

  $scope.showSignup = function() {
    $scope.signin_modal.hide()
    console.log("redirect to signup");
    $scope.signup_modal.show();

  }

  $scope.closeSignup = function() {
    console.log("calling close Signup")
    $scope.signup_modal.hide();
  }


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    accountService.login($scope.loginData, function(loggedIn, userInfo){
        $scope.userInfo = userInfo;
        $scope.loggedIn = loggedIn;
        if ($scope.loggedIn){
          $scope.signin_modal.hide();
        } else {
          console.log("Failed!")
        }
        console.log($scope.userInfo);
    })
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('friendtripCtrl', function($scope,myTrips){
  $scope.items = myTrips;
  // $scope.$on('showHeader',function(arg){
  //   $scope.showHeader=arg;
  //   $scope.apply();
  //   
  // });
$scope.hideSearch = function() {
    $scope.showHeader = false;
    console.log("hide!")
  };
  
})
.controller('mytripCtrl', function($scope, myTrips,$filter) {
  $scope.items = myTrips;
})
.controller('tripCtrl', function($scope) {
  $scope.showHeader = false;
  $scope.toggleSearch = function() {
    $scope.showHeader = !$scope.showHeader;

    // $scope.$broadcast('showHeader', $scope.showHeader);
  };

  $scope.cancelSearch = function() {
    $scope.searchQuery= undefined;
    $scope.showHeader = false;
  };
})


.controller('NewTripCtrl', function($scope, $ionicModal, $timeout, $http, $location) {

  // Form data for the login modal
  // $http.get('http://picwo.com:3100/api/account', {withCredentials: true}).
  // success(function (data, status, headers, config) {
  //   $scope.myTripsData.tripId = data.trip;

  //   $http.post('http://picwo.com:3100/api/account', $scope.myTripsData).
  //   success(function(data, status, headers, config){
  //     $scope.itinernaryId = data.itinernaryId;
  //   })
  // }).
  // error(function(data, status, headers, config) {
  //   $scope.itinernaryId = 1;
  // })
  
  $scope.save = function(myTripsData) {
    console.log(myTripsData.title);
    $http.post('http://picwo.com:3100/api/trip', $scope.myTripsData).
    success(function(data, status, headers, config){
      $scope.tripId = data.trip;
    })

  };

  $scope.addItinerary = function(tripId) {
    $http.post('http://picwo.com:3100/api/trip/itinerary', $scope.tripId).
    success(function(data, status, headers, config){
      $scope.itineraryId = data.itinerary;
    })
    .error(function(data, status, headers, config) {
      console.log("fail to call server");
    })
    // $location.path('app/itinerary/' + $scope.itineraryId);
    $location.path('app/itinerary/1');
  }


})


.controller('itineraryCtrl', function($scope,$stateParams,$location) {
  $scope.items = [];
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  // $scope.todo = todo;
  
  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
  };
  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };

  $scope.getDuration = function(startDate, endDate) {
    var dur = endDate - startDate;
    dur = parseInt(dur / 86400000, 10) + 1;
    $scope.duration = dur;
    for (i = 1; i <= dur; i++) {
      $scope.items.push({data: "Day" + i, isDay: true});
      $scope.items.push({data: "Add activity", isDay: false});
    }
    
  };

  $scope.addActivity = function(item) {
    if (item.data == "Add activity") {
      alert("asf");
    }
    
  }
  
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  $scope.toggleDelete = function() {
    $scope.shouldShowReorder = false;
    $scope.shouldShowDelete = !$scope.shouldShowDelete;
  }
  $scope.toggleReorder = function() {
    $scope.shouldShowDelete = false ;
    $scope.shouldShowReorder = !$scope.shouldShowReorder;
  }
  $scope.addItinerary = function() {
    $location.path("app/newtrip");
  }



  $scope.fileHandler = function($event){

    var files = $event.target.files; // FileList object
    console.log(files);
    console.log($scope.file);
  }

})
.controller('chatroomCtrl', function($scope, $stateParams,$ionicScrollDelegate, accountService){
  var fb = new Firebase('https://picwochat.firebaseio.com/'+$stateParams.chartroomId)
  console.log(fb);
  var postsRef = fb.child("messages");
  // $ionicScrollDelegate.scrollBottom(true);
  $scope.sendMsg = function(){
    // postsRef = fb.child("messages");
    if (accountService.userInfo.username == undefined){
      alert('please login first')
      return false;
    }
    postsRef.push({
      author: accountService.userInfo.username,
      content: $scope.message
    }, function(error){
      console.log(error);
    });
   
    $scope.message = "";
  };
  // postsRef.once("value", function(snapshot){
  //   console.log(snapshot.val());
  // });
  $scope.messages = [];
  postsRef.on("child_added", function(snapshot){
    // console.log(snapshot.val());
    $scope.messages.push(snapshot.val());
    $ionicScrollDelegate.scrollBottom(true);
  })

  $scope.scrollBottom =  function(){
    $ionicScrollDelegate.scrollBottom(true);
    // console.log('scrol');
  }
  



})

.controller('friendsCtrl', function($scope,$location,$http) {
  $scope.friends = [];
  $http.get('http://picwo.com:3100/api/user/friends',{withCredentials: true}).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log(data);
    if (data.length == undefined) {
      $scope.friends.push(data);
    } else {
      $scope.friends = data;
    }
    console.log($scope.friends);
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returnns response with an error status.
    console.log(data);
  });
  
  if (!$scope.friends) {
    $scope.friends = [
    { username: 'Reggae', avatar_url: "assets/pic1.jpg"},
    { username: 'Chill', avatar_url: "assets/pic2.jpg" },
    { username: 'Dubstep', avatar_url: "assets/pic3.jpg" },
    { username: 'Indie', avatar_url: "assets/pic4.jpg" },
    { username: 'Rap', avatar_url: "assets/pic5.jpg" },
    { username: 'Cowbell', avatar_url: "assets/pic6.jpg" }
  ];
    console.log($scope.friends);
  }
  

  $scope.friendReqs = [
    { username: 'Reggae Bro', avatar_url: "assets/pic1.jpg"},
    { username: 'Cowbell Bro', avatar_url: "assets/pic6.jpg" }
  ];

  $scope.addFriend = function() {
    $location.path('app/addFriend');
  }

  $scope.acceptRequest = function(friend) {
    $http.post('http://m.picwo.com/api/user/1?accept',{},{withCredentials: true}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
        alert("test accept!");
        $scope.friendReqs.splice($scope.friendReqs.indexOf(friend), 1);
        $scope.isDisable = true;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("fail!");
        console.log(data);
      });
  }

  $scope.declineRequest = function(friend) {
    $scope.sendRequest = function(friend) {
      $http.post('http://m.picwo.com/api/user/1?decline',{},{withCredentials: true}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
        alert("test dc!");
    $scope.friendReqs.splice($scope.friendReqs.indexOf(friend), 1);
    $scope.isDisable = true;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("fail!");
        console.log(data);
      });
    }

  }
})


.controller('addFriendCtrl', function($scope,$stateParams,$http) {
    $scope.friends = [
    { username: 'Reggae', avatar_url: "assets/pic1.jpg"},
    { username: 'Chill', avatar_url: "assets/pic2.jpg" },
    { username: 'Dubstep', avatar_url: "assets/pic3.jpg" },
    { username: 'Indie', avatar_url: "assets/pic4.jpg" },
    { username: 'Rap', avatar_url: "assets/pic5.jpg" },
    { username: 'Cowbell', avatar_url: "assets/pic6.jpg" }
  ];

    $scope.sendRequest = function(friend) {
      $http.post('http://picwo.com:3100/api/user/1?action=add',{},{withCredentials: true}).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
        alert("test request!");
       $scope.isDisable = true;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("fail!");
        console.log(data);
      });
    }
})



.controller('PlaylistCtrl', function($scope, $stateParams) {
});
