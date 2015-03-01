stp.service('googleMapService',['$window', function ($window) {
    // body...
    // var map = [];
    var defaultBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(-33.8902, 151.1759),
              new google.maps.LatLng(-33.8474, 151.2631));
    var mapOptions = {
            zoom: 8,
            };
    this.getMapInstance = function(elementId){
      // if (elementId in this.map){
      //   return this.map[elementId];
      // }
      var map = new google.maps.Map(document.getElementById('map-canvas'),
                     mapOptions);
      map.fitBounds(defaultBounds);
      // this.map[elementId] = map;
      return map;
    }
    // this.map = {};
    // this.;
        
    this.AutocompleteService = new google.maps.places.AutocompleteService();
    
    this.credentials = "gaga";
}]);