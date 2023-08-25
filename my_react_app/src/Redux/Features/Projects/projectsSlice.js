import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import projectsService from './projectsService'

//Get projects information from localStorage
const projects = JSON.parse(localStorage.getItem('projects'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  projects: projects?.length > 0 ? projects : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Project
export const addProject = createAsyncThunk(
  'projects/addProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.addProject(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Projects
export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.getProjects(data) //data=location_target_id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.updateProject(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Complete Project
export const completeProject = createAsyncThunk(
  'projects/completeProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.completeProject(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Retreat Project
export const retreatProject = createAsyncThunk(
  'projects/retreatProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.retreatProject(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Project
export const likeProject = createAsyncThunk(
  'projects/likeProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.likeProject(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Project
export const getProject = createAsyncThunk(
  'projects/getProject',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.getProject(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Search Projects
export const searchProjects = createAsyncThunk(
  'projects/searchProjects',
  async (data, thunkAPI) => {
    try {
      const response = await projectsService.searchProjects(data) //data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Projects
export const getDashboardProjects = createAsyncThunk(
  'projects/getDashboardProjects',
  async (_, thunkAPI) => {
    try {
      const response = await projectsService.getDashboardProjects()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.projects = projects?.length > 0 ? projects : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addProject"
        state.message = null
        state.errors = null
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = [(action.payload)[0].project, ...state.projects]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getProjects"
        state.message = null
        state.errors = null
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = (action.payload)[0].projects
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.projects = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateProject"
        state.message = null
        state.errors = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let projects = state.projects.filter((project) => {
          return project._id !== (action.payload)[0].project._id
        })
        let project = (action.payload)[0].project
        state.projects = [project, ...projects] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getProject"
        state.message = null
        state.errors = null
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.projects.map(project => {
          if (project._id === (action.payload)[0].project._id) {
            return (action.payload)[0].project
          }
          else {
            return project
          }
        })
        state.projects = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(completeProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "completeProject"
        state.message = null
        state.errors = null
      })
      .addCase(completeProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.projects.map(project => {
          if (project._id === (action.payload)[0].project._id) {
            return (action.payload)[0].project
          }
          else {
            return project
          }
        })
        state.projects = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(completeProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(retreatProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "retreatProject"
        state.message = null
        state.errors = null
      })
      .addCase(retreatProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.projects.map(project => {
          if (project._id === (action.payload)[0].project._id) {
            return (action.payload)[0].project
          }
          else {
            return project
          }
        })
        state.projects = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(retreatProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeProject.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likeProject"
        state.message = null
        state.errors = null
      })
      .addCase(likeProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.projects.map(project => {
          if (project._id === (action.payload)[0].project._id) {
            return (action.payload)[0].project
          }
          else {
            return project
          }
        })
        state.projects = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeProject.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchProjects.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "searchProjects"
        state.message = null
        state.errors = null
      })
      .addCase(searchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = (action.payload)[0].projects
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.projects = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardProjects.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardProjects"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.projects = (action.payload)[0].projects
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardProjects.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.projects = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = projectsSlice.actions
export default projectsSlice.reducer