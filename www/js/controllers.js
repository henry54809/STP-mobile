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

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $http,$ionicSideMenuDelegate,$ionicHistory, accountService) {
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
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });
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
    accountService.login($scope.loginData, function(loggedIn, data){
        $scope.loggedIn = loggedIn;
        if ($scope.loggedIn){
          $scope.userInfo = data;
          $scope.signin_modal.hide();
          $scope.loginData = {};
        } else {
          console.log("Failed!")
          $scope.errorMessage = data.message;
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


.controller('NewTripCtrl', function($scope, $ionicModal, $timeout, $http, $location, $upload) {

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
   $scope.upload = function(files) {
        console.log(files);
        $scope.hasPhotos = true;
        $scope.photos=[];
        for (i = 0; i < Object.keys(files).length; i++) {
          $scope.photos.push(URL.createObjectURL(files[i]));
        }
    }


  $scope.save = function(myTripsData) {
    console.log(myTripsData.title);
    $http.post('http://picwo.com:3100/api/trip', myTripsData, {withCredentials:true}).
    success(function(data, status, headers, config){
      $scope.tripId = data.trip;
      console.log($scope.tripId);
    })

  };

  $scope.addItinerary = function(tripId) {
    $http.post('http://picwo.com:3100/api/trip/itinerary', tripId, {withCredentials:true}).
    success(function(data, status, headers, config){
      $scope.itineraryId = data.itinerary;
    })
    .error(function(data, status, headers, config) {
      console.log("fail to call server");
    })
    // $location.path('app/itinerary/' + $scope.itineraryId);
    $location.path('app/itinerary/1');
  }

  $scope.photos = [];
  $scope.autoUpload = false;
  $scope.hasPhotos = false;


  $scope.uploadFile = function(files) {
    
    var fd = new FormData();
    $scope.hasPhotos = true;
    $scope.photos = [];
    fd = files;
    console.log(fd[0]);
    for (i = 0; i < Object.keys(files).length; i++) {
      $scope.photos.push(URL.createObjectURL(files[i]));
    }

    console.log($scope.photos[0]);

    $http.post('http://picwo.com:3100/api/trip/photos', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
        alert("test upload photos!");
       $scope.isDisable = true;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("fail!");
        console.log(data);
      });

};

})


.controller('itineraryCtrl', function($scope,$stateParams,$location, itinerary,itineraryService) {
  // if (itinerary.content.length>0){
  //   console.log(itinerary.content);
  //   // $scope.items = [];
  //   for(var i in itinerary.content){
  //     console.log(itinerary.content[i]);
  //   }
  // };
  $scope.$on( "$stateChangeSuccess",function(){
    $scope.itinerary = itinerary;
    $scope.items = itineraryService.toDayItinerary($scope.itinerary);
  });
  // console.log($scope.itinerary);
  

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
  $scope.changeStartDate = function(startDate,endDate) {
    console.log(startDate);
    console.log(endDate);
    if (endDate != undefined){
      $scope.endDate = startDate + ($scope.itinerary.endDate - $scope.itinerary.startDate);
      console.log($scope.endDate);
    }
    
  }
  $scope.getDuration = function(startDate, endDate) {
    if (startDate == undefined){
      return;
    } else {
      console.log(startDate, endDate);
      var dur = endDate - startDate;
      dur = parseInt(dur / 86400000, 10) + 1;
      $scope.duration = dur;
      // for (i = 1; i <= dur; i++) {
      //   $scope.items.push({data: "Day" + i, isDay: true});
      //   $scope.items.push({data: "Add activity", isDay: false});
      // }
      $scope.itinerary = itineraryService.initItinerary(startDate, endDate, dur);
      $scope.items = itineraryService.toDayItinerary($scope.itinerary);
    }
    
    // console.log($scope.items);
  };

  $scope.addPlace = function(day) {
    console.log(day);
    $location.path("app/placefinder/1/"+day);
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
    $location.path("app/placefinder/1/1");
  }

  $scope.fileHandler = function($event){
    var files = $event.target.files; // FileList object
    console.log(files);
    console.log($scope.file);
  }

})
.controller('chatroomCtrl', function($scope, $stateParams,$ionicScrollDelegate,$ionicLoading, accountService){
  var fb = new Firebase('https://picwochat.firebaseio.com/'+$stateParams.chatroomId)
  var postsRef = fb.child("messages");
  $scope.messages = [];
// var n = 
  // $ionicScrollDelegate.scrollBottom(true);
  
  var first;
  
  $scope.init = function(){
    $ionicLoading.show({
      content:"loading",
      animation:"fade-in",
      showBackdrop: false,
      maxWidth:200,
      showDelay:300
    })
    postsRef.limitToLast(20).once("value", function(snapshot){
        var vals = snapshot.val()
        for (var i in vals){
          first = first ||i;
          $scope.messages.push(vals[i]);
        }
        // console.log(vals);
        // console.log(first);
        // console.log(snapshot.val());
        $ionicLoading.hide();
        $ionicScrollDelegate.scrollBottom(true);
    })

  }();

  $scope.sendMsg = function(){
    // postsRef = fb.child("messages");
    if (accountService.userInfo.username == undefined){
      alert('please login first')
      return false;
    }
    postsRef.push({
      author: accountService.userInfo.username,
      content: $scope.message,
    }, function(error){
      console.log(error);
    });
   
    $scope.message = "";
  };
  // postsRef.once("value", function(snapshot){
  //   console.log(snapshot.val());
  // });
  

  $scope.scrollBottom =  function(){
    $ionicScrollDelegate.scrollBottom(true);
    // console.log('scrol');
  }
  $scope.loadMore = function() {
    var temp= []
    // console.log(first);
    postsRef.endAt(null, first).limitToLast(20).once("value", function(snapshot){
    var vals = snapshot.val();
    first =[];
    // console.log(vals)
    for (var i in vals){
      first = first|| i
      // console.log(vals[i])
      temp.push(vals[i]);
    }
    console.log(first)
    console.log($scope.messages);
    $scope.messages = temp.concat($scope.messages)
    // $ionicScrollDelegate.scrollBottom(true);
    $scope.$broadcast('scroll.refreshComplete');
    })
    
    
  }



})

.controller('friendsCtrl', function($scope,$location,$http) {
  $scope.friends = [];
  $http.get('http://picwo.com:3100/api/user/friends',{withCredentials: true}).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    console.log('success');
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
  
  // if (!$scope.friends) {
  //   $scope.friends = [
  //   { username: 'Reggae', avatar_url: "assets/pic1.jpg"},
  //   { username: 'Chill', avatar_url: "assets/pic2.jpg" },
  //   { username: 'Dubstep', avatar_url: "assets/pic3.jpg" },
  //   { username: 'Indie', avatar_url: "assets/pic4.jpg" },
  //   { username: 'Rap', avatar_url: "assets/pic5.jpg" },
  //   { username: 'Cowbell', avatar_url: "assets/pic6.jpg" }
  // ];
  //   console.log($scope.friends);
  // }
  

  // $scope.friendReqs = 

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


.controller('addFriendCtrl', function($scope,$stateParams,$http,friendService) {
  //   $scope.friends = [
  //   { username: 'Reggae', avatar_url: "assets/pic1.jpg"},
  //   { username: 'Chill', avatar_url: "assets/pic2.jpg" },
  //   { username: 'Dubstep', avatar_url: "assets/pic3.jpg" },
  //   { username: 'Indie', avatar_url: "assets/pic4.jpg" },
  //   { username: 'Rap', avatar_url: "assets/pic5.jpg" },
  //   { username: 'Cowbell', avatar_url: "assets/pic6.jpg" }
  // ];
  $scope.formData = {};
    var delay = (function(){
    var timer=0;
    return function(callback, ms,$event){
      clearTimeout(timer);
      timer = setTimeout(callback,ms,$event);
    };
    })();
    $scope.autoFill = function($event) {
      if($scope.formData.searchText==""){
         delay(function($event){},0,$event);
      } else {
          delay(function($event){
            //get some autocomplete data
          friendService.searchFriend($scope.formData.searchText, function(searchStatus, friends){
          $scope.searchStatus = searchStatus;
          if ($scope.searchStatus){
            $scope.friends = friends;
            console.log($scope.friends + "aha");
          } else {
            console.log("Failed!")
          }
          
      })
            
         },300,$event)
       }
    }

    $scope.sendRequest = function(id) {
      $http.post('http://picwo.com:3100/api/user/'+id+'?action=add',{},{withCredentials: true}).
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

.controller('countryCtrl',function($scope,$http,$location,accountService) {
  accountService.getCountries(function(status,data) {
    if (status) {
      $scope.locations = data.countries;
    }
  })

  $scope.showHeader = false;
  $scope.toggleSearch = function() {
    $scope.showHeader = !$scope.showHeader;

    // $scope.$broadcast('showHeader', $scope.showHeader);
  };

  $scope.cancelSearch = function() {
    $scope.searchQuery= undefined;
    $scope.showHeader = false;
  };

  $scope.getNext = function(value) {
    if(value != null && value != "") {
      if(value.country != null){
        accountService.getRegions(value.country,function(status,data) {
            if (status) {
              $scope.locations = data.countries;
            }
        })
      } else if(value.region != null) {
        accountService.getCities(value.region,function(status,data) {
            if (status) {
              $scope.locations = data.cities;
            }
        })
      } else if (value.city != null) {
          accountService.update('city',value.city,function(status,data) {
          if (status) {
            accountService.getAccount(function(status,data) {
              if (status) {
                $location.path('app/profile');
                console.log(data);
              }
            })
          }
      })
      }
    }
  }

})



.controller('profileCtrl', function($scope, $stateParams, $http,accountService) {
  accountService.getAccount(function(status,data) {
    if (status) {
      $scope.profile = data;
      console.log(data);
    }
  })
  $scope.update = function(field,value) {
    if(value != null && value != "") {
      accountService.update(field,value,function(status,data) {
          if (status) {
            accountService.getAccount(function(status,data) {
              if (status) {
                $scope.profile = data;
                console.log(data);
              }
            })
          }
      })
    }
  }
});
