stp.service('googleMapService',['$window', function ($window) {
    // body...
    // var map = [];
    var defaultBounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(-33.8902, 151.1759),
              new google.maps.LatLng(-33.8474, 151.2631));
    var mapOptions = {
            zoom: 8,
            };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),
                     mapOptions);
    this.map.fitBounds(defaultBounds);
        
    this.AutocompleteService = new google.maps.places.AutocompleteService();
    

}]);