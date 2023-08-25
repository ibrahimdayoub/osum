import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import supportsService from './supportsService'

//Get supports information from localStorage
const supports = JSON.parse(localStorage.getItem('supports'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  supports: supports?.length > 0 ? supports : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Support
export const addSupport = createAsyncThunk(
  'supports/addSupport',
  async (data, thunkAPI) => {
    try {
      const response = await supportsService.addSupport(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Supports
export const getSupports = createAsyncThunk(
  'supports/getSupports',
  async (_, thunkAPI) => {
    try {
      const response = await supportsService.getSupports()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Support
export const updateSupport = createAsyncThunk(
  'supports/updateSupport',
  async (data, thunkAPI) => {
    try {
      const response = await supportsService.updateSupport(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Support
export const deleteSupport = createAsyncThunk(
  'supports/deleteSupport',
  async (data, thunkAPI) => {
    try {
      const response = await supportsService.deleteSupport(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const supportsSlice = createSlice({
  name: 'supports',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.supports = supports?.length > 0 ? supports : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSupport.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addSupport"
        state.message = null
        state.errors = null
      })
      .addCase(addSupport.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.supports
        arr.push((action.payload)[0].support)
        state.supports = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addSupport.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getSupports.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getSupports"
        state.message = null
        state.errors = null
      })
      .addCase(getSupports.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.supports = (action.payload)[0].supports
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getSupports.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.supports = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateSupport.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateSupport"
        state.message = null
        state.errors = null
      })
      .addCase(updateSupport.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.supports.map((support)=>{
          if (support._id === (action.payload)[0].support._id){
            return (action.payload)[0].support
          }
          else{
            return support
          }
        })
        state.supports = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateSupport.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteSupport.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteSupport"
        state.message = null
        state.errors = null
      })
      .addCase(deleteSupport.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        //
        let arr = state.supports.filter(support => {
          return support._id !== (action.payload)[0].support._id
        })
        state.supports = arr
        //
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteSupport.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = supportsSlice.actions
export default supportsSlice.reducer