import axios from 'axios'

//Add Task
const addTask = async ({data}) => {
  const response = await axios.post('/api/tasks/add', data)
  if (response.data) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks || tasks.length === 0) {
      let arr = [response.data.task]
      localStorage.setItem('tasks', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.task, ...tasks]
      localStorage.setItem('tasks', JSON.stringify(arr))
    }
  }
  return response
}
//Get Tasks
const getTasks = async ({data}) => {
  console.log("dataXX: ",data)
  localStorage.setItem('tasks', JSON.stringify([]))
  const response = await axios.post('/api/tasks/get',data)
  if (response.data) {
    localStorage.setItem('tasks', JSON.stringify(response.data.tasks))
  }
  return response
}
//Update Task
const updateTask = async ({ id, data }) => {
  const response = await axios.put('/api/tasks/update/' + id, data)
  if (response.data) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks || tasks.length === 0) {
      tasks = [response.data.task] //First one
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    else {
      tasks = tasks.filter((task) => {
        return task._id !== response.data.task._id
      })
      tasks = [response.data.task, ...tasks] //First one
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }
  return response
}
//Check Task
const checkTask = async ({ id }) => {
  const response = await axios.put('/api/tasks/check/' + id)
  if (response.data) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks || tasks.length === 0) {
      tasks = [response.data.task] //First one
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    else {
      tasks = tasks.map((task)=>{
        if (task._id === response.data.task._id)
        {
          return response.data.task
        }
        else{
          return task
        }
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }
  return response
}
//Delete Task
const deleteTask = async ({ id }) => {
  const response = await axios.delete('/api/tasks/delete/' + id)
  if (response.data) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks || tasks.length === 0) {
      let tasks = []
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    else {
      tasks = tasks.filter(task => {
        return task._id !== response.data.task._id
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }
  return response
}
//Get Task
const getTask = async ({ id }) => {
  const response = await axios.get('/api/tasks/get/' + id)
  if (response.data) {
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks || tasks.length === 0) {
      let tasks = [response.data.task]
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
    else {
      tasks = tasks.map(task => {
        if (task._id === response.data.task._id) {
          return response.data.task
        }
        else {
          return task
        }
      })
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }
  return response
}
//Get Dashboard Tasks
const getDashboardTasks = async () => {
  localStorage.setItem('tasks', JSON.stringify([]))
  const response = await axios.get('/api/tasks/dashboard-tasks')
  if (response.data) {
    localStorage.setItem('tasks', JSON.stringify(response.data.tasks))
  }
  return response
}
const tasksService = {
  addTask,
  getTasks,
  updateTask,
  checkTask,
  deleteTask,
  getTask,
  getDashboardTasks
}
export default tasksService