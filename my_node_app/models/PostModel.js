import { Schema, model } from 'mongoose'

const PostSchema = Schema({
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
        maxlength: 500,
        required: [true, "Content field is required"],
    },
    post_picture: {
        type: String,
        minlength: 2,
        maxlength: 100,
        default: null
    },
    field_of_work: {
        type: String,
        required: [true, "Field of post work field is required"],
        enum: {
            values: ['Programming', 'Designing', 'Content Writing', 'Translation'],
            message: '{VALUE} is not supported'
        }
    },
    key_words: [{
        type: String,
        minlength: 1,
        maxlength: 50
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
    }],
},
    {
        timestamps: true
    })

const Post = model("Post", PostSchema)
export default Post