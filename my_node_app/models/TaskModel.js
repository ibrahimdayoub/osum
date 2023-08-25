import { Schema, model } from 'mongoose'

const TaskSchema = Schema({
    creator_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Creator id field is required"],
        refPath: 'creator_model',
    },
    creator_model: {
        type: String,
        required: [true, "Creator model field is required"],
        enum: {
            values: ['Developer', 'Delegate'],
            message: '{VALUE} is not supported'
        }
    },
    content: {
        type: String,
        minlength: 2,
        maxlength: 500,
        required: [true, "Content field is required"],
    },
    is_checked: {
        type: Boolean,
        default: false
    },
    project_id: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project ID field is required"],
    },
},
    {
        timestamps: true
    })

const Task = model("Task", TaskSchema)
export default Task 