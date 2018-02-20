
//Récupération des noms
window.__people = []
$("tr td", top.frames["users"].document).each(function (i, e) {
  __people.push({
    nom : e.innerText,
    dates : []
  });
})

//Récupération des noms
window.__dates = []
$("tr td", top.frames["dates"].document).each(function (i, e) {
  __dates.push(e.innerText);
})

//Récupération des noms
window.__cell = []
$("tr", top.frames["cells"].document).each(function (i, e) {
  $("td", e).each(function (_i, _e) {
    //S'il y a une date
    if (_e.innerText != "&nbsp" && _e.innerText.trim() != "") {
      __people[_i].dates.push({
        start: moment(__dates[i], "ddd DD MMM YY", "fr").toDate(),
        title: _e.innerText
      })
    }
  })
})

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