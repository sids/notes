var converter = new Markdown.Converter();
var baseTitle;

function handleClick( e ) {
  var href = $(this).attr("href").substr(1);
  fetchAndRender(href);
}

function setTitle() {
  var title = $("#content h1").first().text();
  if (title !== null && title !== "") {
    document.title = title + " | " + baseTitle;
  }
  else {
    document.title = baseTitle;
  }
}

function setAnchors() {
  $('#content a')
    .not('[href^="http"],[href^="https"],[href^="mailto:"],[href^="#"]')
    .each(function() {
        $(this).attr('href', function(index, value) {
          if (value.indexOf("/") != 0) {
            var current = window.location.hash.substr(1);
            var path = current.replace(/[/].[^/]*$/, "");
            value = path + "/" + value;
          }
          value = value.replace(/\.md$/, "");
          return "#" + value;
      });
    });
}

function render( content ) {
  content = converter.makeHtml(content);
  $("#content").html(content);
  setTitle();
  setAnchors();
  $('html, body').animate({scrollTop: '0px'}, 300);
}

function fetchAndRender(mdpath) {
  mdpath = mdpath.replace(/\.md$/, "");
  var basepath = window.location.pathname.replace(/[/](index.html)?$/, "");
  var path = basepath + mdpath + ".md";
  $.get(path, render);
}

function loadCurrent( ) {
  var path = window.location.hash;
  if (path !== null && path !== "" && path.substr(1) !== "") {
    path = path.substr(1);
    fetchAndRender(path);
  }
  else {
    window.location.hash = "#/index";
  }
}

$(window).on('hashchange', loadCurrent);

$( document ).ready(function() {
  baseTitle = document.title;
  loadCurrent();
});
