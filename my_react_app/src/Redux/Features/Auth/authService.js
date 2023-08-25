import axios from 'axios'

//Sign In
const signIn = async (data) => {
  const response = await axios.post('/api/auth/sign-in', data)
  if (response.data) {
    localStorage.setItem('auth', JSON.stringify(response.data))
  }
  return response
}
//Sign Out
const SignOut = async () => {
  const response = await axios.get('/api/auth/sign-out')
  if (response.data) {
    const theme = localStorage.getItem("theme")
    localStorage.clear()
    localStorage.setItem("theme",theme)
  }
  return response
}
//Sign Up
const signUp = async (data) => {
  const response = await axios.post('/api/auth/sign-up', data, {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    localStorage.setItem('auth', JSON.stringify(response.data))
  }
  return response
}
//Forgot Password
const forgotPassword = async (data) => {
  const response = await axios.post('/api/auth/forgot-password', data)
  return response
}
//Reset Password
const resetPassword = async (data) => {
  const response = await axios.post('/api/auth/reset-password', data)
  return response
}
const authService = {
  signIn,
  SignOut,
  signUp,
  forgotPassword,
  resetPassword
}
export default authService