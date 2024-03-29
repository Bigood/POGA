
//Récupération des noms
window.__people = []
$("tr td", top.frames["users"].document).each(function (i, e) {
  const fullname = e.innerText,
       splitName = fullname.match(/(([A-z]|-)*?)([A-Z]*)$/gm).filter(el => el != "");
  __people.push({
    nom : fullname,
    surname: splitName[0],
    familyName: splitName[1],
    ics: ics(), //https://github.com/michael-maltsev/ics.js.git
    dates : [],
    conges : [],
    calculJours: function(dateString){
	return this.dates.reduce(function(previous, current){
		return previous += current.start.toDateString().indexOf(dateString) >= 0 ? 1 : 0;
	}, 0)
    }
  });
})

//Récupération des dates
window.__dates = []
$("tr td", top.frames["dates"].document).each(function (i, e) {
  __dates.push(e.innerText);
})

//Récupération des jours de travail
window.__cell = []
$("tr", top.frames["cells"].document).each(function (i, e) {
  const momentDate = moment(__dates[i], "ddd DD MMM YY", "fr");
  $("td", e).each(function (_i, _e) {
    //S'il y a une date
    if (_e.innerText != "&nbsp" && _e.innerText.trim() != "") {
      //Séparation des congés payés
      if(_e.innerText.toLowerCase() == "cp"){
        __people[_i].conges.push({
          start: momentDate.toDate(),
          title: _e.innerText,
          backgroundColor: _e.bgColor
        })
      }
      else{
        let title = _e.innerText,
          dateICS = momentDate.format("M/D/YYYY");

        if (_e.innerText.toLowerCase() == "sre-web"){
          title = _e.bgColor == '#ff00ff' ? "SRE-web aprèm" : "SRE-web";
        }
        __people[_i].dates.push({
          start: momentDate.toDate(),
          title: title,
          backgroundColor: _e.bgColor
        })
        __people[_i].ics.addEvent(title, '', '', dateICS, dateICS)
      }
    }
  })
})

//Récupération des dates de début et de fin du planning analysé, dans la première frame (sans nom) du doc
//44-Secrétaires d'éditions Nantes - Planning prévisionnel du 01/09/2022 au 30/09/2022
window.__datesPlanning = top.frames[0].document.querySelector("body > table > tbody > tr:nth-child(1) > td").innerText.match(/\d\d\/\d\d\/\d\d\d\d/g)
//Planning publié jusqu'au 30/09/2022
window.__maxDatePublication = top.frames[0].document.querySelector("body > table > tbody > tr:nth-child(2) > td").innerText.match(/\d\d\/\d\d\/\d\d\d\d/g)[0]

if(typeof window.__load == "function")
  window.__load();

// var tr = $("tr.w");
// tr.forEach(function(e){
//   console.log(e);
//   e.querySelectorAll("tr").map(function(e,i){
//   return e.html != "&nbsp"
//   });
// });


// // Loop through grabbing everything
// var myRows = [];
// var $headers = $("th");
// var $rows = $("tbody tr").each(function(index) {
//   $cells = $(this).find("td");
//   myRows[index] = {};
//   $cells.each(function(cellIndex) {
//     myRows[index][$($headers[cellIndex]).html()] = $(this).html();
//   });
// });

// // Let's put this in the object like you want and convert to JSON (Note: jQuery will also do this for you on the Ajax request)
// var myObj = {};
// myObj.myrows = myRows;
// alert(JSON.stringify(myObj));
