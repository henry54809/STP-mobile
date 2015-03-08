stp.service('itineraryService',['$location','$http','$window', function ($location,$http,$window) {


return {
    tempItineray: {
      startDate: "",
      endDate: "",
      days:[],
      content: new Array(),
      
    },
    addPlaceToItinerary: function(itineraryId, day, place){
      //get itinerary first
      // use itineraryId to push content
      var pictures = place.photos;
      var imgSrc = "assets/noImage.jpg";
      if (pictures != undefined) {
        imgSrc = pictures[0].getUrl({maxWidth:100, maxHeight:100});
      }
      
      this.tempItineray.content.push({
        day: day,
        // index: this.tempItineray.content.length,
        name: place.name,
        place: place,
        imgUrl: imgSrc
      })

    },
    initItinerary: function(startDate, endDate, days) {
      this.tempItineray.startDate = startDate;
      this.tempItineray.endDate = endDate;
      this.tempItineray.days = days;
      return this.tempItineray;
    },
    toDayItinerary: function(itinerary) {
      if (itinerary== undefined){
        return [];
      }
      //format of DayItinerary Object:
      //{isDay:true/false,  }
      var dayItinerary = new Array();
      for(var day = 1; day<=itinerary.days; day++){
        var oneDay = {
          places: itinerary.content.filter(function(d){
                    return d.day == day;
                  }),
          day:day,
        };
        dayItinerary.push(oneDay)
      }
      return dayItinerary;
    }

    // todos: [
    //   {
    //     id: '1',
    //     name: 'Pick up apples',
    //     done: false
    //   },
    //   {
    //     id: '2',
    //     name: 'Mow the lawn',
    //     done: true
    //   }
    // ],
    // getTodos: function() {
    //   return this.todos
    // },
    // getTodo: function(todoId) {
    //   var dfd = $q.defer()
    //   this.todos.forEach(function(todo) {
    //     if (todo.id === todoId) dfd.resolve(todo)
    //   })

    //   return dfd.promise
    // }

  }

}]);
