import axios from 'axios'

//Add Comment
const addComment = async (data) => {
  const response = await axios.post('/api/comments/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let comments = JSON.parse(localStorage.getItem('comments'))
    if (!comments || comments.length === 0) {
      let arr = [response.data.comment]
      localStorage.setItem('comments', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.comment, ...comments]
      localStorage.setItem('comments', JSON.stringify(arr))
    }
  }
  return response
}
//Get Comments
const getComments = async (data) => {
  localStorage.setItem('comments', JSON.stringify([]))
  const response = await axios.post('/api/comments/get', data)
  if (response.data) {
    localStorage.setItem('comments', JSON.stringify(response.data.comments))
  }
  return response
}
//Update Comment
const updateComment = async ({ id, data }) => {
  const response = await axios.put('/api/comments/update/' + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let comments = JSON.parse(localStorage.getItem('comments'))
    if (!comments || comments.length === 0) {
      let comments = [response.data.comment]
      localStorage.setItem('comments', JSON.stringify(comments))
    }
    else {
      comments = comments.map(comment => {
        if (comment._id === response.data.comment._id) {
          return response.data.comment
        }
        else {
          return comment
        }
      })
      localStorage.setItem('comments', JSON.stringify(comments))
    }
  }
  return response
}
//Delete Comment
const deleteComment = async ({ id }) => {
  const response = await axios.delete('/api/comments/delete/' + id)
  if (response.data) {
    let comments = JSON.parse(localStorage.getItem('comments'))
    if (!comments || comments.length === 0) {
      let comments = []
      localStorage.setItem('comments', JSON.stringify(comments))
    }
    else {
      comments = comments.filter(comment => {
        return comment._id !== response.data.comment._id
      })
      localStorage.setItem('comments', JSON.stringify(comments))
    }
  }
  return response
}
//Like Comment
const likeComment = async ({ id }) => {
  const response = await axios.put('/api/comments/like/' + id)
  if (response.data) {
    let comments = JSON.parse(localStorage.getItem('comments'))
    if (!comments || comments.length === 0) {
      let comments = [response.data.comment]
      localStorage.setItem('comments', JSON.stringify(comments))
    }
    else {
      comments = comments.map(comment => {
        if (comment._id === response.data.comment._id) {
          return response.data.comment
        }
        else {
          return comment
        }
      })
      localStorage.setItem('comments', JSON.stringify(comments))
    }
  }
  return response
}
const commentsService = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
}

export default commentsService