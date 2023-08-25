import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import companiesService from './companiesService'

//Get companies information from localStorage
const companies = JSON.parse(localStorage.getItem('companies'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  companies: companies?.length > 0 ? companies : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Company
export const addCompany = createAsyncThunk(
  'companies/addCompany',
  async (data, thunkAPI) => {
    try {
      const response = await companiesService.addCompany(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Company
export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async (data, thunkAPI) => {
    try {
      const response = await companiesService.updateCompany(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Company
export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (data, thunkAPI) => {
    try {
      const response = await companiesService.deleteCompany(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Company
export const likeCompany = createAsyncThunk(
  'companies/likeCompany',
  async (data, thunkAPI) => {
    try {
      const response = await companiesService.likeCompany(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Company
export const getCompany = createAsyncThunk(
  'companies/getCompany',
  async (data, thunkAPI) => {
    try {
      const response = await companiesService.getCompany(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.companies = companies?.length > 0 ? companies : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCompany.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addCompany"
        state.message = null
        state.errors = null
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.companies = [(action.payload)[0].company, ...state.companies]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateCompany"
        state.message = null
        state.errors = null
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.companies.map(company => {
          if (company._id === (action.payload)[0].company._id) {
            return (action.payload)[0].company
          }
          else {
            return company
          }
        })
        state.companies = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteCompany.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteCompany"
        state.message = null
        state.errors = null
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.companies.filter(company => {
          return company._id !== (action.payload)[0].company._id
        })
        state.companies = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeCompany.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likeCompany"
        state.message = null
        state.errors = null
      })
      .addCase(likeCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.companies.map(company => {
          if (company._id === (action.payload)[0].company._id)
          {
            return (action.payload)[0].company
          }
          else{
            return company
          }
        })
        state.companies = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getCompany.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getCompany"
        state.message = null
        state.errors = null
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const companyExixts = state.companies.find((company)=>{
          return company._id === (action.payload)[0].company._id
        })
        if (companyExixts)
        {
          let arr = state.companies.map(company => {
            if (company._id === (action.payload)[0].company._id) {
              return (action.payload)[0].company
            }
            else {
              return company
            }
          })
          state.companies = arr
        }
        else{
          state.companies = [(action.payload)[0].company, ...state.companies]
        }
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = companiesSlice.actions
export default companiesSlice.reducer