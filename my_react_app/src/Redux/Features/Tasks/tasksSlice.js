import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tasksService from './tasksService'

//Get tasks information from localStorage
const tasks = JSON.parse(localStorage.getItem('tasks'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  tasks: tasks?.length > 0 ? tasks : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Task
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.addTask(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Tasks
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.getTasks(data)
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.updateTask(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Check Task
export const checkTask = createAsyncThunk(
  'tasks/checkTask',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.checkTask(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.deleteTask(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Task
export const getTask = createAsyncThunk(
  'tasks/getTask',
  async (data, thunkAPI) => {
    try {
      const response = await tasksService.getTask(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Tasks
export const getDashboardTasks = createAsyncThunk(
  'tasks/getDashboardTasks',
  async (_, thunkAPI) => {
    try {
      const response = await tasksService.getDashboardTasks()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.tasks = tasks?.length > 0 ? tasks : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addTask"
        state.message = null
        state.errors = null
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = [(action.payload)[0].task, ...state.tasks]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getTasks"
        state.message = null
        state.errors = null
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = (action.payload)[0].tasks
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.tasks = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateTask"
        state.message = null
        state.errors = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let tasks = state.tasks.filter((task) => {
          return task._id !== (action.payload)[0].task._id
        })
        let task = (action.payload)[0].task
        state.tasks = [task, ...tasks] //First one
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(checkTask.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "checkTask"
        state.message = null
        state.errors = null
      })
      .addCase(checkTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const tasks = state.tasks.map((task) => {
          if (task._id === (action.payload)[0].task._id) {
            return (action.payload)[0].task
          }
          else {
            return task
          }
        })
        state.tasks = tasks
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(checkTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteTask"
        state.message = null
        state.errors = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.tasks.filter(task => {
          return task._id !== (action.payload)[0].task._id
        })
        state.tasks = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTask.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getTask"
        state.message = null
        state.errors = null
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.tasks.map(task => {
          if (task._id === (action.payload)[0].task._id) {
            return (action.payload)[0].task
          }
          else {
            return task
          }
        })
        state.tasks = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardTasks.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardTasks"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.tasks = (action.payload)[0].tasks
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardTasks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.tasks = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = tasksSlice.actions
export default tasksSlice.reducer