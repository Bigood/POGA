var pf_app = angular.module('poga_app',['ui.calendar', 'ui.bootstrap']);

pf_app.controller("calendrier", function ($scope,$compile,uiCalendarConfig, $timeout) {
  $scope.array_personnes = window.__people;
  $scope.moment = moment;

  $scope.addSource = function ($event, personne, add) {
    $event.stopPropagation();
    if (add) {
      var _index = $scope.dates.findIndex(function (e,i) {
        return e.id == personne.nom;
      })

      if (_index == -1) {
        if ($scope.dates.length == 2) {
          $scope.dates.pop();
          uiCalendarConfig.calendars.poga.fullCalendar('removeEvents');
          uiCalendarConfig.calendars.poga.fullCalendar('addEventSource', $scope.dates[0]);
        }
        $scope.dates.push({
          id: personne.nom,
          backgroundColor: '#ffe184',
          textColor: '#a95800',
          events : personne.dates
        });
        uiCalendarConfig.calendars.poga.fullCalendar('addEventSource', $scope.dates[1]);


        $scope.getExtras(personne);
        $scope.calendrier_personne_2 = personne;
      }
      else {
        $scope.dates.splice(_index, 1);
        uiCalendarConfig.calendars.poga.fullCalendar('removeEvents');
        uiCalendarConfig.calendars.poga.fullCalendar('addEventSource', $scope.dates[0]);
        delete $scope.calendrier_personne_2;
      }
    }
    else{
      $scope.dates = [{
        id: personne.nom,
        backgroundColor: '#9ae4c1',
        textColor: '#165625',
        events : personne.dates
      }];
      uiCalendarConfig.calendars.poga.fullCalendar('removeEvents');
      uiCalendarConfig.calendars.poga.fullCalendar('addEventSource', $scope.dates[0]);
      delete $scope.calendrier_personne_2;
  
      $scope.getExtras(personne);
      $scope.calendrier_personne = personne;
    }

  }
  $scope.getExtras = function (personne) {
    //Extras
    personne.firstDate = moment(personne.dates[0].start).locale("fr").format("dddd L");
    personne.lastDate = moment(personne.dates[personne.dates.length-1].start).locale("fr").format("dddd L");
    
    personne.affectations = {};
    personne.dates.forEach(function (e, i) {
      if(typeof personne.affectations[e.title] == "undefined")
        personne.affectations[e.title] = {
          nom : e.title,
          liste : [e]
        };
      else
        personne.affectations[e.title].liste.push(e);
    })
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