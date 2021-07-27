/* exported data */

var $parent = document.querySelector('select');

function getGhibliMovies() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      var $option = document.createElement('option');
      $option.textContent = xhr.response[i].title;
      $parent.appendChild($option);
    }
  });
  xhr.send();
}

getGhibliMovies();
