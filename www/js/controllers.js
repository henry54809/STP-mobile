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
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    //console.log(1234);
        var userName = $scope.loginData.username;
        console.log(userName);
        var pw = $scope.loginData.password;
        if (typeof userName == 'undefined') {
            alert("Username is empty");
            return
        }
        if (typeof pw == 'undefined') {
            alert("Password is empty");
            return
        }

        accountService.logIn(JSON.stringify($scope.loginData));

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
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
  $scope.shouldShowReorder = true;
  $scope.data = {
    showDelete: false
  };
  
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

  $scope.items = myTrips;
})

.controller('NewTripCtrl', function($scope, $ionicModal, $timeout, myTrips) {
  // Form data for the login modal
  $scope.myTripsData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/newTrip.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  }); 

  // Triggered in the login modal to close it
  $scope.closeAdd = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.add = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doAdd = function() {
    console.log('Doing add', $scope.myTripsData);
    myTrips.push({title: $scope.myTripsData.title, description: $scope.myTripsData.description, img: ""});
    console.log(myTrips[myTrips.length - 1]);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeAdd();
    }, 1000);
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
