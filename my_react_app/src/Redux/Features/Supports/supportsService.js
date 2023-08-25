import axios from 'axios'

//Add Support
const addSupport = async ({data}) => {
  const response = await axios.post('/api/supports/add', data)
  if (response.data) {

    let supports = JSON.parse(localStorage.getItem('supports'))

    if(!supports || supports.length===0)
    {
      let arr = [response.data.support]
      localStorage.setItem('supports', JSON.stringify(arr))
    }
    else{
      let arr = supports
      arr.push(response.data.support)
      localStorage.setItem('supports', JSON.stringify(arr))
    }
  }
  return response
}
//Get Supports
const getSupports = async () => {
  localStorage.setItem('supports', JSON.stringify([]))
  const response = await axios.get('/api/supports/get')
  if (response.data) {
    localStorage.setItem('supports', JSON.stringify(response.data.supports))
  }
  return response
}
//Update Support
const updateSupport = async ({id,data}) => {
  const response = await axios.put('/api/supports/update/'+id, data)
  if (response.data) {

    let supports = JSON.parse(localStorage.getItem('supports'))

    if(!supports || supports.length===0)
    {
      let supports = [response.data.support]
      localStorage.setItem('supports', JSON.stringify(supports))
    }
    else{
      supports = supports.map((support)=>{
        if (support._id === response.data.support._id){
          return response.data.support
        }
        else{
          return support
        }
      })
      localStorage.setItem('supports', JSON.stringify(supports))
    }
  }
  return response
}
//Delete Support
const deleteSupport = async ({id}) => {
  const response = await axios.delete('/api/supports/delete/'+id)
  if (response.data) {

    let supports = JSON.parse(localStorage.getItem('supports'))

    if(!supports || supports.length===0)
    {
      let supports = []
      localStorage.setItem('supports', JSON.stringify(supports))
    }
    else{
      supports = supports.filter(support => {
      return support._id !== response.data.support._id
      })
      localStorage.setItem('supports', JSON.stringify(supports))
    }
  }
  return response
}
const supportsService = {
  addSupport,
  getSupports,
  updateSupport,
  deleteSupport
}

export default supportsService