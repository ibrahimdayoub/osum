import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import commentsService from './commentsService'

//Get comments information from localStorage
const comments = JSON.parse(localStorage.getItem('comments'))
const initialState = {
  isLoading: null,
  isSuccess: null,
  isError: null,
  comments: comments?.length > 0 ? comments : [],
  message: null,
  errors: null,
  status: null,
  operation: null,
  time: null
}
//Add Comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async (data, thunkAPI) => {
    try {
      const response = await commentsService.addComment(data) //data=data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Get Comments
export const getComments = createAsyncThunk(
  'comments/getComments',
  async (data, thunkAPI) => {
    try {
      const response = await commentsService.getComments(data) //data=post_id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Update Comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (data, thunkAPI) => {
    try {
      const response = await commentsService.updateComment(data) //data=id+data
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Delete Comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (data, thunkAPI) => {
    try {
      const response = await commentsService.deleteComment(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
//Like Comment
export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (data, thunkAPI) => {
    try {
      const response = await commentsService.likeComment(data) //data=id
      return thunkAPI.fulfillWithValue([response.data, response.status])
    } catch (error) {
      return thunkAPI.rejectWithValue([error.response.data, error.response.status])
    }
  }
)
export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = null
      state.isSuccess = null
      state.isError = null
      state.comments = comments?.length > 0 ? comments : []
      state.message = null
      state.errors = null
      state.status = null
      state.operation = null
      state.time = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "addComment"
        state.message = null
        state.errors = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.comments = [(action.payload)[0].comment, ...state.comments]
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getComments.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "getComments"
        state.message = null
        state.errors = null
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.comments = (action.payload)[0].comments
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.comments = []
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "updateComment"
        state.message = null
        state.errors = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.comments.map(comment => {
          if (comment._id === (action.payload)[0].comment._id) {
            return (action.payload)[0].comment
          }
          else {
            return comment
          }
        })
        state.comments = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "deleteComment"
        state.message = null
        state.errors = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.comments.filter(comment => {
          return comment._id !== (action.payload)[0].comment._id
        })
        state.comments = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeComment.pending, (state) => {
        state.isLoading = true
        state.isSuccess = null
        state.isError = null
        state.operation = "likeComment"
        state.message = null
        state.errors = null
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        let arr = state.comments.map(comment => {
          if (comment._id === (action.payload)[0].comment._id)
          {
            return (action.payload)[0].comment
          }
          else{
            return comment
          }
        })
        state.comments = arr
        state.message = (action.payload)[0].message
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = (action.payload)[0].message
        state.errors = (action.payload)[0].errors
        state.status = (action.payload)[1]
        state.time = Date.now()
      })
  },
})
export const { reset } = commentsSlice.actions
export default commentsSlice.reducer