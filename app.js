var pf_app = angular.module('poga_app',['ui.calendar', 'ui.bootstrap']);

pf_app.controller("calendrier", function ($scope,$compile,uiCalendarConfig, $timeout) {
  $scope.array_personnes = window.__people;
  $scope.moment = moment;

  $scope.addSource = function (personne) {
    $scope.calendrier_personne = personne;
    $scope.dates = [{
      id: personne.nom,
      color: '#f00',
      textColor: 'yellow',
      events : personne.dates
    }];

    uiCalendarConfig.calendars.poga.fullCalendar('removeEvents');
    uiCalendarConfig.calendars.poga.fullCalendar('addEventSource', personne.dates);

    $scope.firstDate = moment(personne.dates[0]).locale("fr").format("dddd L");
    $scope.lastDate = moment(personne.dates[personne.dates.length-1]).locale("fr").format("dddd L");
    
  }

  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 450,
      firstDay: 1,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      dayNames : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    }
  };
  /* event sources array*/
  $scope.dates = [];
  // $scope.addSource($scope.array_personnes[0])
})

angular.element(document).ready(function() {
  angular.bootstrap(document, ['poga_app']);
});