import { Schema, model } from 'mongoose'

const SupportSchema = Schema({
    sender_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Sender ID field is required"],
        refPath:"sender_model"
    },
    sender_model: {
        type: String,
        required: [true, "User role field is required"],
        enum: {
            values: ['Client', 'Developer', 'Delegate', 'Admin'],
            message: '{VALUE} is not supported'
        }
    },
    subject: {
        type: String,
        required: [true, "Subject field is required"],
        minlength: 2,
        maxlength: 200,
    },
    message: {
        type: String,
        required: [true, "Message field is required"],
        minlength: 2,
        maxlength: 500,
    },
    reply: {
        type: String,
        minlength: 2,
        maxlength: 500,
        default: null
    }
},
    {
        timestamps: true
    })

const Support = model("Support", SupportSchema)
export default Support