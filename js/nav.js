'use strict'

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories (evt) {
  console.debug('navAllStories', evt)
  hidePageComponents()
  putStoriesOnPage()
  markFavorites()
}

$body.on('click', '#nav-all', navAllStories)

// handle favorites nav click
function navFavStories (evt) {
  console.debug('navFavStories', evt)
  hidePageComponents()
  putFavsOnPage()
}

$body.on('click', '#nav-favorites', navFavStories)

// handle my stories nav click
function navOwnStories (evt) {
  console.debug('navOwnStories', evt)
  hidePageComponents()
  putOwnOnPage()
}

$body.on('click', '#nav-own', navOwnStories)

// show submit nav click
function navSubmitClick (evt) {
  console.debug('navSubmitClick', evt)
  hidePageComponents()
  $submitForm.show()
}

$navSubmit.on('click', navSubmitClick)

/** Show login/signup on click on "login" */

function navLoginClick (evt) {
  console.debug('navLoginClick', evt)
  hidePageComponents()
  $loginForm.show()
  $signupForm.show()
}

$navLogin.on('click', navLoginClick)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin () {
  console.debug('updateNavOnLogin')
  $('.main-nav-links').show()
  $navLogin.hide()
  $navLogOut.show()
  $navUserProfile.text(`${currentUser.username}`).show()
  $navSubmit.show()
  $navFavorites.show()
  $navOwn.show()
  markFavorites()
}
