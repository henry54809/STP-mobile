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
.controller('placeFinderCtrl', function($scope,$location) {
  var mapOptions = {
    zoom: 8,
    
  };

  var markers = [];
  if (!$scope.map){
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  }

  var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-33.8902, 151.1759),
      new google.maps.LatLng(-33.8474, 151.2631));
  $scope.map.fitBounds(defaultBounds);

  $scope.input = (document.getElementById('searchbox'));
  // console.log(input);
  // $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  $scope.searchBox = new google.maps.places.SearchBox(($scope.input));

  
  var service = new google.maps.places.PlacesService($scope.map);



   google.maps.event.addListener($scope.searchBox, 'places_changed', function() {
    var places = $scope.searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: $scope.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);

      var request = {
        placeId: place.place_id
      };
      google.maps.event.addListener(marker, 'click', function(innerRequest,innerMarker) {
        return function(){

        var infowindow = new google.maps.InfoWindow();
        service.getDetails(innerRequest, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              infowindow.setContent(place.name);
              infowindow.open($scope.map, innerMarker);
         }
        });
        }
      }(request,marker));
    }
    $scope.map.fitBounds(bounds);
  });

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
