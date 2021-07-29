/* exported ghibliData */

var ghibliData = {
  view: 'home-screen',
  reviews: [],
  editing: null,
  nextReviewId: 1
};

var oldReviewJSON = localStorage.getItem('ghibli-local-storage');

if (oldReviewJSON !== null) {
  var oldData = JSON.parse(oldReviewJSON);
  ghibliData = oldData;
}

function saveData(event) {
  var newReview = JSON.stringify(ghibliData);
  localStorage.setItem('ghibli-local-storage', newReview);
}

window.addEventListener('beforeunload', saveData);
