/* global ghibliData */
/* exported ghibliData */

var $parent = document.querySelector('select');
var $search = document.querySelector('.search');
var $reviewParent = document.querySelector('.parent');
var $view = document.querySelectorAll('.view');
var $reviewForm = document.querySelector('.review-text');
var $header = document.querySelector('header');
var $myReviewNav = document.querySelector('.my-review-nav');
var $myReview = document.querySelector('.my-review');
var $logoNav = document.querySelector('.nav-logo');
var $newButton = document.querySelector('.add-new-button');
var $noEntry = document.querySelector('.no-entry');
var $ulParent = document.querySelector('ul');
var $reviewNotes = document.querySelector('#review');

$search.addEventListener('submit', populateForm);
$reviewForm.addEventListener('submit', saveReview);
window.addEventListener('DOMContentLoaded', addReview);
$myReviewNav.addEventListener('click', goToMyReviews);
$myReview.addEventListener('click', goToMyReviews);
$logoNav.addEventListener('click', goToHome);
window.addEventListener('DOMContentLoaded', stayOnView);
$newButton.addEventListener('click', goToHome);
$noEntry.addEventListener('click', goToHome);
window.addEventListener('load', refreshGoHome);
$ulParent.addEventListener('click', showEditForm);

var $posterLink = document.createElement('img');
var $title = document.createElement('div');
var $description = document.createElement('div');
var $rowDiv = document.createElement('div');
var $reviewTitle = document.createElement('div');
var $descriptionTitle = document.createElement('div');
var $columnDiv = document.createElement('div');

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
  var addForm = createForm(title);
  $reviewParent.prepend(addForm);
  addPoster($search.elements.title.value, $columnDiv, $descriptionTitle);
  switchView('review-form');
  $search.reset();
  if ($rowDiv.childElementCount > 2) {
    $rowDiv.firstElementChild.remove();
  }
}

function saveReview(event) {
  event.preventDefault();
  var dataObject = {
    title: $title.textContent,
    image: $posterLink.getAttribute('src'),
    description: $description.textContent,
    review: $reviewForm.elements.review.value
  };
  dataObject.reviewId = ghibliData.nextReviewId;
  ghibliData.nextReviewId++;
  switchView('review-gallery');
  if ($reviewNotes.textContent === '') {
    ghibliData.reviews.unshift(dataObject);
    $reviewParent.removeChild($rowDiv);
    var addForm = createReview(dataObject);
    $ulParent.prepend(addForm);
    $noEntry.className = 'hidden';
    $reviewForm.reset();
  } else {
    ghibliData.editing.title = $title.textContent;
    ghibliData.editing.image = $posterLink.getAttribute('src');
    ghibliData.editing.description = $description.textContent;
    ghibliData.editing.review = $reviewForm.elements.review.value;
    for (var i = 0; i < ghibliData.reviews.length; i++) {
      if (ghibliData.reviews[i].reviewId === ghibliData.editing.reviewId) {
        ghibliData.reviews[i] = ghibliData.editing;
        var addEdit = createReview(ghibliData.editing);
        var $list = document.querySelectorAll('[data-review-id]');
        $list[i].replaceWith(addEdit);
        switchView('review-gallery');
        $reviewForm.reset();
      }
    }
  }
}

function addPoster(movieName, parent, insertBefore) {
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
    parent.insertBefore($posterLink, insertBefore);
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

function createForm(title) {
  $rowDiv.setAttribute('class', 'row');

  $columnDiv.setAttribute('class', 'column-half');

  $title.setAttribute('class', 'title-blue review-bar white-text');
  $title.textContent = title;

  $descriptionTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $descriptionTitle.textContent = 'Description:';

  var $columnDiv2 = document.createElement('div');
  $columnDiv2.setAttribute('class', 'column-half');

  $reviewTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $reviewTitle.textContent = 'Review:';

  addDescription($columnDiv);

  $columnDiv2.appendChild($reviewTitle);
  $columnDiv2.appendChild($reviewForm);

  $columnDiv.appendChild($title);
  $columnDiv.appendChild($descriptionTitle);

  $rowDiv.appendChild($columnDiv);
  $rowDiv.appendChild($columnDiv2);

  return $rowDiv;
}

function createReview(review) {
  var $newList = document.createElement('li');
  $newList.setAttribute('data-review-id', review.reviewId);

  var $newRowDiv = document.createElement('div');
  $newRowDiv.setAttribute('class', 'row');

  var $newColumnDiv = document.createElement('div');
  $newColumnDiv.setAttribute('class', 'column-half');

  var $newTitle = document.createElement('div');
  $newTitle.setAttribute('class', 'title-blue review-bar white-text');
  $newTitle.textContent = review.title;

  var $editIcon = document.createElement('i');
  $editIcon.setAttribute('class', 'far fa-edit');

  var $newImage = document.createElement('img');
  $newImage.setAttribute('src', review.image);
  $newImage.setAttribute('class', 'ghibli-image');

  var $newDescriptionTitle = document.createElement('div');
  $newDescriptionTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $newDescriptionTitle.textContent = 'Description:';

  var $newDescription = document.createElement('div');
  $newDescription.textContent = review.description;
  $newDescription.setAttribute('class', 'description-text text');

  var $newColumnDiv2 = document.createElement('div');
  $newColumnDiv2.setAttribute('class', 'column-half');

  var $newReviewTitle = document.createElement('div');
  $newReviewTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $newReviewTitle.textContent = 'Review:';

  var $newReviewText = document.createElement('div');
  $newReviewText.setAttribute('class', 'text review-notes');
  $newReviewText.textContent = review.review;

  $newColumnDiv2.appendChild($newReviewTitle);
  $newColumnDiv2.appendChild($newReviewText);

  $newTitle.appendChild($editIcon);

  $newColumnDiv.appendChild($newTitle);
  $newColumnDiv.appendChild($newImage);
  $newColumnDiv.appendChild($newDescriptionTitle);
  $newColumnDiv.appendChild($newDescription);

  $newRowDiv.appendChild($newColumnDiv);
  $newRowDiv.appendChild($newColumnDiv2);

  $newList.appendChild($newRowDiv);

  return $newList;
}

function addReview(event) {
  for (var i = 0; i < ghibliData.reviews.length; i++) {
    var newReview = createReview(ghibliData.reviews[i]);
    $ulParent.appendChild(newReview);
  }
}

function goToMyReviews(event) {
  switchView('review-gallery');
  $reviewForm.reset();
}

function goToHome(event) {
  switchView('home-screen');
  $reviewForm.reset();
}

function stayOnView(event) {
  switchView(ghibliData.view);
}

if (ghibliData.reviews.length !== 0) {
  $noEntry.className = 'hidden';
}

function refreshGoHome(event) {
  if (ghibliData.view !== 'review-gallery') {
    switchView('home-screen');
    ghibliData.editing = null;
  }
}

function showEditForm(event) {
  if (event.target.matches('.fa-edit')) {
    var stringId = event.target.closest('li').getAttribute('data-review-id');
    for (var i = 0; i < ghibliData.reviews.length; i++) {
      if (ghibliData.reviews[i].reviewId === parseInt(stringId)) {
        ghibliData.editing = ghibliData.reviews[i];
      }
    }
    var title = $search.elements.title.value;
    var addForm = createForm(title);
    $reviewParent.prepend(addForm);
    if ($rowDiv.childElementCount > 2) {
      $rowDiv.firstElementChild.remove();
    }
    addPoster(ghibliData.editing.title, $columnDiv, $descriptionTitle);
    switchView('review-form');
    $title.textContent = ghibliData.editing.title;
    $posterLink.setAttribute('src', ghibliData.editing.image);
    $descriptionTitle.textContent = 'Description:';
    $description.textContent = ghibliData.editing.description;
    $reviewTitle.textContent = 'Review:';
    $reviewNotes.textContent = ghibliData.editing.review;
  }
}
