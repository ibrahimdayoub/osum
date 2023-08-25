import axios from 'axios'

//Add Company
const addCompany = async ({data}) => {
  console.log(data)
  const response = await axios.post('/api/companies/add', data)
  if (response.data) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    if (!companies || companies.length === 0) {
      let arr = [response.data.company]
      localStorage.setItem('companies', JSON.stringify(arr))
    }
    else {
      let arr = [response.data.company, ...companies]
      localStorage.setItem('companies', JSON.stringify(arr))
    }
  }
  return response
}
//Update Company
const updateCompany = async ({ id, data }) => {
  const response = await axios.put('/api/companies/update/' + id, data)
  if (response.data) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    if (!companies || companies.length === 0) {
      let companies = [response.data.company]
      localStorage.setItem('companies', JSON.stringify(companies))
    }
    else {
      companies = companies.map(company => {
        if (company._id === response.data.company._id) {
          return response.data.company
        }
        else {
          return company
        }
      })
      localStorage.setItem('companies', JSON.stringify(companies))
    }
  }
  return response
}
//Delete Company
const deleteCompany = async ({ id }) => {
  const response = await axios.delete('/api/companies/delete/' + id)
  if (response.data) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    if (!companies || companies.length === 0) {
      let companies = []
      localStorage.setItem('companies', JSON.stringify(companies))
    }
    else {
      companies = companies.filter(company => {
        return company._id !== response.data.company._id
      })
      localStorage.setItem('companies', JSON.stringify(companies))
    }
  }
  return response
}
//Like Company
const likeCompany = async ({ id }) => {
  const response = await axios.put('/api/companies/like/' + id)
  if (response.data) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    if (!companies || companies.length === 0) {
      let companies = [response.data.company]
      localStorage.setItem('companies', JSON.stringify(companies))
    }
    else {
      companies = companies.map(company => {
        if (company._id === response.data.company._id) {
          return response.data.company
        }
        else {
          return company
        }
      })
      localStorage.setItem('companies', JSON.stringify(companies))
    }
  }
  return response
}
//Get Company
const getCompany = async ({ id }) => {
  const response = await axios.get('/api/companies/get/' + id)
  if (response.data) {
    let companies = JSON.parse(localStorage.getItem('companies'))
    if (!companies || companies.length === 0) {
      let companies = [response.data.company]
      localStorage.setItem('companies', JSON.stringify(companies))
    }
    else {
      companies = companies.map(company => {
        if (company._id === response.data.company._id) {
          return response.data.company
        }
        else {
          return company
        }
      })
      localStorage.setItem('companies', JSON.stringify(companies))
    }
  }
  return response
}
const companiesService = {
  addCompany,
  updateCompany,
  deleteCompany,
  likeCompany,
  getCompany,
}

export default companiesService