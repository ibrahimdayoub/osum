import axios from 'axios'

//Add Story
const addStory = async (data) => {
  const response = await axios.post('/api/stories/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let stories = JSON.parse(localStorage.getItem('stories'))
    if (!stories || stories.length === 0) {
      let arr = [response.data.story]
      localStorage.setItem('stories', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.story, ...stories]
      localStorage.setItem('stories', JSON.stringify(arr))
    }
  }
  return response
}
//Get Stories
const getStories = async (data) => {
  localStorage.setItem('stories', JSON.stringify([]))
  const response = await axios.post('/api/stories/get', data)
  if (response.data) {
    localStorage.setItem('stories', JSON.stringify(response.data.stories))
  }
  return response
}
//Delete Story
const deleteStory = async ({ id }) => {
  const response = await axios.delete('/api/stories/delete/' + id)
  if (response.data) {
    let stories = JSON.parse(localStorage.getItem('stories'))
    if (!stories || stories.length === 0) {
      let stories = []
      localStorage.setItem('stories', JSON.stringify(stories))
    }
    else {
      stories = stories.filter(story => {
        return story._id !== response.data.story._id
      })
      localStorage.setItem('stories', JSON.stringify(stories))
    }
  }
  return response
}
//Get Story
const getStory = async ({ id }) => {
  const response = await axios.get('/api/stories/get/' + id)
  if (response.data) {
    let stories = JSON.parse(localStorage.getItem('stories'))
    if (!stories || stories.length === 0) {
      let stories = [response.data.story]
      localStorage.setItem('stories', JSON.stringify(stories))
    }
    else {
      stories = stories.map(story => {
        if (story._id === response.data.story._id) {
          return response.data.story
        }
        else {
          return story
        }
      })
      localStorage.setItem('stories', JSON.stringify(stories))
    }
  }
  return response
}
//Like Story
const likeStory = async ({ id }) => {
  const response = await axios.put('/api/stories/like/' + id)
  if (response.data) {
    let stories = JSON.parse(localStorage.getItem('stories'))
    if (!stories || stories.length === 0) {
      let stories = [response.data.story]
      localStorage.setItem('stories', JSON.stringify(stories))
    }
    else {
      stories = stories.map(story => {
        if (story._id === response.data.story._id) {
          return response.data.story
        }
        else {
          return story
        }
      })
      localStorage.setItem('stories', JSON.stringify(stories))
    }
  }
  return response
}
const storiesService = {
  addStory,
  getStories,
  deleteStory,
  getStory,
  likeStory
}
export default storiesService