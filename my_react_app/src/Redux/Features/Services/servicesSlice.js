import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import servicesService from './servicesService'

//Get services information from localStorage
const services = JSON.parse(localStorage.getItem('services'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  services: services?.length > 0 ? services : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Service
export const addService = createAsyncThunk(
  'services/addService',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.addService(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Services
export const getServices = createAsyncThunk(
  'services/getServices',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.getServices(data) //data=location_target_id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Service
export const updateService = createAsyncThunk(
  'services/updateService',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.updateService(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Service
export const likeService = createAsyncThunk(
  'services/likeService',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.likeService(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Service
export const getService = createAsyncThunk(
  'services/getService',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.getService(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Service
export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.deleteService(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Search Services
export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (data, thunkAPI) => {
    try {
      const response = await servicesService.searchServices(data) //data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Services
export const getDashboardServices = createAsyncThunk(
  'services/getDashboardServices',
  async (_, thunkAPI) => {
    try {
      const response = await servicesService.getDashboardServices()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)

export const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.services = services?.length > 0 ? services : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addService.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addService"
        state.message = null
        state.errors = null
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.services = [(action.payload)[0].service, ...state.services]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addService.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getServices.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getServices"
        state.message = null
        state.errors = null
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.services = (action.payload)[0].services
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getServices.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.services = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateService.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateService"
        state.message = null
        state.errors = null
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let services = state.services.filter((service) => {
          return service._id !== (action.payload)[0].service._id
        })
        let service = (action.payload)[0].service
        state.services = [service, ...services] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getService.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getService"
        state.message = null
        state.errors = null
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.services.map(service => {
          if (service._id === (action.payload)[0].service._id) {
            return (action.payload)[0].service
          }
          else {
            return service
          }
        })
        state.services = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getService.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeService.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likeService"
        state.message = null
        state.errors = null
      })
      .addCase(likeService.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.services.map(service => {
          if (service._id === (action.payload)[0].service._id) {
            return (action.payload)[0].service
          }
          else {
            return service
          }
        })
        state.services = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeService.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteService"
        state.message = null
        state.errors = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.services.filter(service => {
          return service._id !== (action.payload)[0].service._id
        })
        state.services = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchServices.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "searchServices"
        state.message = null
        state.errors = null
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.services = (action.payload)[0].services
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.services = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardServices.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardServices"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.services = (action.payload)[0].services
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardServices.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.services = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = servicesSlice.actions
export default servicesSlice.reducer