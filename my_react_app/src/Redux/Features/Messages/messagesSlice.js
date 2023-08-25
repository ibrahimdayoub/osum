import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import messagesService from './messagesService'

//Get messages information from localStorage
const messages = JSON.parse(localStorage.getItem('messages'))
const messagesCounter = localStorage.getItem('messages-counter')
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  messages: messages?.length > 0 ? messages : [],
  counter: messagesCounter ? messagesCounter : 0, //All chats
  chatCounter: 0, //Open chat
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Get Chat Messages
export const getChatMessages = createAsyncThunk(
  'messages/getChatMessages',
  async (data, thunkAPI) => {
    try {
      const response = await messagesService.getChatMessages(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Add Message
export const addMessage = createAsyncThunk(
  'messages/addMessage',
  async (data, thunkAPI) => {
    try {
      const response = await messagesService.addMessage(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Messages Counter
export const getMessagesCounter = createAsyncThunk(
  'messages/getMessagesCounter',
  async (_, thunkAPI) => {
    try {
      const response = await messagesService.getMessagesCounter()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.messages = messages?.length > 0 ? messages : []
      state.counter = messagesCounter ? messagesCounter : 0 //All chats
      state.chatCounter = 0 //Open chat
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
    addChatMessage: (state, action) => {
      state.counter = +state.counter ? +state.counter + 1 : 1
      if (state.messages.length !== 0 && state.messages[0]?.chat_id === action.payload.message.chat_id) {
        state.messages = [...state.messages, action.payload.message]
        state.chatCounter = +state.chatCounter ? +state.chatCounter + 1 : 1
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatMessages.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getChatMessages"
        state.message = null
        state.errors = null
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.messages = (action.payload)[0].messages
        state.counter = +state.counter + (action.payload)[0].counter
        state.chatCounter = 0
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.messages = []
        state.chatCounter = 0
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addMessage.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addMessage"
        state.message = null
        state.errors = null
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.messages = [...state.messages, (action.payload)[0].message_] //Lastest one
        state.counter = +state.counter - +state.chatCounter < 0 ? 0 : +state.counter - +state.chatCounter
        state.chatCounter = 0
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.counter = 0
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getMessagesCounter.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getMessagesCounter"
        state.message = null
        state.errors = null
      })
      .addCase(getMessagesCounter.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.counter = (action.payload)[0].counter
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getMessagesCounter.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.counter = 0
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset, addChatMessage } = messagesSlice.actions
export default messagesSlice.reducer