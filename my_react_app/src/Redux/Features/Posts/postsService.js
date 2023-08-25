import axios from 'axios'

//Add Post
const addPost = async (data) => {
  const response = await axios.post('/api/posts/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let posts = JSON.parse(localStorage.getItem('posts'))
    if (!posts || posts.length === 0) {
      let arr = [response.data.post]
      localStorage.setItem('posts', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.post, ...posts]
      localStorage.setItem('posts', JSON.stringify(arr))
    }
  }
  return response
}
//Get Posts
const getPosts = async (data) => {
  localStorage.setItem('posts', JSON.stringify([]))
  const response = await axios.post('/api/posts/get', data)
  if (response.data) {
    localStorage.setItem('posts', JSON.stringify(response.data.posts))
  }
  return response
}
//Update Post
const updatePost = async ({ id, data }) => {
  const response = await axios.put('/api/posts/update/' + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let posts = JSON.parse(localStorage.getItem('posts'))
    if (!posts || posts.length === 0) {
      let posts = [response.data.post]
      localStorage.setItem('posts', JSON.stringify(posts))
    }
    else {
      posts = posts.map(post => {
        if (post._id === response.data.post._id) {
          return response.data.post
        }
        else {
          return post
        }
      })
      localStorage.setItem('posts', JSON.stringify(posts))
    }
  }
  return response
}
//Delete Post
const deletePost = async ({ id }) => {
  const response = await axios.delete('/api/posts/delete/' + id)
  if (response.data) {
    let posts = JSON.parse(localStorage.getItem('posts'))
    if (!posts || posts.length === 0) {
      let posts = []
      localStorage.setItem('posts', JSON.stringify(posts))
    }
    else {
      posts = posts.filter(post => {
        return post._id !== response.data.post._id
      })
      localStorage.setItem('posts', JSON.stringify(posts))
    }
  }
  return response
}
//Like Post
const likePost = async ({ id }) => {
  const response = await axios.put('/api/posts/like/' + id)
  if (response.data) {
    let posts = JSON.parse(localStorage.getItem('posts'))
    if (!posts || posts.length === 0) {
      let posts = [response.data.post]
      localStorage.setItem('posts', JSON.stringify(posts))
    }
    else {
      posts = posts.map(post => {
        if (post._id === response.data.post._id) {
          return response.data.post
        }
        else {
          return post
        }
      })
      localStorage.setItem('posts', JSON.stringify(posts))
    }
  }
  return response
}
//Get Post
const getPost = async ({ id }) => {
  const response = await axios.get('/api/posts/get/' + id)
  if (response.data) {
    let posts = JSON.parse(localStorage.getItem('posts'))
    if (!posts || posts.length === 0) {
      let posts = [response.data.post]
      localStorage.setItem('posts', JSON.stringify(posts))
    }
    else {
      posts = posts.map(post => {
        if (post._id === response.data.post._id) {
          return response.data.post
        }
        else {
          return post
        }
      })
      localStorage.setItem('posts', JSON.stringify(posts))
    }
  }
  return response
}
//Search Post
const searchPosts = async ({ key }) => {
  localStorage.setItem('posts', JSON.stringify([]))
  const response = await axios.get('/api/posts/search?key=' + key)
  if (response.data) {
    localStorage.setItem('posts', JSON.stringify(response.data.posts))
  }
  return response
}
//Get Dashboard Posts
const getDashboardPosts = async () => {
  localStorage.setItem('posts', JSON.stringify([]))
  const response = await axios.get('/api/posts/dashboard-posts')
  if (response.data) {
    localStorage.setItem('posts', JSON.stringify(response.data.posts))
  }
  return response
}
const postsService = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  getPost,
  searchPosts,
  getDashboardPosts
}
export default postsService