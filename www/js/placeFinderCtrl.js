stp.controller('placeFinderCtrl', function($scope,$location, $ionicPopover, googleMapService) {
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
      console.log($event);
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
            $scope.itemData=[];
            $scope.itemData = list;
            console.log(list[0]);
            console.log(status);
          } else {
            return false;
          }
          
        });
        // $scope.itemData = $scope.searchQuery;
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

    // var places = $scope.searchBox.getPlaces();

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
      // console.log(place);
      // var image = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(0, 0),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: $scope.map,
        // icon: image,
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
      google.maps.event.addListener(marker, 'click', infowindowListener(request,marker,currentOpenInfowindow, function(curWin){
        currentOpenInfowindow = curWin;
      }));
    }
    $scope.map.fitBounds(bounds);


      })
    }
      // console.log(query);
  }

  var infowindowListener = function(innerRequest,innerMarker) {
        return function(){
          if (innerMarker.infowindow){
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
            var infowindow = new google.maps.InfoWindow();
            $scope.PlacesService.getDetails(innerRequest, function(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                  infowindow.setContent(place.name);
                  infowindow.open($scope.map, innerMarker);
             }
            });
            infowindow.isOpen=true;
            innerMarker.infowindow = infowindow;
            if(currentOpenInfowindow){
              currentOpenInfowindow.close();
              currentOpenInfowindow.isOpen=false;
            } 
            currentOpenInfowindow = innerMarker.infowindow;
          }
        }
  };
  $scope.detailSearch =function(place) {
      // console.log(place);
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
      // marker.setIcon(/** @type {google.maps.Icon} */({
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(0, 0),
      //   scaledSize: new google.maps.Size(35, 35),

      // }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
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
