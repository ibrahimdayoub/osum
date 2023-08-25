import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

//Get auth information from localStorage
const auth = JSON.parse(localStorage.getItem('auth'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  auth: auth ? { user: auth.user, token: auth.token } : null,
  message: auth ? auth.message : null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Sign In
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data, thunkAPI) => {
    try {
      //const auth = thunkAPI.getState().auth;
      const response = await authService.signIn(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Sign Out
export const signOut = createAsyncThunk(
  'auth/SignOut',
  async (_, thunkAPI) => {
    try {
      const response = await authService.SignOut()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Sign Up
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, thunkAPI) => {
    try {
      const response = await authService.signUp(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, thunkAPI) => {
    try {
      const response = await authService.resetPassword(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.auth = auth ? { user: auth.user, token: auth.token } : null
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
    },
    set: (state, data) => {
      const auth = (JSON.parse(localStorage.getItem('auth')));
      if (data.payload.operation === "updateUser") {
        localStorage.setItem('auth', JSON.stringify({ ...auth, user: data.payload.user }))
        state.auth = { user: data.payload.user, token: auth.token }
      }
      else if (data.payload.operation === "deleteUser") {
        localStorage.removeItem('auth')
        state.isLoading = null
        state.isSuccess = null
        state.isError = null
        state.auth = null
        state.message = null
        state.errors = null
        state.status = null
        state.operation = null
        state.time = null
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "signIn"
        state.message = null
        state.errors = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.auth = { user: (action.payload)[0].user, token: (action.payload)[0].token }
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.auth = null
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(signOut.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "signOut"
        state.message = null
        state.errors = null
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.auth = null
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "signUp"
        state.message = null
        state.errors = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.auth = { user: (action.payload)[0].user, token: (action.payload)[0].token }
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.auth = null
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "forgotPassword"
        state.message = null
        state.errors = null
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "resetPassword"
        state.message = null
        state.errors = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset, set } = authSlice.actions
export default authSlice.reducer