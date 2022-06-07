'use strict'

// This is the global list of the stories, an instance of StoryList
let storyList

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart () {
  storyList = await StoryList.getStories()
  $storiesLoadingMsg.remove()

  putStoriesOnPage()
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup (story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName()
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <div class="fav-button"></div>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <div class="delete-button">
          <i class="fa fa-trash"></i>
        </div>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `)
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage () {
  console.debug('putStoriesOnPage')

  $allStoriesList.empty()

  // loop through all of our stories and generate HTML for them
  for (const story of storyList.stories) {
    const $story = generateStoryMarkup(story)
    $allStoriesList.append($story)
  }

  $('.delete-button').hide()
  $('.fav-button').hide()
  $allStoriesList.show()
}

// put favorites on page
function putFavsOnPage () {
  console.debug('putFavsOnPage')

  $favStoriesList.empty()

  // loop through all of user's favorites and generate HTML for them
  if (currentUser.favorites.length !== 0) {
    for (const story of currentUser.favorites) {
      const $story = generateStoryMarkup(story)
      $favStoriesList.append($story)
    }
  } else {
    $favStoriesList.append('<h4>You do not have any favorite stories yet!</h4>')
  }

  $('.delete-button').hide()
  markFavorites()
  $favStoriesList.show()
}

// put user's own stories on page
function putOwnOnPage () {
  console.debug('putOwnOnPage')

  $ownStoriesList.empty()

  // loop through all of user's own stories and generate HTML for them
  if (currentUser.ownStories.length !== 0) {
    for (const story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story)
      $ownStoriesList.append($story)
    }
  } else {
    $ownStoriesList.append('<h4>You have not submitted any stories yet!</h4>')
  }

  $('.delete-button').show()
  markFavorites()
  $ownStoriesList.show()
}

// submit a new story
async function submitStory (evt) {
  console.debug('submitStory')
  evt.preventDefault()

  const storyObj = {
    title: $('#submit-title').val(),
    author: $('#submit-author').val(),
    url: $('#submit-url').val()
  }
  await storyList.addStory(currentUser, storyObj)

  $submitForm.hide()
  $submitForm.trigger('reset')
  putOwnOnPage()
}

$submitForm.on('submit', submitStory)

// remove a story created by user
async function removeStory (evt) {
  console.debug('removeStory')

  const storyId = $(evt.target).closest('li').attr('id')
  await storyList.removeStory(currentUser, storyId)

  putOwnOnPage()
}

$allLists.on('click', '.delete-button', removeStory)

// update favorites on click
async function toggleFavorite (evt) {
  console.debug('toggleFavorite', evt)

  const storyId = $(evt.target).closest('li').attr('id')

  if (currentUser) {
    console.log($(evt.target))
    if (!($(evt.target).hasClass('favorite'))) {
      currentUser = await User.addFavorite(currentUser.username, currentUser.loginToken, storyId)
      $(evt.target).addClass('favorite')
    } else {
      currentUser = await User.removeFavorite(currentUser.username, currentUser.loginToken, storyId)
      $(evt.target).removeClass('favorite')
      if ($(evt.target).closest('ol').attr('id') === 'fav-stories-list') {
        putFavsOnPage()
      }
    }
  }
}

$body.on('click', '.fav-button', toggleFavorite)

// retrieve user favorites & sync with ui
async function markFavorites () {
  console.debug('markFavorites')

  if (currentUser) {
    currentUser.favorites.forEach(fav => {
      $allLists
        .find('li#' + fav.storyId)
        .children('.fav-button')
        .addClass('favorite')
    })
    $('.fav-button').show()
  }
}
