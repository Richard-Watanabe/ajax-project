/* exported ghibliData */

let ghibliData = {
  view: 'home-screen',
  reviews: [],
  editing: null,
  nextReviewId: 1
};

const oldReviewJSON = localStorage.getItem('ghibli-local-storage');

if (oldReviewJSON !== null) {
  const oldData = JSON.parse(oldReviewJSON);
  ghibliData = oldData;
}

function saveData(event) {
  const newReview = JSON.stringify(ghibliData);
  localStorage.setItem('ghibli-local-storage', newReview);
}

window.addEventListener('beforeunload', saveData);
