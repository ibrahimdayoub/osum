import { Schema, model } from 'mongoose'

const NotificationSchema = Schema({
    redirect: {
        type: String,
        required: [true, "Redirect field is required"],
        minlength: 2,
        maxlength: 50,
    },
    message: {
        type: String,
        required: [true, "Message field is required"],
        minlength: 2,
        maxlength: 200,
    },
    senders: [
        {
            sender_id: {
                type: Schema.Types.ObjectId,
                required: [true, "Sender ID field is required"],
                refPath: "sender_model"
            },
            sender_model: {
                type: String,
                required: [true, "Sender model field is required"],
                enum: {
                    values: ['Client', 'Developer', 'Delegate', 'Admin'],
                    message: '{VALUE} is not supported'
                }
            },
        }
    ],
    receivers: [
        {
            receiver_id: {
                type: Schema.Types.ObjectId,
                required: [true, "Receiver ID field is required"],
                refPath:"receiver_model"
            },
            receiver_model: {
                type: String,
                required: [true, "Receiver model field is required"],
                enum: {
                    values: ['Client', 'Developer', 'Delegate', 'Admin'],
                    message: '{VALUE} is not supported'
                }
            },
            is_new: {
                type: Boolean,
                default: true
            }
        }
    ],
},
    {
        timestamps: true
    })

const Notification = model("Notification", NotificationSchema)
export default Notification