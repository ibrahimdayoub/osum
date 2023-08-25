import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import notificationsService from './notificationsService'

//Get notifications information from localStorage
const notifications = JSON.parse(localStorage.getItem('notifications'))
const notificationsCounter = localStorage.getItem('notifications-counter')
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  notifications: notifications?.length > 0 ? notifications : [],
  counter: notificationsCounter ? notificationsCounter : 0,
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Get Notifications
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.getNotifications()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Notifications Counter
export const getNotificationsCounter = createAsyncThunk(
  'notifications/getNotificationsCounter',
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.getNotificationsCounter()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (data, thunkAPI) => {
    try {
      const response = await notificationsService.deleteNotification(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.notifications = notifications?.length > 0 ? notifications : []
      state.counter = notificationsCounter ? notificationsCounter : 0
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
    resetCounter: (state) => {
      state.counter = 0
    },
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload.notification]
      state.counter = +state.counter + 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getNotifications"
        state.message = null
        state.errors = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.notifications = (action.payload)[0].notifications
        state.counter = (action.payload)[0].counter
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.notifications = []
        state.counter = 0
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getNotificationsCounter.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getNotificationsCounter"
        state.message = null
        state.errors = null
      })
      .addCase(getNotificationsCounter.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.counter = (action.payload)[0].counter
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getNotificationsCounter.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.counter = 0
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteNotification"
        state.message = null
        state.errors = null
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.notifications.filter(notification => {
          return notification._id !== (action.payload)[0].notification._id
        })
        state.notifications = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset, resetCounter, addNotification } = notificationsSlice.actions
export default notificationsSlice.reducer