var _app = angular.module('poga_app', ['ui.calendar', 'ui.bootstrap']);

_app.controller("calendrier", function ($scope, $compile, uiCalendarConfig, $http, $httpParamSerializerJQLike) {
  $scope.array_personnes = window.__people;
  $scope.datesPlanning = window.__datesPlanning.map((dateString) => moment(dateString, "DD/MM/YYYY"));
  $scope.maxDatePublication = window.__maxDatePublication;

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
  function chargerQLA(cell, day) {
    $http.post(
      "/poga/TraitementParametresServlet",
      $httpParamSerializerJQLike({
        dateDebut: day.format("DD/MM/Y"),
        action: "ConsulterJour",
        periodeRadio: 1,
        equipe: 113
      }),
      { withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }
    )
      .then(function (result) {
        //https://stackoverflow.com/a/21870431/1437016
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(result.data, 'text/html');
        const SRs = htmlDoc.querySelectorAll("body > table:nth-child(25) > tbody > tr")
        let presents = [];
        SRs.forEach(tr => {
          const nom = tr.querySelector("td font").textContent,
            splitName = nom.match(/(.*?) (.*?)\.$/gm).filter(el => el != ""),
            familyName = splitName[0];
          presents.push({
            poste: tr.querySelector("td:first-child").textContent,
            nom,
            familyName,
          })
        })
        console.log(presents);
        //Sauvegarde de la donnée pour plus tard
        localStorage.setItem(day.format("DD/MM/Y"), JSON.stringify({ updateDate: moment().toISOString(), presents }))

        afficherQLA(cell, presents)
      })
  }
  function afficherQLA(cell, presents) {

    let personneAfficheeTravailleCeJour = false;
    //S'il y a un calendrier d'afiché
    if ($scope.calendrier_personne) {
      personneAfficheeTravailleCeJour = afficherSuggestionQLA(cell, presents)
    }
    //Tooltip pour afficher tous les gens qui sont là 
    cell.append($("<div>", {
      class: "qla-tooltip",
      html: presents.map(present =>
        $("<div>", {
          text: `${present.nom} (${present.poste})`,
          class: personneAfficheeTravailleCeJour && (personneAfficheeTravailleCeJour.nom == present.nom) ? "bold" : ""
        }))
    }),
    );

    cell.css("background-color", "rgba(0,0,0,0.1)");
  }

  function afficherSuggestionQLA(cell, presents) {
    let personneTravailleCeJour = presents.find(present => present.nom.match(RegExp($scope.calendrier_personne.familyName.toLowerCase(), 'i')))
    if (personneTravailleCeJour) {
      //On affiche le poste suggéré
      cell.append($("<div>", {
        class: "qla-suggested",
        text: personneTravailleCeJour.poste
      }))
      return personneTravailleCeJour;
    }
    else
      return false
  }

  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 450,
      firstDay: 1,
      defaultDate: $scope.datesPlanning[0].format("YYYY-MM-DD"),
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      dayNames : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      /**
       * https://fullcalendar.io/docs/day-cell-render-hooks
       * 
        0: FCMoment {_isAMomentObject: true, _isUTC: true, _offset: 0, _pf: {…}, _locale: f, …}
        1: jQuery.fn.init [td.fc-day.fc-widget-content.fc-mon.fc-past, context: td.fc-day.fc-widget-content.fc-mon.fc-past]
        2: MonthView {calendar: Calendar, opt: ƒ, trigger: ƒ, isEventDraggable: ƒ, isEventResizable: ƒ, …}
       */
      dayRender: function (day, cell, calendar) {
        if (!day.isBetween($scope.datesPlanning[0], $scope.datesPlanning[1], undefined, "[]")) {
          //Récup du QLA en local, si déjà récupéré
          const storedQla = localStorage.getItem(day.format("DD/MM/Y"));
          if (storedQla) {
            afficherQLA(cell, JSON.parse(storedQla).presents)
          }
          //On la colore en gris, et on rajoute un event onclick pour appeler le qui est là pour ce jour ci
          else {
            cell.css("background-color", "rgba(0,0,0,0.2)"); 
            cell.css("cursor", "pointer"); 
            cell.on("click", function () {
              chargerQLA(cell, day);
            })
          }
        }
      }
    }
  };
  /* event sources array*/
  $scope.dates = [];
  // $scope.addSource($scope.array_personnes[0])
})
angular.element(document).ready(function() {
  angular.bootstrap(document, ['poga_app']);
});
