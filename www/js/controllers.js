angular.module('stp.controllers', [])

// .factory('myTrips', function ($rootScope) {
//   if (myTrips == undefined) {
//     var myTrips = [{
//       title: "blank trip",
//       description: "no date",
//       // img: "assets/pic13.jpg"
//     }, {
//       title: "My trip to HK",
//       description: "Start at Jan",
//       img: "assets/pic13.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }, {
//       title: "My trip to Japan",
//       description: "Start at Feb",
//       img: "assets/pic10.jpg"
//     }];
//   }


//   return myTrips;
// })


// .controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $http, accountService, iteneraryService) {
//   $scope.loggedIn = false;
// Form data for the login modal

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $location, $http, $ionicSideMenuDelegate, $ionicHistory, accountService) {
  accountService.registerLoggedInCallback(function (userInfo, status) {
    $scope.loggedIn = status;
    $scope.userInfo = userInfo;
  })


  $scope.loginData = {};
  $scope.signupData = {};
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function (modal) {
    id: 2,
    $scope.signup_modal = modal;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function (modal) {
    id: 1,
    $scope.signin_modal = modal;
  });



  $scope.doSignup = function () {
    // console.log($event);
    console.log('Doing signup', $scope.signupData);
    if ($scope.signupData.password == $scope.signupData.password_repeat) {
      accountService.signup($scope.signupData, function (success, data) {
        if (success) {
          $scope.userInfo = data;
          $scope.loggedIn = true;
          $scope.signup_modal.hide();
        } else {
          console.log('something went wrong:', data);
        }
      })
    }
  }

  $scope.logOut = function () {
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
  $scope.closeLogin = function () {
    $scope.signin_modal.hide();
  };

  // Open the login modal
  $scope.showLogin = function () {
    $scope.signin_modal.show();
  };

  $scope.showSignup = function () {
    $scope.signin_modal.hide()
    console.log("redirect to signup");
    $scope.signup_modal.show();

  }

  $scope.closeSignup = function () {
    console.log("calling close Signup")
    $scope.signup_modal.hide();
  }


  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    console.log('Doing login', $scope.loginData);
    accountService.login($scope.loginData, function (loggedIn, data) {
      $scope.loggedIn = loggedIn;
      if ($scope.loggedIn) {
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

  $scope.forgotPwd = function () {
    $scope.signin_modal.hide()
  }
})

.controller('forgotPasswordCtrl', function ($location, $scope, $state, $ionicLoading, $http) {
  $scope.user = {};
  $scope.error = {};
  $scope.state = {
    success: false
  };
  var searchObject = $location.search();
  console.log(searchObject);
  $scope.reset = function () {
    $scope.loading = $ionicLoading.show({
      content: 'Sending',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $http.put('http://picwo.com:3100/api/account?reset_password=' + $scope.user.email, {
      withCredentials: true,
    }).success(function (data, status, headers, config) {
      $scope.state.success = true;
      $ionicLoading.hide();
      console.log(data);
    }).
    error(function (data, status, headers, config) {
      $ionicLoading.hide();
      $scope.error.message = data;

    });
    // Parse.User.requestPasswordReset($scope.user.email, {
    //     success: function() {
    //         // TODO: show success
    //         $ionicLoading.hide();
    //         $scope.state.success = true;
    //         $scope.$apply();
    //     },
    //     error: function(err) {
    //         $ionicLoading.hide();
    //         if (err.code === 125) {
    //             $scope.error.message = 'Email address does not exist';
    //         } else {
    //             $scope.error.message = 'An unknown error has occurred, ' +
    //                 'please try again';
    //         }
    //         $scope.$apply();
    //     }
    // });
  };

})

.controller('ResetPasswordCtrl', function ($scope, $state, $http, $location) {
  $scope.resetPwd = {
    new_password: ''
      // token:'',
      // email_address:''
  };
  $scope.confirmPwd = {};
  var searchObject = $location.search();
  console.log(searchObject);
  $scope.error = {};
  $scope.state = {
    success: false
  };
  $http.get('http://picwo.com:3100/api/account/reset_password?token=' +
      searchObject.token +
      '&email_address=' +
      searchObject.email_address, {
        withCredentials: true
      })
    .success(function (data, status, headers, config) {
      if (data.valid) {
        console.log('token成功');
        $scope.resetPwd.token = searchObject.token;
        $scope.resetPwd.email_address = searchObject.email_address;
        $scope.state.success = true;
      } else {
        $scope.error.message = 'token not valid!';
      }
    }).
  error(function (data, status, headers, config) {
    $scope.error.message = data;
    console.log('error' + data);
  });

  $scope.resetPwdFunc = function () {
    console.log($scope.confirmPwd.pwd);
    console.log($scope.resetPwd.new_password);
    if ($scope.confirmPwd.pwd == $scope.resetPwd.new_password) {
      console.log($scope.resetPwd);
      $http.put('http://picwo.com:3100/api/account/reset_password', $scope.resetPwd, {
          withCredentials: true
        })
        .success(function (data, status, headers, config) {
          console.log(data);
          // $location.path('app/home');
        }).
      error(function (data, status, headers, config) {
        $scope.error.message = data;
        console.log(data);
      });
    } else {
      console.log('不一致');
      $scope.error.message = '两次密码必须一致';
    }

  }

})


.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [{
      title: 'Reggae',
      id: 1
    }, {
      title: 'Chill',
      id: 2
    }, {
      title: 'Dubstep',
      id: 3
    }, {
      title: 'Indie',
      id: 4
    }, {
      title: 'Rap',
      id: 5
    }, {
      title: 'Cowbell',
      id: 6
    }];
  })
  .controller('friendtripCtrl', function ($scope, myTrips) {
    $scope.items = myTrips;
    // $scope.$on('showHeader',function(arg){
    //   $scope.showHeader=arg;
    //   $scope.apply();
    //   
    // });
    $scope.hideSearch = function () {
      $scope.showHeader = false;
      console.log("hide!")
    };

  })
  .controller('mytripCtrl', function ($scope, myTrips, $filter, $http,$location) {
    // console.log(myTrips);
    $scope.items = myTrips.data.trips;
    $scope.showHeader = false;
    $scope.toggleSearch = function () {
      $scope.showHeader = !$scope.showHeader;
    };

    $scope.cancelSearch = function () {
      $scope.searchQuery = undefined;
      $scope.showHeader = false;
    };
    $scope.openTripDetail = function(item){
      console.log(item);
      $location.path('app/tripdetails/'+item.event);
    }

  })
  .controller('photoUploadCtrl', function ($scope, $upload, $http) {
      

    $scope.upload = function (files) {
      if (files.length==0){
        return;
      }

      $scope.photoWidth = Math.floor(($("#photos-containter").outerWidth()-15-16*2)/3);
      // $scope.photos=[];

      // console.log(files);
      $scope.hasPhotos = true;
      $scope.photos = [];
      var namemap = {};
      files.forEach(function (d) {
        namemap[d.name] = d;
        $scope.photos.push(URL.createObjectURL(d));
      })
      $scope.photos.push("assets/plus.ico");

      var postData = {
        name: $scope.myTripsData.title,
        trip: 1,
        files: files
      }

      console.log(postData);
      $http.post('http://picwo.com:3100/api/upload/trip', postData, {
        withCredentials: true
      }).
      success(function (data, status, headers, config) {
        data.files.forEach(function (d) {
          var upload = $http.put(d.upload_url, namemap[d.name], {
              headers: {
                "x-amz-acl": "authenticated-read",
                "Content-Type": namemap[d.name].type
              }
            })
            .success(function (data, status, headers, config) {
              console.log(data, config);
            }).error(function (data, status, headers, config) {
              console.log('Status:' + status);
              console.log(data, config);
            })
        });
        console.log(data, status);
      }).
      error(function (data, status, headers, config) {})
    };
  })


.controller('NewTripCtrl', function (myTrip, $scope, $ionicModal, $timeout, $http, $location, $upload, $window) {
  $scope.myTripsData = {};
  $scope.myTripsData.title = 'untitled';
  if (myTrip!=undefined) {
    $scope.myTripsData.trip = myTrip.tripID;
  } else {
    $http.get('http://picwo.com:3100/api/trip', {
      withCredentials: true
    }).
    success(function (data, status, headers, config) {
      $scope.myTripsData.trip = data.trip;
      console.log($scope.myTripsData);
      // $http.post('http://picwo.com:3100/api/trip', $scope.myTripsData).
      // success(function(data, status, headers, config){
      //   $scope.itinernaryId = data.itinernaryId;
      // })
    }).
    error(function (data, status, headers, config) {
      // $scope.itinernaryId = 1;
    })
  }
  


  $scope.upload = function (files) {
    console.log(files);
    $scope.hasPhotos = true;
    $scope.photos = [];
    for (i = 0; i < Object.keys(files).length; i++) {
      $scope.photos.push(URL.createObjectURL(files[i]));
    }
  }


  $scope.save = function (myTripsData) {
    console.log($scope.myTripsData);
    $http.post('http://picwo.com:3100/api/trip', myTripsData, {
      withCredentials: true
    }).
    success(function (data, status, headers, config) {
      // $scope.tripId = data.trip;
      console.log(data);
      // $window.location.href = '#/app/mytrip';
      // $location.path('/app/mytrip');
    })

  };

  $scope.getImgSrc = function (place) {
    return place.photos[0].getUrl({
      maxWidth: 200,
      maxHeight: 200
    });
  }

  $scope.addItinerary = function () {

    $http.post('http://picwo.com:3100/api/trip/'+$scope.myTripsData.trip +'/itinerary' ,{}, {
      withCredentials: true
    }).
    success(function (data, status, headers, config) {
        $scope.itineraryId = data.itinerary;
        $location.path('app/itinerary/'+$scope.itineraryId);
      })
      .error(function (data, status, headers, config) {
        console.log("fail to call server");
      })
      // $location.path('app/itinerary/' + $scope.itineraryId);
   
  }

  $scope.photos = [];
  $scope.autoUpload = false;
  $scope.hasPhotos = false;


  $scope.uploadFile = function (files) {

    var fd = new FormData();
    $scope.hasPhotos = true;
    $scope.photos = [];
    fd = files;
    console.log(fd[0]);
    for (i = 0; i < Object.keys(files).length; i++) {
      $scope.photos.push(URL.createObjectURL(files[i]));
    }


    $http.post('http://picwo.com:3100/api/upload/trip', fd, {
      withCredentials: true,
      headers: {
        'Content-Type': undefined
      },
      transformRequest: angular.identity
    }).success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      alert("test upload photos!");
      $scope.isDisable = true;
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert("fail!");
      console.log(data);
    });

  };



})


.controller('itineraryCtrl', function ($scope, $stateParams, $location, itinerary, itineraryService) {
    // if (itinerary.content.length>0){
    //   console.log(itinerary.content);
    //   // $scope.items = [];
    //   for(var i in itinerary.content){
    //     console.log(itinerary.content[i]);
    //   }
    // };
    $scope.$on("$stateChangeSuccess", function () {
      $scope.itinerary = itinerary;
      $scope.items = itineraryService.toDayItinerary($scope.itinerary);
    });
    // console.log($scope.itinerary);


    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;

    $scope.edit = function (item) {
      alert('Edit Item: ' + item.id);
    };
    $scope.share = function (item) {
      alert('Share Item: ' + item.id);
    };

    $scope.moveItem = function (item, fromIndex, toIndex) {
      var items = $scope.items;
      console.log(fromIndex);
      console.log(toIndex);
      console.log($scope.items);

      var i = 0;
      var sum = 0;
      console.log(items[0].places.length);
      while (items[i].places.length + sum <= fromIndex) {
        sum += items[i].places.length;
        i++;
      }

      var sum2 = 0;
      var j = 0;
      while (items[j].places.length + sum2 <= toIndex) {
        sum2 += items[j].places.length;
        j++;
      }

      if (i == j) {
        var ii = fromIndex - sum;
        var jj = toIndex - sum2;
        var temp = items[i].places[ii];
        console.log(items[i].places[ii]);
        console.log(items[j].places[jj]);

        items[i].places[ii] = items[j].places[jj];
        items[j].places[jj] = temp;
      }



    };
    $scope.changeStartDate = function (startDate, endDate) {
      console.log(startDate);
      console.log(endDate);
      if (endDate != undefined) {
        $scope.endDate = startDate + ($scope.itinerary.endDate - $scope.itinerary.startDate);
        console.log($scope.endDate);
      }

    }
    $scope.getDuration = function (startDate, endDate) {
      if (startDate == undefined) {
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

    $scope.addPlace = function (day) {
      console.log(day);
      $location.path("app/placefinder/1/" + day);
    }

    $scope.onItemDelete = function (item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };
    $scope.toggleDelete = function () {
      $scope.shouldShowReorder = false;
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
    }
    $scope.toggleReorder = function () {
      $scope.shouldShowDelete = false;
      $scope.shouldShowReorder = !$scope.shouldShowReorder;
    }
    $scope.addItinerary = function () {
      $location.path("app/placefinder/1/1");
    }

    $scope.fileHandler = function ($event) {
      var files = $event.target.files; // FileList object
      console.log(files);
      console.log($scope.file);
    }

  })
  .controller('chatroomCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $ionicLoading, accountService) {
    var fb = new Firebase('https://picwochat.firebaseio.com/' + $stateParams.chatroomId)
    var postsRef = fb.child("messages");
    $scope.messages = [];
    // var n = 
    // $ionicScrollDelegate.scrollBottom(true);

    var first;

    $scope.init = function () {
      $ionicLoading.show({
        content: "loading",
        animation: "fade-in",
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 300
      })
      postsRef.limitToLast(20).once("value", function (snapshot) {
        var vals = snapshot.val()
        for (var i in vals) {
          first = first || i;
          $scope.messages.push(vals[i]);
        }
        // console.log(vals);
        // console.log(first);
        // console.log(snapshot.val());
        $ionicLoading.hide();
        $ionicScrollDelegate.scrollBottom(true);
      })

    }();

    $scope.sendMsg = function () {
      // postsRef = fb.child("messages");
      if (accountService.userInfo.username == undefined) {
        alert('please login first')
        return false;
      }
      postsRef.push({
        author: accountService.userInfo.username,
        content: $scope.message,
      }, function (error) {
        console.log(error);
      });

      $scope.message = "";
    };
    // postsRef.once("value", function(snapshot){
    //   console.log(snapshot.val());
    // });


    $scope.scrollBottom = function () {
      $ionicScrollDelegate.scrollBottom(true);
      // console.log('scrol');
    }
    $scope.loadMore = function () {
      var temp = []
        // console.log(first);
      postsRef.endAt(null, first).limitToLast(20).once("value", function (snapshot) {
        var vals = snapshot.val();
        first = [];
        // console.log(vals)
        for (var i in vals) {
          first = first || i
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

.controller('friendsCtrl', function ($scope, $location, $http) {
  $scope.friends = [];
  $http.get('http://picwo.com:3100/api/user/friends', {
    withCredentials: true
  }).
  success(function (data, status, headers, config) {
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
  error(function (data, status, headers, config) {
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

  $scope.addFriend = function () {
    $location.path('app/addFriend');
  }

  $scope.acceptRequest = function (friend) {
    $http.post('http://m.picwo.com/api/user/1?accept', {}, {
      withCredentials: true
    }).
    success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      alert("test accept!");
      $scope.friendReqs.splice($scope.friendReqs.indexOf(friend), 1);
      $scope.isDisable = true;
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert("fail!");
      console.log(data);
    });
  }

  $scope.declineRequest = function (friend) {
    $scope.sendRequest = function (friend) {
      $http.post('http://m.picwo.com/api/user/1?decline', {}, {
        withCredentials: true
      }).
      success(function (data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(data);
        alert("test dc!");
        $scope.friendReqs.splice($scope.friendReqs.indexOf(friend), 1);
        $scope.isDisable = true;
      }).
      error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("fail!");
        console.log(data);
      });
    }

  }
})


.controller('addFriendCtrl', function ($scope, $stateParams, $http, friendService) {
  //   $scope.friends = [
  //   { username: 'Reggae', avatar_url: "assets/pic1.jpg"},
  //   { username: 'Chill', avatar_url: "assets/pic2.jpg" },
  //   { username: 'Dubstep', avatar_url: "assets/pic3.jpg" },
  //   { username: 'Indie', avatar_url: "assets/pic4.jpg" },
  //   { username: 'Rap', avatar_url: "assets/pic5.jpg" },
  //   { username: 'Cowbell', avatar_url: "assets/pic6.jpg" }
  // ];
  $scope.formData = {};
  var delay = (function () {
    var timer = 0;
    return function (callback, ms, $event) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms, $event);
    };
  })();
  $scope.autoFill = function ($event) {
    if ($scope.formData.searchText == "") {
      delay(function ($event) {}, 0, $event);
    } else {
      delay(function ($event) {
        //get some autocomplete data
        friendService.searchFriend($scope.formData.searchText, function (searchStatus, friends) {
          $scope.searchStatus = searchStatus;
          if ($scope.searchStatus) {
            $scope.friends = friends;
            console.log($scope.friends + "aha");
          } else {
            console.log("Failed!")
          }

        })

      }, 300, $event)
    }
  }

  $scope.sendRequest = function (id) {
    $http.post('http://picwo.com:3100/api/user/' + id + '?action=add', {}, {
      withCredentials: true
    }).
    success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(data);
      alert("test request!");
      $scope.isDisable = true;
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert("fail!");
      console.log(data);
    });
  }
})

.controller('countryCtrl', function ($scope, $http, $location, accountService) {
  accountService.getCountries(function (status, data) {
    if (status) {
      $scope.locations = data.countries;
    }
  })

  $scope.showHeader = false;
  $scope.toggleSearch = function () {
    $scope.showHeader = !$scope.showHeader;

    // $scope.$broadcast('showHeader', $scope.showHeader);
  };

  $scope.cancelSearch = function () {
    $scope.searchQuery = undefined;
    $scope.showHeader = false;
  };

  $scope.getNext = function (value) {
    if (value != null && value != "") {
      if (value.country != null) {
        accountService.getRegions(value.country, function (status, data) {
          if (status) {
            $scope.locations = data.countries;
          }
        })
      } else if (value.region != null) {
        accountService.getCities(value.region, function (status, data) {
          if (status) {
            $scope.locations = data.cities;
          }
        })
      } else if (value.city != null) {
        accountService.update('city', value.city, function (status, data) {
          if (status) {
            accountService.getAccount(function (status, data) {
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



.controller('profileCtrl', function ($scope, $stateParams, $ionicModal, $http, accountService) {
  accountService.getAccount(function (status, data) {
    if (status) {
      $scope.profile = data;
      console.log(data);
    }
  })
  $scope.update = function (field, value) {
    if (value != null && value != "") {
      accountService.update(field, value, function (status, data) {
        if (status) {
          accountService.getAccount(function (status, data) {
            if (status) {
              $scope.profile = data;
              console.log(data);
            }
          })
        }
      })
    }
  }


  $scope.resetData = {};

  $ionicModal.fromTemplateUrl('templates/updatePassword.html', {
    scope: $scope
  }).then(function (modal) {
    id: 3,
    $scope.resetPassword_modal = modal;
  });

  $scope.gotoReset = function () {
    $scope.resetData = {};
    $scope.errorMessage = "";
    $scope.resetPassword_modal.show();
  }

  $scope.closeReset = function () {
    $scope.resetPassword_modal.hide();
  }

  $scope.doReset = function () {
    console.log($scope.resetData);
    if ($scope.resetData.new_password == $scope.resetData.new_password2) {
      accountService.updatePassword($scope.resetData, function (success, data) {
        if (success) {
          $scope.resetPassword_modal.hide();
        } else {
          $scope.errorMessage = "Incorrect old password";
          console.log('something went wrong:', data);
        }
      })
    } else {
      $scope.errorMessage = "New password and repeat password don't match";
    }
  }

});
