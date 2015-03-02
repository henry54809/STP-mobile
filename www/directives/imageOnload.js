stp.directive('imageonload', function() {

    var loadingDefault = "assets/loading.gif";
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
                // for (key in element[0]){
                //     console.log(key)
                // }
                console.log(attrs.imageonload);
                // console.log(element[0]);
                // element.attr('src',loadingDefault)
                // element[0] = angular.element('<img />');
                element[0].src = loadingDefault;
                element.bind('load', function(){
                    console.log("loading");                    
                })
                var img = angular.element('<img/>')
                img.attr('src',attrs.imageonload)
                // img.src = attrs.imageonload;
                img.on('load', function() {
                    console.log('here')
                    element[0].src = attrs.imageonload;
                });
                // console.log(element[0].src);
                

            // console.log(element)
            // element.bind('load', function() {
            //     console.log('image is loaded');
            // });
        }
    };
});