import { Schema, model } from 'mongoose'

const CommentSchema = Schema({
    editor_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Editor id field is required"],
        refPath: 'editor_model',
    },
    editor_model: {
        type: String,
        required: [true, "Editor model field is required"],
        enum: {
            values: ['Client', 'Developer', 'Delegate'],
            message: '{VALUE} is not supported'
        }
    },
    content: {
        type: String,
        minlength: 2,
        required: [true, "Content field is required"],
    },
    comment_picture: {
        type: String,
        minlength: 2,
        maxlength: 100,
        default: null
    },
    likes: [{
        type: Schema.Types.ObjectId,
    }],
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post ID field is required"],
    },
},
    {
        timestamps: true
    })

const Comment = model("Comment", CommentSchema)
export default Comment