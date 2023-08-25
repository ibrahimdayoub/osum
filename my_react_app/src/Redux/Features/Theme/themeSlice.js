import { createSlice } from '@reduxjs/toolkit'

//Get theme information from localStorage
const theme = localStorage.getItem('theme')
if(!theme){
  localStorage.setItem("theme","light")
}

const initialState = {
  theme: theme==="light" ? "light" : theme==="dark" ? "dark" : "light"
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: (state) => {
      if(state.theme === "light")
      {
        localStorage.setItem("theme","dark")
        state.theme = "dark"
      }
      else{
        localStorage.setItem("theme","light")
        state.theme = "light"
      }
    }
  }
})
export const {toggle} = themeSlice.actions
export default themeSlice.reducer