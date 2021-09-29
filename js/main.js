/* global ghibliData */
/* exported ghibliData */

const $parent = document.querySelector('select');
const $search = document.querySelector('.search');
const $reviewParent = document.querySelector('.parent');
const $view = document.querySelectorAll('.view');
const $reviewForm = document.querySelector('.review-text');
const $header = document.querySelector('header');
const $myReviewNav = document.querySelector('.my-review-nav');
const $myReview = document.querySelector('.my-review');
const $logoNav = document.querySelector('.nav-logo');
const $newButton = document.querySelector('.add-new-button');
const $noReview = document.querySelector('.no-review');
const $ulParent = document.querySelector('ul');
const $reviewNotes = document.querySelector('#review');
const $divModal = document.querySelector('.modal');
const $cancel = document.querySelector('.cancel');
const $confirm = document.querySelector('.confirm');
const $loading = document.querySelector('.spin');
const $introModal = document.querySelector('.intro-modal');
const $ok = document.querySelector('.ok');
const $countParent = document.querySelector('.count-parent');
const $countText = document.querySelector('.count-text');
const $number = document.querySelector('.number');
const $allNumber = document.querySelector('.all-number');

const $posterLink = document.createElement('img');
const $title = document.createElement('h2');
const $description = document.createElement('div');
const $rowDiv = document.createElement('div');
const $reviewTitle = document.createElement('h2');
const $descriptionTitle = document.createElement('h2');
const $columnDiv = document.createElement('div');

const populateSearchBar = parent => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  $loading.className = 'spin';
  xhr.responseType = 'json';
  const titleArray = [];
  xhr.addEventListener('load', () => {
    for (let i = 0; i < xhr.response.length; i++) {
      $loading.className = 'spin hidden';
      titleArray.push(xhr.response[i].title);
      titleArray.sort();
    }
    for (let j = 0; j < titleArray.length; j++) {
      $loading.className = 'spin hidden';
      const $option = document.createElement('option');
      $option.textContent = titleArray[j];
      $parent.appendChild($option);
    }
  });
  xhr.addEventListener('error', () => {
    window.alert('Sorry, there was an error connecting to the network! Please check your internet connection and try again.');
  });
  xhr.send();
};

populateSearchBar($countParent);

const populateForm = event => {
  event.preventDefault();
  const title = $search.elements.title.value;
  const addForm = createForm(title);
  $reviewParent.prepend(addForm);
  addPoster($search.elements.title.value, $columnDiv);
  switchView('review-form');
  $search.reset();
  if ($rowDiv.childElementCount > 2) {
    $rowDiv.firstElementChild.remove();
  }
};

const saveReview = event => {
  event.preventDefault();
  const dataObject = {
    title: $title.textContent,
    image: $posterLink.getAttribute('src'),
    description: $description.textContent,
    review: $reviewForm.elements.review.value
  };
  dataObject.reviewId = ghibliData.nextReviewId;
  ghibliData.nextReviewId++;
  movieMatchCount($countParent);
  $countText.className = 'count-text';
  switchView('review-gallery');
  if ($reviewNotes.textContent === '') {
    ghibliData.reviews.unshift(dataObject);
    $reviewParent.removeChild($rowDiv);
    const addForm = createReview(dataObject);
    $ulParent.prepend(addForm);
    movieMatchCount($countParent);
    $noReview.className = 'hidden';
    $reviewForm.reset();
  } else {
    ghibliData.editing.title = $title.textContent;
    ghibliData.editing.image = $posterLink.getAttribute('src');
    ghibliData.editing.description = $description.textContent;
    ghibliData.editing.review = $reviewForm.elements.review.value;
    for (let i = 0; i < ghibliData.reviews.length; i++) {
      if (ghibliData.reviews[i].reviewId === ghibliData.editing.reviewId) {
        ghibliData.reviews[i] = ghibliData.editing;
        const addEdit = createReview(ghibliData.editing);
        const $list = document.querySelectorAll('[data-review-id]');
        $list[i].replaceWith(addEdit);
        switchView('review-gallery');
        $reviewForm.reset();
      }
    }
  }
};

const addPoster = (movieName, parent) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=e2317d1150ebe694b173d9560f5e95b8&query=${movieName}`);
  $loading.className = 'spin';
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    let posterPath;
    $loading.className = 'spin hidden';
    for (let i = 0; i < xhr.response.results.length; i++) {
      if (xhr.response.results[i].title === 'Spirited Away' || xhr.response.results[i].title === 'Grave of the Fireflies' || xhr.response.results[i].title === 'Pom Poko') {
        posterPath = xhr.response.results[1].poster_path;
      } else {
        posterPath = xhr.response.results[0].poster_path;
      }
    }
    $posterLink.setAttribute('src', `https://image.tmdb.org/t/p/w500${posterPath}`);
    $posterLink.setAttribute('class', 'ghibli-image');
    parent.appendChild($posterLink);
  });
  xhr.addEventListener('error', () => {
    window.alert('Sorry, there was an error connecting to the network! Please check your internet connection and try again.');
  });
  xhr.send();
};

const addDescription = (parent, insertBefore) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  $loading.className = 'spin';
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    $loading.className = 'spin hidden';
    for (let i = 0; i < xhr.response.length; i++) {
      if ($title.textContent === xhr.response[i].title) {
        const descriptionUnique = xhr.response[i].description;
        $description.setAttribute('class', 'description-text text');
        $description.textContent = descriptionUnique;
        parent.insertBefore($description, insertBefore);
      }
    }
  });
  xhr.addEventListener('error', () => {
    window.alert('Sorry, there was an error connecting to the network! Please check your internet connection and try again.');
  });
  xhr.send();
};

const showEditForm = event => {
  if (event.target.matches('.fa-edit')) {
    const stringId = event.target.closest('li').getAttribute('data-review-id');
    for (let i = 0; i < ghibliData.reviews.length; i++) {
      if (ghibliData.reviews[i].reviewId === parseInt(stringId)) {
        ghibliData.editing = ghibliData.reviews[i];
      }
    }
    const title = $search.elements.title.value;
    const addForm = createForm(title);
    $reviewParent.prepend(addForm);
    if ($rowDiv.childElementCount > 2) {
      $rowDiv.firstElementChild.remove();
    }
    addPoster(ghibliData.editing.title, $columnDiv);
    switchView('review-form');
    $title.textContent = ghibliData.editing.title;
    $posterLink.setAttribute('src', ghibliData.editing.image);
    $descriptionTitle.textContent = 'Description:';
    $description.textContent = ghibliData.editing.description;
    $reviewTitle.textContent = 'Review:';
    $reviewNotes.textContent = ghibliData.editing.review;
  }
};

const switchView = name => {
  ghibliData.view = name;
  for (let i = 0; i < $view.length; i++) {
    if (name !== 'home-screen') {
      $header.className = 'background-blue';
    }
    if (name === $view[i].getAttribute('data-view')) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view hidden';
    }
  }
};

const createForm = title => {
  $rowDiv.setAttribute('class', 'row');

  $columnDiv.setAttribute('class', 'column-half');

  $title.setAttribute('class', 'title-blue review-bar white-text italic');
  $title.textContent = title;

  $descriptionTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $descriptionTitle.textContent = 'Description:';

  const $columnDiv2 = document.createElement('div');
  $columnDiv2.setAttribute('class', 'column-half');

  $reviewTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $reviewTitle.textContent = 'Review:';

  addDescription($columnDiv2, $reviewTitle);

  $columnDiv2.appendChild($descriptionTitle);
  $columnDiv2.appendChild($reviewTitle);
  $columnDiv2.appendChild($reviewForm);

  $columnDiv.appendChild($title);

  $rowDiv.appendChild($columnDiv);
  $rowDiv.appendChild($columnDiv2);

  return $rowDiv;
};

const createReview = review => {
  const $newList = document.createElement('li');
  $newList.setAttribute('data-review-id', review.reviewId);

  const $newRowDiv = document.createElement('div');
  $newRowDiv.setAttribute('class', 'row');

  const $newColumnDiv = document.createElement('div');
  $newColumnDiv.setAttribute('class', 'column-half');

  const $newTitle = document.createElement('h2');
  $newTitle.setAttribute('class', 'title-blue review-bar white-text italic row space-between');
  $newTitle.textContent = review.title;

  const $iconDiv = document.createElement('div');
  $iconDiv.setAttribute('class', 'align-right');

  const $editIcon = document.createElement('i');
  $editIcon.setAttribute('class', 'far fa-edit');

  const $deleteIcon = document.createElement('i');
  $deleteIcon.setAttribute('class', 'far fa-window-close');

  const $newImage = document.createElement('img');
  $newImage.setAttribute('src', review.image);
  $newImage.setAttribute('class', 'ghibli-image');

  const $newDescriptionTitle = document.createElement('h2');
  $newDescriptionTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $newDescriptionTitle.textContent = 'Description:';

  const $newDescription = document.createElement('div');
  $newDescription.textContent = review.description;
  $newDescription.setAttribute('class', 'description-text text');

  const $newColumnDiv2 = document.createElement('div');
  $newColumnDiv2.setAttribute('class', 'column-half');

  const $newReviewTitle = document.createElement('h2');
  $newReviewTitle.setAttribute('class', 'sub-blue review-bar white-text');
  $newReviewTitle.textContent = 'Review:';

  const $newReviewText = document.createElement('div');
  $newReviewText.setAttribute('class', 'text review-notes');
  $newReviewText.textContent = review.review;

  $newColumnDiv2.appendChild($newDescriptionTitle);
  $newColumnDiv2.appendChild($newDescription);
  $newColumnDiv2.appendChild($newReviewTitle);
  $newColumnDiv2.appendChild($newReviewText);

  $newTitle.appendChild($iconDiv);

  $iconDiv.appendChild($deleteIcon);
  $iconDiv.appendChild($editIcon);

  $newColumnDiv.appendChild($newTitle);
  $newColumnDiv.appendChild($newImage);

  $newRowDiv.appendChild($newColumnDiv);
  $newRowDiv.appendChild($newColumnDiv2);

  $newList.appendChild($newRowDiv);

  return $newList;
};

const addReview = event => {
  for (let i = 0; i < ghibliData.reviews.length; i++) {
    const newReview = createReview(ghibliData.reviews[i]);
    $ulParent.appendChild(newReview);
  }
};

const deleteReview = event => {
  for (let i = 0; i < ghibliData.reviews.length; i++) {
    if (ghibliData.reviews[i].reviewId === ghibliData.editing.reviewId) {
      ghibliData.reviews[i] = ghibliData.editing;
      ghibliData.reviews.splice(i, 1);
      const $list = document.querySelectorAll('[data-review-id]');
      $list[i].remove($list[i]);
      switchView('review-gallery');
      $divModal.className = 'modal hidden';
      movieMatchCount($countParent);
    }
  }
  if (ghibliData.reviews.length === 0) {
    $noReview.className = 'row text-align no-review justify-center container';
    $countText.className = 'hidden count-text';
  }
};

const goToMyReviews = event => {
  switchView('review-gallery');
  $reviewForm.reset();
};

const goToHome = event => {
  switchView('home-screen');
  $reviewNotes.textContent = '';
  $search.reset();
};

const stayOnView = event => {
  switchView(ghibliData.view);
};

if (ghibliData.reviews.length !== 0) {
  $noReview.className = 'hidden';
} else {
  $countText.className = 'hidden count-text';
}

const refreshGoHome = event => {
  if (ghibliData.view !== 'review-gallery') {
    switchView('home-screen');
  }
};

const openModal = event => {
  if (event.target.matches('.fa-window-close')) {
    $divModal.className = 'modal';
    const stringId = event.target.closest('li').getAttribute('data-review-id');
    for (let i = 0; i < ghibliData.reviews.length; i++) {
      if (ghibliData.reviews[i].reviewId === parseInt(stringId)) {
        ghibliData.editing = ghibliData.reviews[i];
      }
    }
  }
};

const closeModal = event => {
  $divModal.className = 'modal hidden';
};

const openIntro = event => {
  if (!localStorage.getItem('popupShown')) {
    $introModal.className = 'intro-modal';
  }
  localStorage.setItem('popupShown', true);
};

const closeIntro = event => {
  $introModal.className = 'intro-modal hidden';
};

const movieMatchCount = (parent, insertBefore) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
  $loading.className = 'spin';
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    $loading.className = 'spin hidden';
    const titleArray = [];
    const titleArray2 = [];
    for (let i = 0; i < xhr.response.length; i++) {
      titleArray.push(xhr.response[i].title);
    }
    for (let j = 0; j < ghibliData.reviews.length; j++) {
      titleArray2.push(ghibliData.reviews[j].title);
    }
    const allNumber = titleArray.length;
    const number = countCheck(titleArray, titleArray2);
    $number.textContent = number;
    $allNumber.textContent = allNumber;
  });
  xhr.addEventListener('error', () => {
    window.alert('Sorry, there was an error connecting to the network! Please check your internet connection and try again.');
  });
  xhr.send();
};

movieMatchCount($countParent);

const countCheck = (first, second) => {
  const newArray = [];
  for (let i = 0; i < first.length; i++) {
    for (let j = 0; j < second.length; j++) {
      if (first[i] === second[j] && !newArray.includes(first[i])) {
        newArray.push(first[i]);
      }
    }
  }
  return newArray.length;
};

$search.addEventListener('submit', populateForm);
$reviewForm.addEventListener('submit', saveReview);
window.addEventListener('DOMContentLoaded', addReview);
$myReviewNav.addEventListener('click', goToMyReviews);
$myReview.addEventListener('click', goToMyReviews);
$logoNav.addEventListener('click', goToHome);
window.addEventListener('DOMContentLoaded', stayOnView);
$newButton.addEventListener('click', goToHome);
$noReview.addEventListener('click', goToHome);
window.addEventListener('load', refreshGoHome);
$ulParent.addEventListener('click', showEditForm);
$ulParent.addEventListener('click', openModal);
$cancel.addEventListener('click', closeModal);
$confirm.addEventListener('click', deleteReview);
window.addEventListener('load', openIntro);
$ok.addEventListener('click', closeIntro);
