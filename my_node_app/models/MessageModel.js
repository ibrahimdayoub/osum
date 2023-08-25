import { Schema, model } from 'mongoose'

const MessageSchema = Schema({
    content: {
        type: String,
        required: function(){
            return !this.content_picture
        },
        validate:{
            validator: function (value){
                return value || this.content_picture
            },
            message: "content field is required"
        },
        minlength: 1,
        trim: true,
        default: null
    },
    content_picture: {
        type: String,
        required: function () {
            return !this.content
        },
        validate: {
            validator: function (value) {
                return value || this.content
            },
            message: "content picture field is required"
        },
        minlength: 2,
        maxlength: 100,
        default: null
    },
    sender_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Sender id field is required"],
        refPath: 'sender_model',
    },
    sender_model: {
        type: String,
        required: [true, "Sender model field is required"],
        enum: {
            values: ['Client', 'Developer', 'Delegate', 'Admin'],
            message: '{VALUE} is not supported'
        }
    },
    readers_ids: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    chat_id: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    }
},
{
    timestamps: true,
})
const Message = model("Message", MessageSchema)
export default Message