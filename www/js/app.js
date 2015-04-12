// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var stp = angular.module('stp', [ 'ionic', 'stp.controllers' ,'angularFileUpload'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  // $urlRouterProvider.otherwise('/todos')
  
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.forgotPassword', {
    url: "/forgotPassword",
    views: {
      'menuContent': {
        templateUrl: "templates/forgotPassword.html",
        controller: 'forgotPasswordCtrl'
      }
    }
  })

  .state('app.ResetPassword', {
    url: "/ResetPassword",
    views: {
      'menuContent': {
        templateUrl: "templates/ResetPassword.html",
        controller: "ResetPasswordCtrl"
      }
    }
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
      }
    }
  })
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller:'profileCtrl'
      }
    }
  })
  //country select, could be generic
  .state('app.country', {
    url:'/country',
    views: {
      'menuContent': {
        templateUrl: 'templates/country.html',
        controller: 'countryCtrl'
      }
    }
  })
  .state('app.friends', {
    url: '/friends',
    views: {
      'menuContent': {
        templateUrl: 'templates/friends.html',
        controller: 'friendsCtrl'
      }
    }
  })
  .state('app.addFriend', {
    url: "/addFriend",
    views: {
      'menuContent': {
        templateUrl: "templates/addFriend.html",
        controller: 'addFriendCtrl'
      }
    }
  })
  .state('app.mytrip',{
    resolve:{
      myTrips : function($http){
         return $http({method: 'GET', url: 'http://picwo.com:3100/api/trip/mytrips',withCredentials:true});
      }
    },
    url: "/mytrip",
    views: {
      'menuContent': {
        templateUrl: "templates/mytrip.html",
        controller: 'mytripCtrl'
      }
    }
  })
  .state('app.tripDetail',{
    resolve:{
      myTrip : function($http,$stateParams){
        console.log($stateParams.tripID);
         // return {tripID:$stateParams.tripID} //$http({method: 'GET', url: 'http://picwo.com:3100/api/trip/mytrips',withCredentials:true});
         return $http({method: 'GET', url: 'http://picwo.com:3100/api/trip/' + $stateParams.tripID ,withCredentials:true});
      }
    },
    url: "/tripdetails/:tripID",
    views: {
      'menuContent': {
        templateUrl: "templates/newTrip.html",
        controller: 'NewTripCtrl'
      }
    }
  })

  .state('app.newtrip',{
    resolve:{
      myTrip : function($http,$stateParams){
        return null;
      }
    },
    url: "/newtrip",
    views: {
      'menuContent': {
        templateUrl: "templates/newTrip.html",
        controller: 'NewTripCtrl'
      }
    },
    // resolve: {
    //   todos: function(IteneraryService) {
    //     return 1
    //   }
    // }
  })
  .state('app.itinerary',{
    resolve:{
      itinerary: function(itineraryService){
        console.log("resolve");
        return itineraryService.tempItineray;
      }
    },
    url: "/itinerary/:itineraryID",
    views: {
      'menuContent': {
        templateUrl: "templates/itinerary.html",
        controller: 'itineraryCtrl'
      }
    }
  })
  .state('app.placeFinder',{
    url: "/placefinder/:itineraryID/:dayID",
    views: {
      'menuContent': {
        templateUrl: "templates/placeFinder.html",
        controller: 'placeFinderCtrl'
      }
    }
  })
  .state('app.chatroom', {
    url: "/chatroom/:chatroomId",
    views: {
        'menuContent': {
          templateUrl: "templates/chatroom.html",
          controller: "chatroomCtrl"
        }
    }
  })
  .state('app.comments', {
    url: "/comments",
    views: {
        'menuContent': {
          // templateUrl: "templates/chatroom.html",
          controller: "chatroomCtrl"
        }
    }
  })

    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })


  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
