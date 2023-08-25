import axios from 'axios'

//Add Project
const addProject = async (data) => {
  const response = await axios.post('/api/projects/add', data)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      let arr = [response.data.project]
      localStorage.setItem('projects', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.project, ...projects]
      localStorage.setItem('projects', JSON.stringify(arr))
    }
  }
  return response
}
//Get Projects
const getProjects = async (data) => {
  localStorage.setItem('projects', JSON.stringify([]))
  const response = await axios.post('/api/projects/get', data)
  if (response.data) {
    localStorage.setItem('projects', JSON.stringify(response.data.projects))
  }
  return response
}
//Update Project
const updateProject = async ({ id, data }) => {
  const response = await axios.put('/api/projects/update/' + id, data)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      projects = [response.data.project] //First one
      localStorage.setItem('projects', JSON.stringify(projects))
    }
    else {
      projects = projects.filter((project) => {
        return project._id !== response.data.project._id
      })
      projects = [response.data.project, ...projects] //First one
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }
  return response
}
//Complete Project
const completeProject = async ({ id }) => {
  const response = await axios.put('/api/projects/complete/' + id)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      let projects = [response.data.project]
      localStorage.setItem('projects', JSON.stringify(projects))
    }
    else {
      projects = projects.map(project => {
        if (project._id === response.data.project._id) {
          return response.data.project
        }
        else {
          return project
        }
      })
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }
  return response
}
//Retreat Project
const retreatProject = async ({ id }) => {
  const response = await axios.put('/api/projects/retreat/' + id)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      let projects = [response.data.project]
      localStorage.setItem('projects', JSON.stringify(projects))
    }
    else {
      projects = projects.map(project => {
        if (project._id === response.data.project._id) {
          return response.data.project
        }
        else {
          return project
        }
      })
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }
  return response
}
//Like Project
const likeProject = async ({ id }) => {
  const response = await axios.put('/api/projects/like/' + id)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      let projects = [response.data.project]
      localStorage.setItem('projects', JSON.stringify(projects))
    }
    else {
      projects = projects.map(project => {
        if (project._id === response.data.project._id) {
          return response.data.project
        }
        else {
          return project
        }
      })
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }
  return response
}
//Get Project
const getProject = async ({ id }) => {
  const response = await axios.get('/api/projects/get/' + id)
  if (response.data) {
    let projects = JSON.parse(localStorage.getItem('projects'))
    if (!projects || projects.length === 0) {
      let projects = [response.data.project]
      localStorage.setItem('projects', JSON.stringify(projects))
    }
    else {
      projects = projects.map(project => {
        if (project._id === response.data.project._id) {
          return response.data.project
        }
        else {
          return project
        }
      })
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }
  return response
}
//Search Project
const searchProjects = async ({ key }) => {
  localStorage.setItem('projects', JSON.stringify([]))
  const response = await axios.get('/api/projects/search?key=' + key)
  if (response.data) {
    localStorage.setItem('projects', JSON.stringify(response.data.projects))
  }
  return response
}
//Get Dashboard Projects
const getDashboardProjects = async () => {
  localStorage.setItem('projects', JSON.stringify([]))
  const response = await axios.get('/api/projects/dashboard-projects')
  if (response.data) {
    localStorage.setItem('projects', JSON.stringify(response.data.projects))
  }
  return response
}
const projectsService = {
  addProject,
  getProjects,
  updateProject,
  completeProject,
  retreatProject,
  likeProject,
  getProject,
  searchProjects,
  getDashboardProjects
}

export default projectsService