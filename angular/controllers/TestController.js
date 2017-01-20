/**--------------------------------------------------------------------------
Name                   : DashboardController
Description            : use to authenticate the navigation item & logout functionality
--------------------------------------------------------------------------*/

module.exports = function($scope, $state, $stateParams, $SessionService, VehicleService, $timeout) {
     $scope.events=[] ;
     $scope.eventSources1 = [
  {
    "title": "All Day Event",
    "start": "2016-09-01"
  },
  {
    "title": "Long Event",
    "start": "2016-09-07",
    "end": "2016-09-10"
  },
  {
    "id": "999",
    "title": "Repeating Event",
    "start": "2016-09-09T16:00:00-05:00"
  },
  {
    "id": "999",
    "title": "Repeating Event",
    "start": "2016-09-16T16:00:00-05:00"
  },
  {
    "title": "Conference",
    "start": "2016-09-11",
    "end": "2016-09-13"
  },
  {
    "title": "Meeting",
    "start": "2016-09-12T10:30:00-05:00",
    "end": "2016-09-12T12:30:00-05:00"
  },
  {
    "title": "Lunch",
    "start": "2016-09-12T12:00:00-05:00"
  },
  {
    "title": "Meeting",
    "start": "2016-09-12T14:30:00-05:00"
  },
  {
    "title": "Happy Hour",
    "start": "2016-09-12T17:30:00-05:00"
  },
  {
    "title": "Dinner",
    "start": "2016-09-12T20:00:00"
  },
  {
    "title": "Birthday Party",
    "start": "2016-09-13T07:00:00-05:00"
  },
  {
    "title": "Click for Google",
    "url": "http://google.com/",
    "start": "2016-09-28"
  }
];
     /* config object */
$timeout(function () {
     $scope.eventSources = [];
     $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
}, 2000);

}
