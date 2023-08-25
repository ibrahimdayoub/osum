import axios from 'axios'

//Update User
const updateUser = async ({ id, data }) => {
  const response = await axios.put('/api/users/update/' + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {

    let users = JSON.parse(localStorage.getItem('users'))

    if (!users || users.length === 0) {
      let users = [response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
    else {
      users = users.filter(user => {
        return user._id !== response.data.user._id
      })
      users = [...users, response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
  return response
}
//Visit User
const visitUser = async ({ id, data }) => {
  const response = await axios.put('/api/users/visit/' + id, data)
  if (response.data) {
    let users = JSON.parse(localStorage.getItem('users'))

    if (!users || users.length === 0) {
      let users = [response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
    else {
      users = users.filter(user => {
        return user._id !== response.data.user._id
      })
      users = [...users, response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
  return response
}
//Rate User
const rateUser = async ({ id, data }) => {
  const response = await axios.put('/api/users/rate/' + id, data)
  if (response.data) {
    let users = JSON.parse(localStorage.getItem('users'))

    if (!users || users.length === 0) {
      let users = [response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
    else {
      users = users.filter(user => {
        return user._id !== response.data.user._id
      })
      users = [...users, response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
  return response
}
//Delete User
const deleteUser = async ({ id, data }) => {
  const response = await axios.post('/api/users/delete/' + id, data)
  if (response.data) {

    let users = JSON.parse(localStorage.getItem('users'))

    if (!users || users.length === 0) {
      let users = []
      localStorage.setItem('users', JSON.stringify(users))
    }
    else {
      users = users.filter(user => {
        return user._id !== response.data.user._id
      })
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
  return response
}
//Get User
const getUser = async ({ id, data }) => {
  console.log({ id, data })
  const response = await axios.post('/api/users/get/' + id, data)
  if (response.data) {
    let users = JSON.parse(localStorage.getItem('users'))
    if (!users || users.length === 0) {
      let users = [response.data.user]
      localStorage.setItem('users', JSON.stringify(users))
    }
    else {
      const userExixts = users.find((user) => {
        return user._id === response.data.user._id
      })
      if (userExixts) {
        users = users.map(user => {
          if (user._id === response.data.user._id) {
            return response.data.user
          }
          else {
            return user
          }
        })
      }
      else {
        users = [response.data.user, ...users]
      }
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
  return response
}
//Search Users
const searchUsers = async ({ key }) => {
  localStorage.setItem('users', JSON.stringify([]))
  const response = await axios.get('/api/users/search?key=' + key)
  if (response.data) {
    localStorage.setItem('users', JSON.stringify(response.data.users))
  }
  return response
}
//Add Admin
const addAdmin = async ({ data }) => {
  const response = await axios.post('/api/users/add-admin/', data)
  return response
}
//Block User
const blockUser = async ({ id }) => {
  const response = await axios.get('/api/users/block-user/' + id)
  return response
}
//Get Dashboard Users
const getDashboardUsers = async () => {
  localStorage.setItem('users', JSON.stringify([]))
  const response = await axios.get('/api/users/dashboard-users')
  if (response.data) {
    localStorage.setItem('users', JSON.stringify(response.data.users))
  }
  return response
}

const usersService = {
  updateUser,
  visitUser,
  rateUser,
  deleteUser,
  getUser,
  searchUsers,
  addAdmin,
  blockUser,
  getDashboardUsers
}

export default usersService