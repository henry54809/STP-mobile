angular.module('stp.controllers', [])

.factory('myTrips', function($rootScope) {
    if (myTrips == undefined) {
      var myTrips = [
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

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $http, accountService) {
  accountService.registerLoggedInCallback(function(userInfo,status){
    $scope.loggedIn = status;
    $scope.userInfo = userInfo;
  })

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    id: 1,
    $scope.signin_modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    id: 2,
    $scope.signup_modal = modal;
  });

  $scope.logOut = function() {
    $http.post('http://picwo.com:3100/api/auth?logout=true',{},{withCredentials: true}).
    success(function(data, status, headers, config) {
      $scope.loggedIn = false;
      accountService.logOut()
      console.log(data, status);
    }).
    error(function(data, status, headers, config){
      console.log(data, status);
    })
  }
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.signin_modal.hide();
  };

  // Open the login modal
  $scope.showLogin = function() {
    $scope.signin_modal.show();
  };

  $scope.signup = function() {
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
    accountService.login($scope.loginData, function(userInfo,loggedIn){
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
.controller('loginCtrl', function($scope){

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

.controller('NewTripCtrl', function($scope, $ionicModal, $timeout, $location, myTrips) {
  // Form data for the login modal
  $scope.myTripsData = {};



  // Perform the login action when the user submits the login form
  $scope.doAdd = function() {
    console.log('Doing add', $scope.myTripsData);
    myTrips.push({title: $scope.myTripsData.title, description: $scope.myTripsData.description, img: ""});
    console.log(myTrips[myTrips.length - 1]);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

  $scope.getItinernaryId = function() {
    return 1;
  }

  $location.path("app/itinerary/"+$scope.getItinernaryId());
  };
})
.controller('itineraryCtrl', function($scope,$stateParams,$location) {
  $scope.items = [
    { title: "Ameristar Casinos", description:"3773 Howard Hughes Parkway Las Vegas, NV 89169", img: "assets/pic13.jpg"},
    { title: "Death Valley National Park", description:"Death Valley National Park, Inyo County, CA", img: "assets/pic13.jpg"},
    { title: "Ameristar Casinos", description:"3773 Howard Hughes Parkway Las Vegas, NV 89169", img: "assets/pic13.jpg"},
    { title: "Death Valley National Park", description:"Death Valley National Park, Inyo County, CA", img: "assets/pic13.jpg"}
  ];
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;

  
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
    $location.path("app/placefinder/1");
  }

})

.controller('friendsCtrl', function($scope,$location) {
  $scope.friends = [
    { name: 'Reggae', id: 1, face: "assets/pic1.jpg"},
    { name: 'Chill', id: 2, face: "assets/pic2.jpg" },
    { name: 'Dubstep', id: 3, face: "assets/pic3.jpg" },
    { name: 'Indie', id: 4, face: "assets/pic4.jpg" },
    { name: 'Rap', id: 5, face: "assets/pic5.jpg" },
    { name: 'Cowbell', id: 6, face: "assets/pic6.jpg" }
  ];

  $scope.addFriend = function() {
    $location.path('app/addFriend');
  }
})


.controller('addFriendCtrl', function($scope,$stateParams) {
    $scope.friends = [
    { name: 'Reggae', id: 1, face: "assets/pic1.jpg", img: "assets/pic13.jpg"},
    { name: 'Chill', id: 2, face: "assets/pic2.jpg", img: "assets/pic13.jpg" },
    { name: 'Dubstep', id: 3, face: "assets/pic3.jpg", img: "assets/pic13.jpg" },
    { name: 'Indie', id: 4, face: "assets/pic4.jpg", img: "assets/pic13.jpg" },
    { name: 'Rap', id: 5, face: "assets/pic5.jpg" , img: "assets/pic13.jpg"},
    { name: 'Cowbell', id: 6, face: "assets/pic6.jpg", img: "assets/pic13.jpg" }
  ];

    $scope.sendRequest = function(friend) {
      alert("test request!");
      $scope.isDisable = true;
    }
})



.controller('PlaylistCtrl', function($scope, $stateParams) {
});
