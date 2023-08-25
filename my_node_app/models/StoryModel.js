import { Schema, model } from 'mongoose'

const StorySchema = Schema({
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
    story_picture: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: [true, "Picture field is required"],
    },
    likes: [{
        type: Schema.Types.ObjectId,
    }],
},
    {
        timestamps: true
    })

const Story = model("Story", StorySchema)
export default Story