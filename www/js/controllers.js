angular.module('starter.controllers', [])

.factory('myTrips', function($rootScope) {
    console.log(myTrips);
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
    console.log("initiated");
    }
    

    return myTrips;
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, accountService) {
  // Form data for the login modal
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


  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.signin_modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
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
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
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

.controller('mytripCtrl', function($scope, myTrips) {
  $scope.items = myTrips;
})
.controller('tripCtrl', function($scope) {
  $scope.showSearchBar = false;
  $scope.search = function() {
    $scope.showSearchBar = true;
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
    $location.path("app/mytrip");
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
