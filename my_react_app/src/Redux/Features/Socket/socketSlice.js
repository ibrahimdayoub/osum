import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  socket:{}
}
export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    reset: (state) => {
      state.socket = {}
    },
    set: (state,data) => {
      state.socket = data.payload.socket
    }
  }
})
export const {reset,set} = socketSlice.actions
export default socketSlice.reducer