import axios from 'axios'

//Get Chats
const getChats = async () => {
  localStorage.setItem('chats', JSON.stringify([]))
  const response = await axios.get('/api/chats/get')
  if (response.data) {
    localStorage.setItem('chats', JSON.stringify(response.data.chats))
  }
  return response
}
//Create Group
const createGroup = async (data) => {
  const response = await axios.post('/api/chats/create-group', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats) {
      chats = []
    }
    chats = [response.data.chat, ...chats] //First one
    localStorage.setItem('chats', JSON.stringify(chats))
  }
  return response
}
//Update Group
const updateGroup = async ({id,data}) => {
  console.log(id,data)
  const response = await axios.put('/api/chats/update-group/'+id, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats || chats.length === 0) {
      chats = [response.data.chat] //First one
      localStorage.setItem('chats', JSON.stringify(chats))
    }
    else {
      chats = chats.filter((chat) => {
        return chat._id !== response.data.chat._id
      })
      chats = [response.data.chat, ...chats] //First one
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }
  return response
}
//Leave Group
const leaveGroup = async ({id,data}) => {
  console.log(id,data)
  const response = await axios.put('/api/chats/leave-group/'+id, data)
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats || chats.length === 0) {
      chats = []
      localStorage.setItem('chats', JSON.stringify(chats))
    }
    else {
      chats = chats.filter((chat) => {
        return chat._id !== response.data.chat._id
      })
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }
  return response
}
//Access Chat
const accessChat = async (data) => {
  const response = await axios.post('/api/chats/access-chat', data)
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats || chats.length === 0) {
      chats = [response.data.chat] //First one
      localStorage.setItem('chats', JSON.stringify(chats))
    }
    else {
      chats = chats.filter((chat) => {
        return chat._id !== response.data.chat._id
      })
      chats = [response.data.chat, ...chats] //First one
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }
  return response
}
//Leave Chat
const leaveChat = async ({id,data}) => {
  console.log(id,data)
  const response = await axios.put('/api/chats/leave-chat/'+id, data)
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats || chats.length === 0) {
      chats = []
      localStorage.setItem('chats', JSON.stringify(chats))
    }
    else {
      chats = chats.filter((chat) => {
        return chat._id !== response.data.chat._id
      })
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }
  return response
}
//Delete Chat
const deleteChat = async ({chat_id}) => {
  const response = await axios.delete('/api/chats/delete/'+chat_id)
  if (response.data) {
    let chats = JSON.parse(localStorage.getItem('chats'))
    if (!chats || chats.length === 0) {
      chats = []
      localStorage.setItem('chats', JSON.stringify(chats))
    }
    else {
      chats = chats.filter((chat) => {
        return chat._id !== response.data.chat._id
      })
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }
  return response
}
const chatsService = {
  getChats,
  createGroup,
  updateGroup,
  leaveGroup,
  accessChat,
  leaveChat,
  deleteChat
}

export default chatsService