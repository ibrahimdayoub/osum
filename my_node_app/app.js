import express, { json, urlencoded } from "express"
import { config as dotenvConfig } from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors";
import colors from "colors"
import multer from "multer"
import { fileURLToPath } from "url";
import path from "path"

//Middlewares
import { errorHandler } from "./middlewares/ErrorMiddleware.js"
import { protectAdmin, protectAll, protectAdminAndOwner, protectAllWithoutAdmin, protectDeveloperDelegate } from "./middlewares/ProtectMiddleware.js"

//Controllers
import { signUp } from './controllers/AuthController.js'
import { addUser, updateUser } from './controllers/UserController.js'
import { createGroup, updateGroup } from "./controllers/ChatController.js";
import { addPost, updatePost } from "./controllers/PostController.js";
import { addComment, updateComment } from "./controllers/CommentController.js";
import { addMessage } from "./controllers/MessageController.js";
import { addTeam, updateTeam } from "./controllers/TeamController.js";
import { addStory } from "./controllers/StoryController.js";

//Routes
import AuthRoutes from "./routes/AuthRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
import SupportRoutes from "./routes/SupportRoutes.js"
import NotificationRoutes from "./routes/NotificationRoutes.js"
import ChatRoutes from "./routes/ChatRoutes.js"
import MessageRoutes from "./routes/MessageRoutes.js"
import PostRoutes from "./routes/PostRoutes.js"
import CommentRoutes from "./routes/CommentRoutes.js"
import TeamRoutes from "./routes/TeamRoutes.js"
import ProjectRoutes from "./routes/ProjectRoutes.js"
import CompanyRoutes from "./routes/CompanyRoutes.js"
import ServiceRoutes from "./routes/ServiceRoutes.js"
import TaskRoutes from "./routes/TaskRoutes.js"
import StoryRoutes from "./routes/StoryRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvConfig()
connectDB()

const app = express()
app.use(json())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use("/Images", express.static(path.join(__dirname, "public/Images")));

const UploadImagesMiddleware = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const extname = path.extname(file.originalname);
            if (extname === '.png' || extname == '.jpg' || extname === '.jpeg') {
                cb(null, "public/Images");
            }
            else {
                cb(null, "public/Trash");
            }
        },
        filename: function (req, file, cb) {
            const name = "OSUM." + Date.now() + path.extname(file.originalname)
            cb(null, name);
        },
    }),
    // fileFilter: function (req, file, cb) {
    //     const extname = path.extname(file.originalname);
    //     if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
    //         return cb(new Error('Only images (png, jpg, jpeg) are allowed'))
    //     }
    //     cb(null, true)
    // },
});

//Routes
app.post("/api/auth/sign-up", UploadImagesMiddleware.single("picture_personal_profile"), signUp);//with image file
app.use("/api/auth", AuthRoutes);

app.post("/api/users/add", protectAdmin, UploadImagesMiddleware.single("picture_personal_profile"), addUser);//with image file
app.put("/api/users/update/:id", protectAdminAndOwner, UploadImagesMiddleware.single("picture_personal_profile"), updateUser);//with image file
app.use("/api/users", UserRoutes);

app.use("/api/supports", SupportRoutes);

app.use("/api/notifications", NotificationRoutes);

app.post("/api/chats/create-group", protectAll, UploadImagesMiddleware.single("group_picture"), createGroup);//with image file
app.put('/api/chats/update-group/:id', protectAdminAndOwner, UploadImagesMiddleware.single("group_picture"), updateGroup);//with image file
app.use("/api/chats", ChatRoutes);

app.post('/api/messages/add', protectAll, UploadImagesMiddleware.single("content_picture"), addMessage);//with image file
app.use("/api/messages", MessageRoutes);

app.post("/api/posts/add", protectAllWithoutAdmin, UploadImagesMiddleware.single("post_picture"), addPost);//with image file
app.put('/api/posts/update/:id', protectAllWithoutAdmin, UploadImagesMiddleware.single("post_picture"), updatePost);//with image file
app.use("/api/posts", PostRoutes);

app.post("/api/comments/add", protectAllWithoutAdmin, UploadImagesMiddleware.single("comment_picture"), addComment);//with image file
app.put('/api/comments/update/:id', protectAllWithoutAdmin, UploadImagesMiddleware.single("comment_picture"), updateComment);//with image file
app.use("/api/comments", CommentRoutes);

app.post("/api/teams/add", protectDeveloperDelegate, UploadImagesMiddleware.single("team_picture"), addTeam);//with image file
app.put("/api/teams/update/:id", protectDeveloperDelegate, UploadImagesMiddleware.single("team_picture"), updateTeam);//with image file
app.use("/api/teams", TeamRoutes);

app.use("/api/projects", ProjectRoutes);

app.use("/api/companies", CompanyRoutes);

app.use("/api/services", ServiceRoutes);

app.use("/api/tasks", TaskRoutes);

app.post("/api/stories/add", protectAllWithoutAdmin, UploadImagesMiddleware.single("story_picture"), addStory);//with image file
app.use("/api/stories", StoryRoutes);

app.use(errorHandler)
app.listen(process.env.PORT, () => {
    console.log(`==> Server Connected Successfully With Port ${process.env.PORT}...`.blue.underline)
})