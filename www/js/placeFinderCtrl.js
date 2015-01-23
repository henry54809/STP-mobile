stp.controller('placeFinderCtrl', function($scope,$location, $ionicPopover, googleMapService) {
  
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
    if($scope.searchQuery==""){
       delay(function($event){},0,$event);
      $scope.popover.hide();
    } else {
      delay(function($event){
        //get some autocomplete data
        $scope.itemData = $scope.searchQuery;
        $scope.popover.show($event);
      },300,$event)
    }
  }
  $scope.$on("$locationChangeStart", function(){
      $scope.popover.hide();
  })

  $scope.items =[{p:'1'},{p:'2'},{p:'3'}];
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  var markers = [];
  $scope.map = googleMapService.map

  $scope.input = (document.getElementById('searchbox'));

  $scope.searchBox =  [];//new google.maps.places.SearchBox(($scope.input));

  
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
