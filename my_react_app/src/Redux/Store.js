import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Features/Auth/authSlice'
import socketReducer from './Features/Socket/socketSlice'
import themeReducer from './Features/Theme/themeSlice'
import usersReducer from './Features/Users/usersSlice'
import supportsReducer from './Features/Supports/supportsSlice'
import notificationsReducer from './Features/Notifications/notificationsSlice'
import chatsReducer from './Features/Chats/chatsSlice'
import messagesReducer from './Features/Messages/messagesSlice'
import postsReducer from './Features/Posts/postsSlice'
import commentsReducer from './Features/Comments/commentsSlice'
import companiesReducer from './Features/Companies/companiesSlice'
import teamsReducer from './Features/Teams/teamsSlice'
import projectsReducer from './Features/Projects/projectsSlice'
import servicesReducer from './Features/Services/servicesSlice'
import tasksReducer from './Features/Tasks/tasksSlice'
import storiesReducer from './Features/Stories/storiesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    theme: themeReducer,
    users: usersReducer,
    supports: supportsReducer,
    notifications: notificationsReducer,
    chats: chatsReducer,
    messages: messagesReducer,
    posts: postsReducer,
    comments: commentsReducer,
    companies: companiesReducer,
    teams: teamsReducer,
    projects: projectsReducer,
    services: servicesReducer,
    tasks: tasksReducer,
    stories: storiesReducer,
  },
})