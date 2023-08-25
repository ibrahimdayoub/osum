import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import teamsService from './teamsService'

//Get teams information from localStorage
const teams = JSON.parse(localStorage.getItem('teams'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  teams: teams?.length > 0 ? teams : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Team
export const addTeam = createAsyncThunk(
  'teams/addTeam',
  async (data, thunkAPI) => {
    try {
      const response = await teamsService.addTeam(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Teams
export const getTeams = createAsyncThunk(
  'teams/getTeams',
  async (_, thunkAPI) => {
    try {
      const response = await teamsService.getTeams()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Team
export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async (data, thunkAPI) => {
    try {
      const response = await teamsService.updateTeam(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Team
export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (data, thunkAPI) => {
    try {
      const response = await teamsService.deleteTeam(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Team
export const getTeam = createAsyncThunk(
  'teams/getTeam',
  async (data, thunkAPI) => {
    try {
      const response = await teamsService.getTeam(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Leave Team
export const leaveTeam = createAsyncThunk(
  'teams/leaveTeam',
  async (data, thunkAPI) => {
    try {
      const response = await teamsService.leaveTeam(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Teams
export const getDashboardTeams = createAsyncThunk(
  'teams/getDashboardTeams',
  async (_, thunkAPI) => {
    try {
      const response = await teamsService.getDashboardTeams()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.teams = teams?.length > 0 ? teams : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTeam.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addTeam"
        state.message = null
        state.errors = null
      })
      .addCase(addTeam.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.teams = [(action.payload)[0].team, ...state.teams]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addTeam.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTeams.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getTeams"
        state.message = null
        state.errors = null
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.teams = (action.payload)[0].teams
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.teams = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateTeam"
        state.message = null
        state.errors = null
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let teams = state.teams.filter((team) => {
          return team._id !== (action.payload)[0].team._id
        })
        let team = (action.payload)[0].team
        state.teams = [team, ...teams] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteTeam"
        state.message = null
        state.errors = null
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.teams.filter(team => {
          return team._id !== (action.payload)[0].team._id
        })
        state.teams = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTeam.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getTeam"
        state.message = null
        state.errors = null
      })
      .addCase(getTeam.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.teams.map(team => {
          if (team._id === (action.payload)[0].team._id) {
            return (action.payload)[0].team
          }
          else {
            return team
          }
        })
        state.teams = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveTeam.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "leaveTeam"
        state.message = null
        state.errors = null
      })
      .addCase(leaveTeam.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let teams = state.teams.filter((team) => {
          return team._id !== (action.payload)[0].team._id
        })
        state.teams = teams
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(leaveTeam.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardTeams.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardTeams"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardTeams.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.teams = (action.payload)[0].teams
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardTeams.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.teams = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = teamsSlice.actions
export default teamsSlice.reducer