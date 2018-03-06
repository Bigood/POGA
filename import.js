window.POGA = {
  root_url : "http://www.maen-j.com/POGA/"
}

function includeHead (url, callback)
{
  var head = window.document.getElementsByTagName('head')[0];
  var type = url.slice(url.lastIndexOf('.'));
  var addedHead;
  switch (type)
  {
    case '.js':
    addedHead = window.document.createElement('script');
    addedHead.setAttribute('src', url);
    addedHead.setAttribute('charset', "utf-8");
    break;
    case '.css':
    addedHead = window.document.createElement('link');
    addedHead.setAttribute('href', url);
    addedHead.setAttribute('type', 'text/css');
    addedHead.setAttribute('rel', 'stylesheet');
    break;
    case '.less':
    addedHead = window.document.createElement('link');
    addedHead.setAttribute('href', url);
    addedHead.setAttribute('type', 'text/css');
    addedHead.setAttribute('rel', 'stylesheet/less');
    break;
    default:
    addedHead = '<!--[if lte IE 8]>    <script type="text/javascript"      src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>    <sc     // Le code conditionnel qui check si Google Chrome Frame est déjà installé     // Il ouvre une iFrame pour proposer le téléchargement.     window.attachEvent("onload", function() {       CFInstall.check({         mode: "overlay" // the default       });     });    </script>        //La balise indiquant à IE d`utiliser GCF si présent    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><![endif]-->'
    break;

  }
  addedHead.async = true;
  head.appendChild(addedHead);

  if(callback)
  {
    var completed = false;
    addedHead.onload = addedHead.onreadystatechange = function () {
      if (!completed && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        completed = true;
        callback();
        addedHead.onload = addedHead.onreadystatechange = null;
        // head.removeChild(addedHead);
      }
    };
  }
}

window.__load = function () {
  $("html frameset").remove();
  $("html").append(document.createElement("body"))
  $("body").load(POGA.root_url + "views/calendrier.html", function (argument) {
    includeHead(POGA.root_url + "app.js");
  });
}

// calendar.js
// fullcalendar-2.1.1.js
// fullcalendar.js
// ui-bootstrap-tpls-0.9.0.js
document.querySelector("meta").setAttribute("content", "text/html; charset=UTF-8");

includeHead(POGA.root_url + "main.css");
includeHead("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
includeHead("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.css");
includeHead(POGA.root_url + "lib/jquery.js", function (argument) {
// includeHead("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js", function (argument) {
  includeHead(POGA.root_url + "lib/jquery-ui.min.js", function (argument) {
    includeHead(POGA.root_url + "lib/moment-with-locale.js", function (argument) {
      includeHead("https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.5/angular.js", function (argument) {
        // includeHead("https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.js", function (argument) {
        includeHead(POGA.root_url + "lib/fullcalendar-2.1.1.js", function (argument) {
          // includeHead("https://cdnjs.cloudflare.com/ajax/libs/angular-ui-calendar/1.0.0/calendar.js", function (argument) {
          includeHead(POGA.root_url + "lib/calendar.js", function (argument) {
            // includeHead("https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap.js", function (argument) {
            includeHead(POGA.root_url + "lib/ui-bootstrap-tpls-0.9.0.js", function (argument) {
              includeHead(POGA.root_url + "loop.js", function (argument) {
              });
            });
          });
        });
      });
    });
  });
});