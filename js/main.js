/* global ghibliData */
/* exported ghibliData */

var $parent = document.querySelector('select');
var $search = document.querySelector('.search');
var $reviewParent = document.querySelector('.parent');
var $view = document.querySelectorAll('.view');

$search.addEventListener('submit', populateForm);

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
  var addNew = manipulateForm();
  $reviewParent.prepend(addNew);
  switchView('review-form');
  $search.reset();
}

function manipulateForm() {
  var $rowDiv = document.createElement('div');
  $rowDiv.setAttribute('class', 'row');

  var $columnDiv = document.createElement('div');
  $columnDiv.setAttribute('class', 'column-half');

  var $title = document.createElement('div');
  $title.setAttribute('class', 'review-title white-text');
  $title.textContent = $search.elements.title.value;

  var $descriptionTitle = document.createElement('div');
  $descriptionTitle.setAttribute('class', 'review-sub white-text');
  $descriptionTitle.textContent = 'Description:';

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
  $saveButton.setAttribute('class', 'white-text save margin-bottom');

  var $textArea = document.createElement('textarea');
  $textArea.setAttribute('type', 'text-area');
  $textArea.setAttribute('id', 'review');
  $textArea.setAttribute('rows', '35');
  $textArea.setAttribute('name', 'review');
  $textArea.setAttribute('placeholder', 'Write your review here!');
  $textArea.setAttribute('class', 'review-box');
  $textArea.required = true;

  $reviewForm.appendChild($textArea);
  $reviewForm.appendChild($saveButton);

  $columnDiv2.appendChild($reviewTitle);
  $columnDiv2.appendChild($reviewForm);

  $columnDiv.appendChild($title);
  $columnDiv.appendChild($descriptionTitle);

  $rowDiv.appendChild($columnDiv);
  $rowDiv.appendChild($columnDiv2);

  $reviewForm.addEventListener('submit', saveReview);

  var dataObject = {
    title: $search.elements.title.value,
    image: '',
    description: '',
    review: ''
  };

  function saveReview(event) {
    event.preventDefault();
    dataObject.entryId = ghibliData.nextReviewId;
    ghibliData.nextReviewId++;
    dataObject.review = $reviewForm.elements.review.value;
    ghibliData.reviews.unshift(dataObject);
    $reviewParent.removeChild($rowDiv);
    switchView('home-screen');
  }

  function getPoster(movieName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.themoviedb.org/3/search/movie?api_key=e2317d1150ebe694b173d9560f5e95b8&query=' + movieName);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var $posterLink = document.createElement('img');
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
      $columnDiv.insertBefore($posterLink, $descriptionTitle);
      dataObject.image = $posterLink.getAttribute('src');
    });
    xhr.send();
  }
  function getDescription() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      for (var i = 0; i < xhr.response.length; i++) {
        if ($title.textContent === xhr.response[i].title) {
          var description = xhr.response[i].description;
          var $description = document.createElement('div');
          $description.setAttribute('class', 'description-text');
          $description.textContent = description;
          $columnDiv.appendChild($description);
          dataObject.description = $description.textContent;
        }
      }
    });
    xhr.send();
  }
  getPoster($search.elements.title.value);
  getDescription();
  return $rowDiv;
}

function switchView(name) {
  ghibliData.view = name;
  for (var i = 0; i < $view.length; i++) {
    if (name === $view[i].getAttribute('data-view')) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view hidden';
    }
  }
}
