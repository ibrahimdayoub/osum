import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import storiesService from './storiesService'

//Get stories information from localStorage
const stories = JSON.parse(localStorage.getItem('stories'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  stories: stories?.length > 0 ? stories : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Story
export const addStory = createAsyncThunk(
  'stories/addStory',
  async (data, thunkAPI) => {
    try {
      const response = await storiesService.addStory(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Stories
export const getStories = createAsyncThunk(
  'stories/getStories',
  async (data, thunkAPI) => {
    try {
      const response = await storiesService.getStories(data) //data=location_target_id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Story
export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (data, thunkAPI) => {
    try {
      const response = await storiesService.deleteStory(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Story
export const getStory = createAsyncThunk(
  'stories/getStory',
  async (data, thunkAPI) => {
    try {
      const response = await storiesService.getStory(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Story
export const likeStory = createAsyncThunk(
  'stories/likeStory',
  async (data, thunkAPI) => {
    try {
      const response = await storiesService.likeStory(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.stories = stories?.length > 0 ? stories : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addStory"
        state.message = null
        state.errors = null
      })
      .addCase(addStory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stories = [(action.payload)[0].story, ...state.stories]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addStory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getStories.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getStories"
        state.message = null
        state.errors = null
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.stories = (action.payload)[0].stories
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getStories.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.stories = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteStory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteStory"
        state.message = null
        state.errors = null
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.stories.filter(story => {
          return story._id !== (action.payload)[0].story._id
        })
        state.stories = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getStory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getStory"
        state.message = null
        state.errors = null
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.stories.map(story => {
          if (story._id === (action.payload)[0].story._id) {
            return (action.payload)[0].story
          }
          else {
            return story
          }
        })
        state.stories = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getStory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeStory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likeStory"
        state.message = null
        state.errors = null
      })
      .addCase(likeStory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.stories.map(story => {
          if (story._id === (action.payload)[0].story._id) {
            return (action.payload)[0].story
          }
          else {
            return story
          }
        })
        state.stories = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeStory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = storiesSlice.actions
export default storiesSlice.reducer