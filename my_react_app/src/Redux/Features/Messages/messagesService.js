import axios from 'axios'

//Get Chat Messages
const getChatMessages = async ({chat_id}) => {
  localStorage.setItem('messages', JSON.stringify([]))
  if(chat_id)
  {
    const response = await axios.get('/api/messages/get/'+chat_id)
    if (response.data) {
      localStorage.setItem('messages', JSON.stringify(response.data.messages))
    }
    return response
  }
}
//Add Message
const addMessage = async ({data}) => {
  const response = await axios.post('/api/messages/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let messages = JSON.parse(localStorage.getItem('messages'))
    if(!messages)
    {
      messages = []
    }
    messages = [response.data.message_,...messages] //Latest one
    localStorage.setItem('messages', JSON.stringify(messages))
  }
  return response
}
//Get Messages Counter
const getMessagesCounter = async () => { 
  localStorage.setItem('messages-counter', 0)
  const response = await axios.get('/api/messages/counter')
  if (response.data) {
    localStorage.setItem('messages-counter', response.data.counter)
  }
  return response
}
const chatsService = {
  getChatMessages,
  addMessage,
  getMessagesCounter
}

export default chatsService