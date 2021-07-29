/* global ghibliData */
/* exported ghibliData */

var $parent = document.querySelector('select');
var $search = document.querySelector('.search');
var $reviewParent = document.querySelector('.parent');
var $view = document.querySelectorAll('.view');
var $reviewForm = document.querySelector('.review-text');
var $header = document.querySelector('header');

$search.addEventListener('submit', populateForm);
$reviewForm.addEventListener('submit', saveReview);

var $posterLink = document.createElement('img');
var $title = document.createElement('div');
var $description = document.createElement('div');
var $rowDiv = document.createElement('div');
var $reviewTitle = document.createElement('div');
var $descriptionTitle = document.createElement('div');

function populateSearchBar() {
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
  });
  xhr.send();
}

populateSearchBar();

function populateForm(event) {
  event.preventDefault();
  var title = $search.elements.title.value;
  var addNew = createForm(title);
  $reviewParent.prepend(addNew);
  switchView('review-form');
  $search.reset();
}

function saveReview(event) {
  event.preventDefault();
  var dataObject = {
    title: $title.textContent,
    image: $posterLink.getAttribute('src'),
    description: $description.textContent,
    review: $reviewForm.elements.review.value
  };
  dataObject.entryId = ghibliData.nextReviewId;
  ghibliData.nextReviewId++;
  ghibliData.reviews.unshift(dataObject);
  $reviewParent.removeChild($rowDiv);
  switchView('home-screen');
  $reviewForm.reset();
}

function createForm(title) {
  $rowDiv.setAttribute('class', 'row');

  var $columnDiv = document.createElement('div');
  $columnDiv.setAttribute('class', 'column-half');

  $title.setAttribute('class', 'title-blue review-bar white-text');
  $title.textContent = title;

  $descriptionTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $descriptionTitle.textContent = 'Description:';

  var $columnDiv2 = document.createElement('div');
  $columnDiv2.setAttribute('class', 'column-half');

  $reviewTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $reviewTitle.textContent = 'Review:';

  addPoster($search.elements.title.value, $columnDiv);
  addDescription($columnDiv);

  $columnDiv2.appendChild($reviewTitle);
  $columnDiv2.appendChild($reviewForm);

  $columnDiv.appendChild($title);
  $columnDiv.appendChild($descriptionTitle);

  $rowDiv.appendChild($columnDiv);
  $rowDiv.appendChild($columnDiv2);

  return $rowDiv;
}

function addPoster(movieName, parent) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.themoviedb.org/3/search/movie?api_key=e2317d1150ebe694b173d9560f5e95b8&query=' + movieName);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var posterPath;
    for (var i = 0; i < xhr.response.results.length; i++) {
      if (xhr.response.results[i].title === 'Spirited Away' || xhr.response.results[i].title === 'Grave of the Fireflies' || xhr.response.results[i].title === 'Pom Poko') {
        posterPath = xhr.response.results[1].poster_path;
      } else {
        posterPath = xhr.response.results[0].poster_path;
      }
    }
    $posterLink.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + posterPath);
    $posterLink.setAttribute('class', 'ghibli-image');
    parent.insertBefore($posterLink, $descriptionTitle);
  });
  xhr.send();
}

function addDescription(parent) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      if ($title.textContent === xhr.response[i].title) {
        var descriptionUnique = xhr.response[i].description;
        $description.setAttribute('class', 'description-text text');
        $description.textContent = descriptionUnique;
        parent.appendChild($description);
      }
    }
  });
  xhr.send();
}

function switchView(name) {
  ghibliData.view = name;
  for (var i = 0; i < $view.length; i++) {
    if (name !== 'home-screen') {
      $header.className = 'background-blue';
    }
    if (name === $view[i].getAttribute('data-view')) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view hidden';
    }
  }
}
