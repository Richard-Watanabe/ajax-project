var $form = document.querySelector('form');

$form.addEventListener('submit', findMovie);

function findMovie(event) {
  event.preventDefault();
  // var selectedTitle = $form.elements.title.value;
  // console.log(selectedTitle);
  $form.reset();
}
