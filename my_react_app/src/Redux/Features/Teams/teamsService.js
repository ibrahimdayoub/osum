import axios from 'axios'

//Add Team
const addTeam = async (data) => {
  const response = await axios.post('/api/teams/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let teams = JSON.parse(localStorage.getItem('teams'))
    if (!teams || teams.length === 0) {
      let arr = [response.data.team]
      localStorage.setItem('teams', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.team, ...teams]
      localStorage.setItem('teams', JSON.stringify(arr))
    }
  }
  return response
}
//Get Teams
const getTeams = async () => {
  localStorage.setItem('teams', JSON.stringify([]))
  const response = await axios.get('/api/teams/get')
  if (response.data) {
    localStorage.setItem('teams', JSON.stringify(response.data.teams))
  }
  return response
}
//Update Team
const updateTeam = async ({ id, data }) => {
  console.log(id, data)
  const response = await axios.put('/api/teams/update/' + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.data) {
    let teams = JSON.parse(localStorage.getItem('teams'))
    if (!teams || teams.length === 0) {
      teams = [response.data.team] //First one
      localStorage.setItem('teams', JSON.stringify(teams))
    }
    else {
      teams = teams.filter((team) => {
        return team._id !== response.data.team._id
      })
      teams = [response.data.team, ...teams] //First one
      localStorage.setItem('teams', JSON.stringify(teams))
    }
  }
  return response
}
//Delete Team
const deleteTeam = async ({ id }) => {
  const response = await axios.delete('/api/teams/delete/' + id)
  if (response.data) {
    let teams = JSON.parse(localStorage.getItem('teams'))
    if (!teams || teams.length === 0) {
      let teams = []
      localStorage.setItem('teams', JSON.stringify(teams))
    }
    else {
      teams = teams.filter(team => {
        return team._id !== response.data.team._id
      })
      localStorage.setItem('teams', JSON.stringify(teams))
    }
  }
  return response
}
//Get Team
const getTeam = async ({ id }) => {
  const response = await axios.get('/api/teams/get/' + id)
  if (response.data) {
    let teams = JSON.parse(localStorage.getItem('teams'))
    if (!teams || teams.length === 0) {
      let teams = [response.data.team]
      localStorage.setItem('teams', JSON.stringify(teams))
    }
    else {
      teams = teams.map(team => {
        if (team._id === response.data.team._id) {
          return response.data.team
        }
        else {
          return team
        }
      })
      localStorage.setItem('teams', JSON.stringify(teams))
    }
  }
  return response
}
//Leave Team
const leaveTeam = async ({ id }) => {
  const response = await axios.put('/api/teams/leave/' + id)
  if (response.data) {
    let teams = JSON.parse(localStorage.getItem('teams'))
    if (!teams || teams.length === 0) {
      teams = []
      localStorage.setItem('teams', JSON.stringify(teams))
    }
    else {
      teams = teams.filter((team) => {
        return team._id !== response.data.team._id
      })
      localStorage.setItem('teams', JSON.stringify(teams))
    }
  }
  return response
}
//Get Dashboard Teams
const getDashboardTeams = async () => {
  localStorage.setItem('teams', JSON.stringify([]))
  const response = await axios.get('/api/teams/dashboard-teams')
  if (response.data) {
    localStorage.setItem('teams', JSON.stringify(response.data.teams))
  }
  return response
}
const teamsService = {
  addTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  getTeam,
  leaveTeam,
  getDashboardTeams
}

export default teamsService