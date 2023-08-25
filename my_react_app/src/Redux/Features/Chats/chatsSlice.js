import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import chatsService from './chatsService'

//Get chats information from localStorage
const chats = JSON.parse(localStorage.getItem('chats'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  chats: chats?.length > 0 ? chats : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Get Chats
export const getChats = createAsyncThunk(
  'chats/getChats',
  async (_, thunkAPI) => {
    try {
      const response = await chatsService.getChats()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Create Group
export const createGroup = createAsyncThunk(
  'chats/createGroup',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.createGroup(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Group
export const updateGroup = createAsyncThunk(
  'chats/updateGroup',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.updateGroup(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Leave Group
export const leaveGroup = createAsyncThunk(
  'chats/leaveGroup',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.leaveGroup(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Access Chat
export const accessChat = createAsyncThunk(
  'chats/accessChat',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.accessChat(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Leave Chat
export const leaveChat = createAsyncThunk(
  'chats/leaveChat',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.leaveChat(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Chat
export const deleteChat = createAsyncThunk(
  'chats/deleteChat',
  async (data, thunkAPI) => {
    try {
      const response = await chatsService.deleteChat(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.chats = chats?.length > 0 ? chats : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
    addChat: (state, action) => {
      state.chats = [action.payload.chat, ...state.chats]
    },
    reSortChats: (state, action) => {
      let chats = state.chats.filter((chat) => {
        return chat._id !== action.payload.chat_id
      })

      let chat = {
        ...state.chats.filter((chat) => {
          return chat._id === action.payload.chat_id
        })[0]
      }

      state.chats = [chat, ...chats]
    },
    addChatLatestMeassage: (state, action) => {
      let chats = state.chats.filter((chat) => {
        return chat._id !== action.payload.message.chat_id
      })

      let chat = (state.chats.filter((chat) => {
        return chat._id === action.payload.message.chat_id
      }))[0]

      chat = {
        ...chat,
        counter: +chat.counter + 1,
        latest_message: action.payload.message
      }

      state.chats = [chat, ...chats]
    },
    resetSpecificChatCounter: (state, action) => {
      let chats = state.chats.filter((chat) => {
        return chat._id !== action.payload.chat.chat_id
      })

      let chat = (state.chats.filter((chat) => {
        return chat._id === action.payload.chat.chat_id
      }))[0]

      chat = {
        ...chat,
        counter: 0,
      }
      state.chats = [chat, ...chats]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getChats"
        state.message = null
        state.errors = null
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.chats = (action.payload)[0].chats
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getChats.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.chats = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "createGroup"
        state.message = null
        state.errors = null
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.chats = [(action.payload)[0].chat, ...state.chats] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateGroup.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateGroup"
        state.message = null
        state.errors = null
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let chats = state.chats.filter((chat) => {
          return chat._id !== (action.payload)[0].chat._id
        })
        let chat = (action.payload)[0].chat
        state.chats = [chat, ...chats] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveGroup.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "leaveGroup"
        state.message = null
        state.errors = null
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let chats = state.chats.filter((chat) => {
          return chat._id !== (action.payload)[0].chat._id
        })
        state.chats = chats
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(accessChat.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "accessChat"
        state.message = null
        state.errors = null
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let chats = state.chats.filter((chat) => {
          return chat._id !== (action.payload)[0].chat._id
        })
        let chat = (action.payload)[0].chat
        state.chats = [chat, ...chats] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveChat.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "leaveChat"
        state.message = null
        state.errors = null
      })
      .addCase(leaveChat.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let chats = state.chats.filter((chat) => {
          return chat._id !== (action.payload)[0].chat._id
        })
        state.chats = chats
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveChat.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteChat"
        state.message = null
        state.errors = null
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let chats = state.chats.filter((chat) => {
          return chat._id !== (action.payload)[0].chat._id
        })
        state.chats = chats
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset, addChat, reSortChats, addChatLatestMeassage, resetSpecificChatCounter } = chatsSlice.actions
export default chatsSlice.reducer