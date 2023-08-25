import axios from 'axios'

//Get Notifications
const getNotifications = async () => {
  localStorage.setItem('notifications', JSON.stringify([]))
  const response = await axios.get('/api/notifications/get')
  if (response.data) {
    localStorage.setItem('notifications', JSON.stringify(response.data.notifications))
  }
  return response
}
//Get Notifications Counter
const getNotificationsCounter = async () => { 
  const response = await axios.get('/api/notifications/counter').catch((e)=>{localStorage.setItem('notifications-counter', 0)})
  if (response.data) {
    localStorage.setItem('notifications-counter', response.data.counter)
  }
  return response
}
//Delete Notification
const deleteNotification = async ({ id }) => {
  const response = await axios.delete('/api/notifications/delete/' + id)
  if (response.data) {
    let notifications = JSON.parse(localStorage.getItem('notifications'))
    if (!notifications || notifications.length === 0) {
      let notifications = []
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
    else {
      notifications = notifications.filter(notification => {
        return notification._id !== response.data.notification._id
      })
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }
  return response
}
const notificationsService = {
  getNotifications,
  getNotificationsCounter,
  deleteNotification
}
export default notificationsService