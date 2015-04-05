stp.controller('placeFinderCtrl', function($scope,$location,$stateParams, $ionicPopover,$compile, googleMapService, itineraryService) {
  // console.log($stateParams);
  $scope.map = googleMapService.getMapInstance("map-canvas");
  $scope.PlacesService = new google.maps.places.PlacesService($scope.map);
  // var marker = new google.maps.Marker();
  var infowindow = new google.maps.InfoWindow();
  
  // $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.input);
  $scope.autocompleteService = new google.maps.places.AutocompleteService($scope.input);

  var delay = (function(){
    var timer=0;
    return function(callback, ms,$event){
      clearTimeout(timer);
      timer = setTimeout(callback,ms,$event);
    };
  })();
  
  
  $ionicPopover.fromTemplateUrl('/templates/placeFinderPopover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  })

  $scope.autoFill = function($event) {
    if ($event.keyCode == 13){
      if($scope.searchQuery!=""){
        $scope.querySearch($scope.searchQuery);
        $scope.popover.hide();
      }
      return false;
    }
     // console.log($event);
    if($scope.searchQuery==""){
       delay(function($event){},0,$event);
      $scope.popover.hide();
    } else {
      delay(function($event){
        //get some autocomplete data
        $scope.autocompleteService.getPlacePredictions({
          input:$scope.searchQuery
        }, function(list, status){
          if (list != null){
            $scope.itemData = [];
            $scope.itemData = list;
          } else {
            return false;
          }          
        });
        $scope.popover.show($event);
      },300,$event)
    }
  }
  var markers = [];
  $scope.querySearch = function(query) {
    if (query!="") {
      $scope.PlacesService.textSearch({
        query: query
      }, function(places, state){
        console.log(places);
        console.log(state);
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
      var marker = new google.maps.Marker({
        map: $scope.map,
        title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);

      var request = {
        placeId: place.place_id
      };
      var currentOpenInfowindow;

      google.maps.event.addListener(marker, 'click', 
        function(innerRequest,innerMarker){
          return function(){
            if (innerMarker.infowindow){
              console.log("dasgas");
              if (innerMarker.infowindow.isOpen){
                innerMarker.infowindow.close();
                innerMarker.infowindow.isOpen = false;
                currentOpenInfowindow = undefined;
              } else {
                innerMarker.infowindow.open($scope.map, innerMarker);
                innerMarker.infowindow.isOpen = true;
                if(currentOpenInfowindow){
                  currentOpenInfowindow.close();
                  currentOpenInfowindow.isOpen = false
                } 
                currentOpenInfowindow = innerMarker.infowindow;
              }
            } else{
              // $compile($("#infoWinTmpl"))($scope);
              $compile($("#infoWinTmpl"))($scope);
              console.log($("#infoWinTmpl").text());

              $scope.PlacesService.getDetails(innerRequest, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  var infowindow = new google.maps.InfoWindow({
                      content: $("#infoWinTmpl").text()
                      // "<div id='infoWin' >\
                      // This is "+place.name+" <a class='button \
                      // button-icon icon button-small ion-plus' \
                      // ng-click='addPlace("+"\""+place.place_id+"\""+")'></a></div>"
                  }); 
                    // infowindow.setContent(place.name);
                    infowindow.open($scope.map, innerMarker);
                    infowindow.isOpen=true;
                    innerMarker.infowindow = infowindow;
                    if(currentOpenInfowindow){
                      currentOpenInfowindow.close();
                      currentOpenInfowindow.isOpen=false;
                    } 
                    currentOpenInfowindow = innerMarker.infowindow;
                    $compile($("#infoWin"))($scope);
               }
              });
              
            }
          }
        }(request,marker));
    }
    $scope.map.fitBounds(bounds);
      })
    }
  }

  $scope.addPlace = function(placeId){
    var request = {placeId: placeId};
    $scope.PlacesService.getDetails(request, function(place, status) {
      itineraryService.addPlaceToItinerary($stateParams.itineraryID, //itineraryId
            $stateParams.dayID, //day
            place
      );
      $scope.$apply(function(){$location.path('app/itinerary/1')});
       
    });
   
    
  }
  // var infowindowListener = function(innerRequest,innerMarker) {
  //       return function(){
  //         if (innerMarker.infowindow){
  //           if (innerMarker.infowindow.isOpen){
  //             innerMarker.infowindow.close();
  //             innerMarker.infowindow.isOpen = false;
  //             currentOpenInfowindow = undefined;
  //           } else {
  //             innerMarker.infowindow.open($scope.map, innerMarker);
  //             innerMarker.infowindow.isOpen = true;
  //             if(currentOpenInfowindow){
  //               currentOpenInfowindow.close();
  //               currentOpenInfowindow.isOpen = false
  //             } 
  //             currentOpenInfowindow = innerMarker.infowindow;
  //           }
  //         } else{
  //           var infowindow = new google.maps.InfoWindow();
  //           $scope.PlacesService.getDetails(innerRequest, function(place, status) {
  //             if (status == google.maps.places.PlacesServiceStatus.OK) {
  //                 infowindow.setContent(place.name);
  //                 infowindow.open($scope.map, innerMarker);
  //            }
  //           });
  //           infowindow.isOpen=true;
  //           innerMarker.infowindow = infowindow;
  //           if(currentOpenInfowindow){
  //             currentOpenInfowindow.close();
  //             currentOpenInfowindow.isOpen=false;
  //           } 
  //           currentOpenInfowindow = innerMarker.infowindow;
  //         }
  //       }
  // };

  $scope.detailSearch =function(place) {
      // console.log(place);
    $scope.popover.hide();
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }
    markers=[];
    $scope.PlacesService.getDetails({
        placeId : place.place_id
      }, function(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
      });
      if (place.geometry.viewport) {
        $scope.map.fitBounds(place.geometry.viewport);
      } else {
        $scope.map.setCenter(place.geometry.location);
        $scope.map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      google.maps.event.addListener(marker,'click',function(){
          if (marker.infowindow){
            if (marker.infowindow.isOpen){
              marker.infowindow.close();
              marker.infowindow.isOpen = false;
              currentOpenInfowindow = undefined;
            } else {
              marker.infowindow.open($scope.map, marker);
              marker.infowindow.isOpen = true;
              if(currentOpenInfowindow){
                currentOpenInfowindow.close();
                currentOpenInfowindow.isOpen = false
              } 
              currentOpenInfowindow = marker.infowindow;
            }
          } else {
            $scope.PlacesService.getDetails(request, function(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                var infowindow = new google.maps.InfoWindow({
                    content: "<div id='infoWin' >\
                    This is "+place.name+" <a class='button \
                    button-icon icon button-small ion-settings' \
                    ng-click='addPlace("+"\""+place.place_id+"\""+")'></a></div>"
                }); 
                  // infowindow.setContent(place.name);
                  infowindow.open($scope.map, marker);
                  infowindow.isOpen=true;
                  marker.infowindow = infowindow;
                  if(currentOpenInfowindow){
                    currentOpenInfowindow.close();
                    currentOpenInfowindow.isOpen=false;
                  } 
                  currentOpenInfowindow = marker.infowindow;
                  $compile($("#infoWin"))($scope);
             }
              });
              
            }
        
      })
    }
  });

  }


  // var infowindow = new google.maps.InfoWindow();
  // var service = new google.maps.places.PlacesService(map);

  // service.getDetails(request, function(place, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     var marker = new google.maps.Marker({
  //       map: map,
  //       position: place.geometry.location
  //     });
  //     google.maps.event.addListener(marker, 'click', function() {
  //       infowindow.setContent(place.name);
  //       infowindow.open(map, this);
  //     });
  //   }
  // });



  $scope.$on("$locationChangeStart", function(){
      $scope.popover.hide();
  })

  $scope.items =[{p:'1'},{p:'2'},{p:'3'}];
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  var markers = [];
  
  $scope.searchBox =  [];//new google.maps.places.SearchBox(($scope.input));
  

  
  // var service = new google.maps.places.PlacesService($scope.map);

  //  google.maps.event.addListener($scope.searchBox, 'places_changed', function() {

  // });

})
