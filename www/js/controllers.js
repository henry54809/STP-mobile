angular.module('starter.controllers', [])

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

    // //console.log(1234);
    //     var userName = $scope.loginData.username;
    //     console.log(userName);
    //     var pw = $scope.loginData.password;
    //     if (typeof userName == 'undefined') {
    //         alert("Username is empty");
    //         return
    //     }
    //     if (typeof pw == 'undefined') {
    //         alert("Password is empty");
    //         return
    //     }

    //     accountService.logIn(JSON.stringify($scope.loginData));

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

.controller('mytripCtrl', function($scope) {
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

  $scope.items = [
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
})



.controller('PlaylistCtrl', function($scope, $stateParams) {
});
