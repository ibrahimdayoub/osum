import { Schema, model } from 'mongoose'

const ChatSchema = Schema({
    chat_name: {
        type: String,
        required: [true, "Chat name field is required"],
        minlength: 2,
        maxlength: 50,
    },
    chat_picture: {
        type: String,
        minlength: 2,
        maxlength: 100,
        default: null
    },
    is_group: {
        type: Boolean,
        required: [true, "Is group field is required"],
        default: false
    },
    users_ids: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    owner_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Owner id field is required"],
        refPath: 'owner_model',
    },
    owner_model: {
        type: String,
        required: [true, "Sender model field is required"],
        enum: ['Client', 'Developer', 'Delegate', 'Admin']
    },
    latest_message: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
},
    {
        timestamps: true,
    })

const Chat = model("Chat", ChatSchema)
export default Chat