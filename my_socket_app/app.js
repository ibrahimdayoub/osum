import { Server } from "socket.io";
import { config as dotenvConfig } from "dotenv"

dotenvConfig()
let onLineUsers = []

const addUser = (userId, userRole, socketId) => {
    const add = onLineUsers.every((user) => {
        return user.userId !== userId
    })

    if (add) {
        onLineUsers.push({ userId, userRole, socketId })
    }
    else {
        onLineUsers = onLineUsers.filter((user) => {
            return user.userId !== userId
        })
        onLineUsers.push({ userId, userRole, socketId })
    }
    console.log("onLineUsers", onLineUsers)
}

const getUser = (userId) => {
    const user = onLineUsers.find((user) => {
        return user.userId == userId
    })
    return user
}

const deleteUser = (socketId) => {
    onLineUsers = onLineUsers.filter((user) => {
        return user.socketId !== socketId
    })
}

const io = new Server({
    cors: {
        origin: "*"
        // origin: process.env.FRONT_END_URL // ReactJs URL
        // origin: [URL1, URL2]
    }
})

io.on("connection", (socket) => {
    console.log("Someone has connected by socket id " + socket.id)

    //Event 0
    socket.on("addUser", ({ userId, userRole }) => {
        addUser(userId, userRole, socket.id)
    }) //When signIn or signUP

    //Event 1
    socket.on("addNotification", (data) => {
        console.log("Data: ", data)
        if (data.receiversIds === "All") {
            for (let i in onLineUsers) {
                io.to(onLineUsers[i]?.socketId).emit("getNotification", {
                    redirect: data.redirect,
                    message: data.message
                })
            }
        }
        else if (data.receiversIds === "Admins") {
            let onLineAdmins = onLineUsers.filter((onLineUser) => {
                return onLineUser.userRole === "Admin"
            })
            for (let i in onLineAdmins) {
                io.to(onLineAdmins[i]?.socketId).emit("getNotification", {
                    redirect: data.redirect,
                    message: data.message
                })
            }
        }
        else if (data.receiversIds.length !== 0) {
            data.receiversIds.map((receiverId) => {
                const receiver = getUser(receiverId)
                io.to(receiver?.socketId).emit("getNotification", {
                    redirect: data.redirect,
                    message: data.message
                })
            })
        }
    }) //New notification

    //Event 2 
    socket.on("addChat", (data) => {
        data.chat.users_ids.map((user_id) => {
            const onLineUser = onLineUsers.filter((onLineUser) => {
                return onLineUser.userId === user_id._id && onLineUser.userId !== data.user._id
            })
            if (onLineUser[0]) {
                io.to(onLineUser[0]?.socketId).emit("getChat", {
                    ...data.chat
                })
            }
        })
    }) //New chat

    //Event 3
    socket.on("addMessage", (data) => {
        data.message.unreaders_ids.map((unreader_id) => {
            const onLineUser = onLineUsers.filter((onLineUser) => {
                return onLineUser.userId === unreader_id
            })
            if (onLineUser[0]) {
                io.to(onLineUser[0]?.socketId).emit("getMessage", {
                    ...data.message
                })
            }
        })
    }) //New message

    socket.on("disconnect", () => {
        console.log("Someone has left by socket id " + socket.id)
        deleteUser(socket.id)
    });
});

io.listen(process.env.PORT)