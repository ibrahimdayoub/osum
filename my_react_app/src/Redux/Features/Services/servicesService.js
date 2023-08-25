import axios from 'axios'

//Add Service
const addService = async ({ data }) => {
  const response = await axios.post('/api/services/add', data)
  if (response.data) {
    let services = JSON.parse(localStorage.getItem('services'))
    if (!services || services.length === 0) {
      let arr = [response.data.service]
      localStorage.setItem('services', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.service, ...services]
      localStorage.setItem('services', JSON.stringify(arr))
    }
  }
  return response
}
//Get Services
const getServices = async ({ data }) => {
  localStorage.setItem('services', JSON.stringify([]))
  const response = await axios.post('/api/services/get', data)
  if (response.data) {
    localStorage.setItem('services', JSON.stringify(response.data.services))
  }
  return response
}
//Update Service
const updateService = async ({ id, data }) => {
  const response = await axios.put('/api/services/update/' + id, data)
  if (response.data) {
    let services = JSON.parse(localStorage.getItem('services'))
    if (!services || services.length === 0) {
      services = [response.data.service] //First one
      localStorage.setItem('services', JSON.stringify(services))
    }
    else {
      services = services.filter((service) => {
        return service._id !== response.data.service._id
      })
      services = [response.data.service, ...services] //First one
      localStorage.setItem('services', JSON.stringify(services))
    }
  }
  return response
}
//Like Service
const likeService = async ({ id }) => {
  const response = await axios.put('/api/services/like/' + id)
  if (response.data) {
    let services = JSON.parse(localStorage.getItem('services'))
    if (!services || services.length === 0) {
      let services = [response.data.service]
      localStorage.setItem('services', JSON.stringify(services))
    }
    else {
      services = services.map(service => {
        if (service._id === response.data.service._id) {
          return response.data.service
        }
        else {
          return service
        }
      })
      localStorage.setItem('services', JSON.stringify(services))
    }
  }
  return response
}
//Get Service
const getService = async ({ id }) => {
  const response = await axios.get('/api/services/get/' + id)
  if (response.data) {
    let services = JSON.parse(localStorage.getItem('services'))
    if (!services || services.length === 0) {
      let services = [response.data.service]
      localStorage.setItem('services', JSON.stringify(services))
    }
    else {
      services = services.map(service => {
        if (service._id === response.data.service._id) {
          return response.data.service
        }
        else {
          return service
        }
      })
      localStorage.setItem('services', JSON.stringify(services))
    }
  }
  return response
}
//Delete Service
const deleteService = async ({ id }) => {
  const response = await axios.delete('/api/services/delete/' + id)
  if (response.data) {
    let services = JSON.parse(localStorage.getItem('services'))
    if (!services || services.length === 0) {
      let services = []
      localStorage.setItem('services', JSON.stringify(services))
    }
    else {
      services = services.filter(service => {
        return service._id !== response.data.service._id
      })
      localStorage.setItem('services', JSON.stringify(services))
    }
  }
  return response
}
//Search Service
const searchServices = async ({ key }) => {
  localStorage.setItem('services', JSON.stringify([]))
  const response = await axios.get('/api/services/search?key=' + key)
  if (response.data) {
    localStorage.setItem('services', JSON.stringify(response.data.services))
  }
  return response
}

//Get Dashboard Services
const getDashboardServices = async () => {
  localStorage.setItem('services', JSON.stringify([]))
  const response = await axios.get('/api/services/dashboard-services')
  if (response.data) {
    localStorage.setItem('services', JSON.stringify(response.data.services))
  }
  return response
}
const servicesService = {
  addService,
  getServices,
  updateService,
  likeService,
  getService,
  deleteService,
  searchServices,
  getDashboardServices
}

export default servicesService