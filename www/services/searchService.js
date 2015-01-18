stp.service('searchService',['$http', function($http){
    this.getFullResult = function(input_string){
        
        //Using dummy data for now
        var data = '[{"province":"Guangdong","city":"Dongguan"},{"province":"Guangdong","city":"Guangzhou"},{"province":"Guangdong","city":"Shenzhen"}]';
        var jsonData = JSON.parse(data);
        return jsonData;
    };
    this.getAjaxResult = function(input_string,call_back){
        //dummy data
        var results;
        var searchText = input_string;
        var config = {
            searchText: searchText
        };
        
        var promise = $http.post("./php/searchBox.php", searchText, null)
        .success(function(data, status, headers, config)
        {
          console.log("success!");
          //var json =  eval('(' + data + ')');
          console.log("data:" + data);
          results = data;
          return results;
        })
        .error(function ()
        {
          console.log("errorrr");
        });

        return promise;


        

        // var tempData = JSON.parse(items);


        // var data = '[{"name":"李根","province":"Guangdong","city":"Dongguan"},{"name":"李世民","province":"Guangdong","city":"Guangzhou"},{"name":"李黑","province":"Guangdong","city":"Shenzhen"}]';
        // var jsonData = JSON.parse(data);
    };
}]);