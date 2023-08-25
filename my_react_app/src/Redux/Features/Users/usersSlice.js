import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usersService from './usersService'

//Get users information from localStorage
const users = JSON.parse(localStorage.getItem('users'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  users: users?.length > 0 ? users : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Update User
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.updateUser(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Visit User
export const visitUser = createAsyncThunk(
  'users/visitUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.visitUser(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Rate User
export const rateUser = createAsyncThunk(
  'users/rateUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.rateUser(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete User
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.deleteUser(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get User
export const getUser = createAsyncThunk(
  'users/getUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.getUser(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Search Users
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.searchUsers(data) //data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Add Admin
export const addAdmin = createAsyncThunk(
  'users/addAdmin',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.addAdmin(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Block User
export const blockUser = createAsyncThunk(
  'users/blockUser',
  async (data, thunkAPI) => {
    try {
      const response = await usersService.blockUser(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Users
export const getDashboardUsers = createAsyncThunk(
  'users/getDashboardUsers',
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getDashboardUsers()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.users = users?.length > 0 ? users : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateUser"
        state.message = null
        state.errors = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.users.filter(user => {
          return user._id !== (action.payload)[0].user._id
        })
        arr.push((action.payload)[0].user)
        state.users = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(visitUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "visitUser"
        state.message = null
        state.errors = null
      })
      .addCase(visitUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.users.filter(user => {
          return user._id !== (action.payload)[0].user._id
        })
        arr.push((action.payload)[0].user)
        state.users = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(visitUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(rateUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "rateUser"
        state.message = null
        state.errors = null
      })
      .addCase(rateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.users.filter(user => {
          return user._id !== (action.payload)[0].user._id
        })
        arr.push((action.payload)[0].user)
        state.users = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(rateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteUser"
        state.message = null
        state.errors = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.users.filter(user => {
          return user._id !== (action.payload)[0].user._id
        })
        state.users = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getUser"
        state.message = null
        state.errors = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const userExixts = state.users.find((user) => {
          return user._id === (action.payload)[0].user._id
        })
        if (userExixts) {
          let arr = state.users.map(user => {
            if (user._id === (action.payload)[0].user._id) {
              return (action.payload)[0].user
            }
            else {
              return user
            }
          })
          state.users = arr
        }
        else {
          state.users = [(action.payload)[0].user, ...state.users]
        }
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "searchUsers"
        state.message = null
        state.errors = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = (action.payload)[0].users
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.users = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addAdmin.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addAdmin"
        state.message = null
        state.errors = null
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(blockUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "blockUser"
        state.message = null
        state.errors = null
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.users.map(user => {
          if (user._id === (action.payload)[0].user._id) {
            return (action.payload)[0].user
          }
          else {
            return user
          }
        })
        state.users = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardUsers.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardUsers"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = (action.payload)[0].users
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.users = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = usersSlice.actions
export default usersSlice.reducer