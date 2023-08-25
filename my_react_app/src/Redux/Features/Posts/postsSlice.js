import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import postsService from './postsService'

//Get posts information from localStorage
const posts = JSON.parse(localStorage.getItem('posts'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  posts: posts?.length > 0 ? posts : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Post
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.addPost(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Posts
export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.getPosts(data) //data=location_target_id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.updatePost(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.deletePost(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Post
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.likePost(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Post
export const getPost = createAsyncThunk(
  'posts/getPost',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.getPost(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Search Posts
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (data, thunkAPI) => {
    try {
      const response = await postsService.searchPosts(data) //data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Dashboard Posts
export const getDashboardPosts = createAsyncThunk(
  'posts/getDashboardPosts',
  async (_, thunkAPI) => {
    try {
      const response = await postsService.getDashboardPosts()
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.posts = posts?.length > 0 ? posts : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addPost"
        state.message = null
        state.errors = null
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.posts = [(action.payload)[0].post, ...state.posts]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addPost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getPosts"
        state.message = null
        state.errors = null
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.posts = (action.payload)[0].posts
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.posts = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updatePost"
        state.message = null
        state.errors = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.posts.map(post => {
          if (post._id === (action.payload)[0].post._id) {
            return (action.payload)[0].post
          }
          else {
            return post
          }
        })
        state.posts = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deletePost"
        state.message = null
        state.errors = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.posts.filter(post => {
          return post._id !== (action.payload)[0].post._id
        })
        state.posts = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likePost.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likePost"
        state.message = null
        state.errors = null
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.posts.map(post => {
          if (post._id === (action.payload)[0].post._id) {
            return (action.payload)[0].post
          }
          else {
            return post
          }
        })
        state.posts = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getPost.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getPost"
        state.message = null
        state.errors = null
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.posts.map(post => {
          if (post._id === (action.payload)[0].post._id) {
            return (action.payload)[0].post
          }
          else {
            return post
          }
        })
        state.posts = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getPost.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "searchPosts"
        state.message = null
        state.errors = null
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.posts = (action.payload)[0].posts
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.posts = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardPosts.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getDashboardPosts"
        state.message = null
        state.errors = null
      })
      .addCase(getDashboardPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.posts = (action.payload)[0].posts
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getDashboardPosts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.posts = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = postsSlice.actions
export default postsSlice.reducer