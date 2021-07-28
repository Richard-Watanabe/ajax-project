/* global ghibliData */
/* exported ghibliData */

var $parent = document.querySelector('select');
var $search = document.querySelector('.search');
var $reviewParent = document.querySelector('.parent');
// var $form = document.querySelector('.review-text');
var $view = document.querySelectorAll('.view');

window.addEventListener('DOMContentLoaded', addReview);
$search.addEventListener('submit', populateForm);

function getGhibliMovies() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  xhr.responseType = 'json';
  var titleArray = [];
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      titleArray.push(xhr.response[i].title);
      titleArray.sort();
    }
    for (var j = 0; j < titleArray.length; j++) {
      var $option = document.createElement('option');
      $option.textContent = titleArray[j];
      $parent.appendChild($option);
    }
    for (var k = 0; k < xhr.response.length; k++) {
      if ($search.elements.title.value === xhr.response[k].title) {
        var description = xhr.response[k].description;
      }
    }
    return description;
  });
  xhr.send();
}

getGhibliMovies();

function populateForm(event) {
  event.preventDefault();
  var titleBase = $search.elements.title.value;
  var dataObject = {
    title: $search.elements.title.value,
    image: getPoster(titleBase),
    description: getGhibliMovies()
  };
  var addNew = createDom(dataObject);
  $reviewParent.prepend(addNew);
  switchView('review-form');
  $search.reset();
}

function getPoster(movieName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.themoviedb.org/3/search/movie?api_key=e2317d1150ebe694b173d9560f5e95b8&query=' + movieName);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var posterLink = document.createElement('img');
    var posterPath = xhr.response.results[0].poster_path;
    posterLink.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + posterPath);
    return posterLink;
  });
  xhr.send();
}

function createDom(review) {
  var $rowDiv = document.createElement('div');
  $rowDiv.setAttribute('class', 'row');

  var $columnDiv = document.createElement('div');
  $columnDiv.setAttribute('class', 'column-half');

  var $title = document.createElement('div');
  $title.setAttribute('class', 'review-title white-text');
  $title.textContent = $search.elements.title.value;

  var $image = document.createElement('img');
  $image.setAttribute('src', getPoster('ponyo'));
  $image.setAttribute('class', 'ghibli-image');

  var $descriptionTitle = document.createElement('div');
  $descriptionTitle.setAttribute('class', 'review-sub white-text');
  $descriptionTitle.textContent = 'Description:';

  var $description = document.createElement('div');
  $description.setAttribute('class', 'description-text');
  $description.textContent = getGhibliMovies();

  var $columnDiv2 = document.createElement('div');
  $columnDiv2.setAttribute('class', 'column-half');

  var $reviewTitle = document.createElement('div');
  $reviewTitle.setAttribute('class', 'review-sub white-text');
  $reviewTitle.textContent = 'Review:';

  var $reviewForm = document.createElement('form');
  $reviewForm.setAttribute('class', 'review-text');

  var $saveButton = document.createElement('input');
  $saveButton.setAttribute('type', 'submit');
  $saveButton.setAttribute('value', 'SAVE');
  $saveButton.setAttribute('class', 'white-text save');

  var $textArea = document.createElement('textarea');
  $textArea.setAttribute('type', 'text-area');
  $textArea.setAttribute('id', 'review');
  $textArea.setAttribute('rows', '13');
  $textArea.setAttribute('name', 'review');
  $textArea.setAttribute('placeholder', 'Write your review here!');
  $textArea.setAttribute('class', 'review-box');
  $textArea.required = true;

  $reviewForm.appendChild($textArea);
  $reviewForm.appendChild($saveButton);

  $columnDiv2.appendChild($reviewTitle);
  $columnDiv2.appendChild($reviewForm);

  $columnDiv.appendChild($title);
  $columnDiv.appendChild($image);
  $columnDiv.appendChild($descriptionTitle);
  $columnDiv.appendChild($description);

  $rowDiv.appendChild($columnDiv);
  $rowDiv.appendChild($columnDiv2);

  return $rowDiv;
}

function addReview(event) {
  for (var i = 0; i < ghibliData.reviews.length; i++) {
    var newReview = createDom(ghibliData.reviews[i]);
    $reviewParent.appendChild(newReview);
  }
}

function switchView(name) {
  ghibliData.view = name;
  for (var i = 0; i < $view.length; i++) {
    if (name === $view[i].getAttribute('data-view')) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view container hidden';
    }
  }
}
